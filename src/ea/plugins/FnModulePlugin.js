import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { observe } from '../../utils/storeUtils';
import { addGeoFeatureLayer, addGeoFeatures, clearMap, removeGeoFeatures } from '../store/geofeature/geofeature.action';
import { activateMapClick, deactivateMapClick } from '../store/mapclick/mapclick.action';


const MODULE_HANDSHAKE = 'handshake';
const MODULE_RESET = 'reset';
// const ADD_GEOMETRY = 'geoadd';
// const REMOVE_GEOMETRY = 'georemove';
const ADD_FEATURE = 'addfeature';
const REMOVE_FEATURE_BY_ID = 'removefeature';
const CLEAR_MAP = 'clearmap';
const ADD_LAYER = 'addlayer';
const REMOVE_LAYER = 'removelayer';
const CLEAR_LAYER = 'clearLayer';
const ZOOM = 'zoomToLevel';
const ZOOM_2_EXTENT = 'zoom2Extent';
const ZOOM_N_CENTER_TO_FEATURE = 'zoomAndCenter';
const ZOOM_EXPAND = 'expandto';
const CLICK_IN_MAP_SIMULATION = 'clickInMap';
const ACTIVATE_MAPCLICK = 'activate_mapclick';
const CANCEL_MAPCLICK = 'cancel_mapclick';

/**
 * @class
 * @author gkunze
 */
export class FnModulePlugin extends BaPlugin {

	fnModuleMessageListener(e) {
		const event = (e.message !== undefined) ? e.message : e;
		const data = event.data;

		const {
			StoreService: storeService
		}
			= $injector.inject('StoreService');

		this._storeService = storeService;

		const state = this._storeService.getStore().getState();

		const { fnModuleComm: { module } } = state;
		const { fnModuleComm: { domain } } = state;

		if (data.module === undefined || data.message === undefined || module === undefined || domain === undefined) {
			return;
		}

		const message = data.message;

		switch (data.code) {
			case MODULE_HANDSHAKE:
				break;
			case ADD_LAYER:
				addGeoFeatureLayer(message.layerId);
				break;
			case MODULE_RESET:
				break;
			case ADD_FEATURE:
				addGeoFeatures(message.layerId, message.geojson.features);
				break;
			case REMOVE_FEATURE_BY_ID:
				removeGeoFeatures(message.layerId, [message.id]);
				break;
			case CLEAR_MAP:
				clearMap();
				break;
			case REMOVE_LAYER:
				break;
			case CLEAR_LAYER:
				clearMap();
				break;
			case ZOOM:
				break;
			case ZOOM_2_EXTENT:
				break;
			case ZOOM_N_CENTER_TO_FEATURE:
				break;
			case ZOOM_EXPAND:
				break;
			case CLICK_IN_MAP_SIMULATION:
				break;
			case ACTIVATE_MAPCLICK:
				activateMapClick(message);
				break;
			case CANCEL_MAPCLICK:
				deactivateMapClick();
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
				this.implPostCodeMessageFnModule('open', scope.module, scope.domain, targetWindow);
			}
			else {
				//deaktiviere das Module
				clearMap();
				this.implPostCodeMessageFnModule('close', scope.module, scope.domain, targetWindow);
			}
		};

		const sendCoordinate = (evt, state) => {
			const { payload: { coordinate } } = evt;
			const _coord = coordinateService.toLonLat(coordinate);
			if (state.mapclick.active) {
				const scope = state.fnModuleComm;
				const json = {
					code: 'mapclick',
					module: scope.module,
					id: state.mapclick.listener_id,
					coord: _coord.toString()
				};
				const iframeWindow = window.ea_moduleWindow[scope.module];
				iframeWindow.postMessage(json, scope.domain);
			}
		};

		observe(store, state => state.fnModuleComm.active, onChange);
		observe(store, state => state.pointer.click, sendCoordinate);

	}
}
