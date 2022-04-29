import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { observe } from '../../utils/storeUtils';
import { addGeoFeatureLayer, addGeoFeatures, clearLayers, removeGeoFeatures } from '../store/geofeature/geofeature.action';
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

	constructor() {
		super();
		//		const { FnModuleCommunicationService: fnModuleCommunicationService, MapService: mapService }
		//			= $injector.inject('FnModuleCommunicationService', 'MapService');
		//		this._fnModuleCommunicationService = fnModuleCommunicationService;
		//		this._mapService = mapService;
	}

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

		// const _layers = {};

		//		const implAddLayer = function(layerId, layergroup, draggable) {
		//			console.debug('Client : implAddLayer -----> ' + layerId + ' group ' + layergroup + ' draggable' + draggable);
		//			//TODO wie bekomme ich die Layers aus der Map ?
		//
		////			const vector0 = new VectorGeoResource('huetten', 'Hütten', VectorSourceType.GEOJSON).data('http://www.geodaten.bayern.de/ba-data/Themen/kml/huetten.kml');
		////			const vector1 = new VectorGeoResource('huetten', 'Hütten', VectorSourceType.GEOJSON).setUrl('http://www.geodaten.bayern.de/ba-data/Themen/kml/huetten.kml');
		////			const aggregate0 = new AggregateGeoResource('aggregate0', 'Aggregate', ['vector0', 'vector1']);
		//
		//			let olLayers = state.layers;
		//			let arrayLength = olLayers.length;
		//			for (let i = 0; i < arrayLength; i++) {
		//				if (olLayers[i].get('layerid') === layerId) {
		//					layers[layerId] = olLayers[i];
		//					/* eslint no-throw-literal: "off" */
		//					throw {'LayerId ': layerId, message: ' ist bereits in der Map registriert'};
		//					// return;
		//				}
		//			}
		//			//TODO Layers wurde noch nicht in der Map gefunden
		//			if (_layers[layerId] === undefined) {
		//				try {
		//
		//					console.debug('Client : implAddLayer ----->  set  draggable' + draggable);
		//					_layers[GEO_FEATURE_LAYER_ID] = addLayer(GEO_FEATURE_LAYER_ID, { constraints: {alwaysTop: true } });
		////					_layers[layerId] = addLayer(layerId, {group: {layergroup, constraints: {alwaysTop: true}}});
		//
		////Mache Layer draggable
		//
		////				if (draggable === 'true') {
		////					drag = new ol.interaction.Translate({this._layers: [layer]});
		////					map.addInteraction(drag);
		////				}
		//
		//					console.debug('Client : addLayer -----> ' + _layers[layerId]);
		//					console.debug(_layers);
		//				} catch (ex) {
		//					console.error('Client : exception in implAddLayer');
		//					console.error(ex);
		//				}
		//			} else {
		//				/* eslint no-throw-literal: "off" */
		//				//          console.debug('this._layers[layerId]' + this._layers[layerId]);
		//				throw {'LayerId ': layerId, message: ' ist bereits in der HashMap eingetragen'};
		//			}
		//		};
		// console.log('Client MessageListner : ***** M e s s a g e ****  e m p f a n g e n ****** code:' + data.code +
		// 	' module ' + data.module +
		// 	' absender ' + event.origin +
		// 	' message:' + data.message);
		//wieder einkommentieren
		//			if (event.origin !== domain|| data.module === undefined) {
		//				console.warn('Client MessageListner:  ModuleDomain ' + domain + ' passt nicht zu ' + event.origin);
		//				return;
		//			}
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
				removeGeoFeatures([message.id]);
				break;
			case CLEAR_MAP:
				clearLayers();
				break;
			case REMOVE_LAYER:
				break;
			case CLEAR_LAYER:
				clearLayers();
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

		//todo todo todo send action event mit message
		//
		//                console.debug($(myMessageEventListener));

		//                !!!! message eventlistner muss eindeutig sein
		// data.code reicht nicht, deher muss module für die identifizierung eingesetzt werden
		//		let eventListener = myMessageEventListener[data.module][data.code];
		//		if (eventListener !== undefined && data.code === eventListener.myEventCode && eventListener.myCallBack !== undefined) {
		//			//                  console.debug('Client MessageListner: valid eventListener found');
		//			eventListener.myCallBack(data.message);
		//			// set communication line free
		//			//                  implSetModuleCommunicationFree(pScope, moduleSite);
		//		} else {
		//			console.error('Client MessageListener: event listener  for callback not found for module' + data.module + ' Code ' + data.code);
		//		}
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
				clearLayers();
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
