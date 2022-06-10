import GeoJSON from 'ol/format/GeoJSON';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { abortOrReset } from '../../store/featureInfo/featureInfo.action';
import { setClick } from '../../store/pointer/pointer.action';
import { changeZoomAndCenter } from '../../store/position/position.action';
import { observe } from '../../utils/storeUtils';
import { addGeoFeatureLayer, addGeoFeatures, clearLayer, clearMap, removeGeoFeatures } from '../store/geofeature/geofeature.action';
import { activateMapClick, deactivateMapClick } from '../store/mapclick/mapclick.action';
import { activateGeoResource, deactivateAllGeoResources } from '../store/module/module.action';


const MODULE_HANDSHAKE = 'handshake';
const MODULE_RESET = 'reset';
const ADD_FEATURE = 'addfeature';
const REMOVE_FEATURE_BY_ID = 'removefeature';
const CLEAR_MAP = 'clearmap';
const ADD_LAYER = 'addlayer';
const REMOVE_LAYER = 'removelayer';
const ZOOM = 'zoomToLevel';
const ZOOM_2_EXTENT = 'zoom2Extent';
const ZOOM_N_CENTER_TO_FEATURE = 'zoomAndCenter';
const ZOOM_EXPAND = 'expandto';
const CLICK_IN_MAP_SIMULATION = 'clickInMap';
const ACTIVATE_MAPCLICK = 'activate_mapclick';
const CANCEL_MAPCLICK = 'cancel_mapclick';
const ACTIVATE_GEORESOURCE = 'activateGeoResource';
const DEACTIVATE_GEORESOURCE = 'deactivateGeoResource';

const buffer = { features: [] };
/**
 * @class
 * @author gkunze
 */
export class FnModulePlugin extends BaPlugin {


	fnModuleMessageListener(e) {
		const event = (e.message !== undefined) ? e.message : e;
		const data = event.data;

		const {
			StoreService: storeService,
			MapService: mapService
		}
			= $injector.inject('StoreService', 'MapService');

		this._storeService = storeService;
		this._mapService = mapService;

		const state = this._storeService.getStore().getState();

		const { fnModuleComm: { module } } = state;
		const { fnModuleComm: { domain } } = state;

		if (data.module === undefined || data.message === undefined || module === undefined || domain === undefined) {
			return;
		}

		const message = data.message;

		const getCoordinates = (geojson) => {
			const feature = new GeoJSON().readFeature(geojson);
			feature.getGeometry().transform('EPSG:' + 4326, 'EPSG:' + this._mapService.getSrid());
			feature.set('srid', 4326, true);
			return feature.getGeometry().getCoordinates();
		};

		switch (data.code) {
			case MODULE_HANDSHAKE:
				break;
			case ADD_LAYER:
				addGeoFeatureLayer({ id: message.layerId, draggable: message.draggable || false });
				break;
			case MODULE_RESET:
				break;
			case ADD_FEATURE: {
				const features = message.geojson.features.map(f => ({
					...f,
					style: message.style,
					expandTo: message.expandTo
				}));

				buffer.features = [...buffer.features, ...features];

				setTimeout(() => {
					if (buffer.features.length > 0) {
						addGeoFeatures(message.layerId, buffer.features);
						buffer.features = [];
					}
				}, 100);

				break;
			}
			case REMOVE_FEATURE_BY_ID:
				removeGeoFeatures(message.layerId, [message.id]);
				break;
			case CLEAR_MAP:
				clearLayer(message.toString());
				break;
			case REMOVE_LAYER:
				break;
			case ZOOM:
				break;
			case ZOOM_2_EXTENT:
				break;
			case ZOOM_N_CENTER_TO_FEATURE:
				changeZoomAndCenter({
					zoom: message.zoom,
					center: getCoordinates(message.geojson.features[0])
				});

				break;
			case ZOOM_EXPAND:
				break;
			case CLICK_IN_MAP_SIMULATION:
				setClick({ coordinate: getCoordinates(message.geojson.features[0]) });
				break;
			case ACTIVATE_MAPCLICK:
				activateMapClick(message);
				break;
			case CANCEL_MAPCLICK:
				deactivateMapClick();
				break;
			case ACTIVATE_GEORESOURCE:
				activateGeoResource(message);
				break;
			case DEACTIVATE_GEORESOURCE:
				deactivateAllGeoResources();
				break;
			default:
				console.error('unbeḱannter Code ' + data.code);
		}

	}

	implPostCodeMessageFnModule(code, module, domain, targetWindow) {
		//      console.debug('Client : implPostMessageFnModule -->  moduleSite ? ' + moduleSite + 'code ' + code);
		//      Überlegung, ob post und handshake für alle Kommunikationen eingesetzt wird
		if (module !== undefined) {
			const json = {
				code: code,
				module: module
			};

			targetWindow.postMessage(json, domain);
		}
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const { EnvironmentService: environmentService } = $injector.inject('EnvironmentService');
		const { CoordinateService: coordinateService } = $injector.inject('CoordinateService');

		const _window = environmentService.getWindow();

		_window.addEventListener('message', this.fnModuleMessageListener);

		const onChange = (active, state) => {

			const scope = state.fnModuleComm;
			const targetWindow = window.ea_moduleWindow[scope.module];

			if (active) {
				//aktiviere das Module
				//sende per postMessage
				buffer.features = [];
				this.implPostCodeMessageFnModule('open', scope.module, scope.domain, targetWindow);
			}
			else {
				//deaktiviere das Module
				clearMap();
				deactivateAllGeoResources();
				abortOrReset();
				buffer.features = [];
				this.implPostCodeMessageFnModule('close', scope.module, scope.domain, targetWindow);
			}
		};

		const sendCoordinate = (evt, state) => {
			const _coord = coordinateService.toLonLat(evt.payload);
			const scope = state.fnModuleComm;
			const json = {
				code: 'mapclick',
				module: scope.module,
				id: state.mapclick.listener_id,
				coord: _coord.toString()
			};
			const iframeWindow = window.ea_moduleWindow[scope.module];
			iframeWindow.postMessage(json, scope.domain);
		};

		observe(store, state => state.fnModuleComm.active, onChange);
		observe(store, state => state.mapclick.coordinate, sendCoordinate);

	}
}
