import { observe } from '../../utils/storeUtils';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';

//import { addLayer, removeLayer } from '../layers/layers.action';

const MODULE_HANDSHAKE = 'handshake';
const MODULE_RESET = 'reset';
const ADD_GEOMETRY = 'geoadd';
const REMOVE_GEOMETRY = 'georemove';
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

	fnModuleMessageListener = function(e) {
		
		const {
			StoreService: storeService
		} = $injector.inject('StoreService');
		
		console.log('client : fnModuleMessageListener');
		console.log(e);
		let event = ( e.message !== undefined ) ? e.message : e ;
		let data = event.data;
		let state = storeService.getStore().getState();
		
		const { fnModuleComm: { fnModuleSite } } = state;
		const { fnModuleComm: { fnModuleDomain } } = state;
		
		
		console.log('Client MessageListner : ***** M e s s a g e ****  e m p f a n g e n ****** code:' + data.code +
		                                        ' module ' + data.module +
		                                        ' absender ' + event.origin +
		                                        ' message:' + data.message);
		if (event.origin !== fnModuleDomain || data.module === undefined) {
			console.warn('Client MessageListner:  ModuleDomain ' + fnModuleDomain + ' passt nicht zu ' + event.origin);
			return;
		}
		
		switch ( data.code ) {
			case MODULE_HANDSHAKE: 
				break;
			case MODULE_RESET:
				break;
			case ADD_GEOMETRY:
				break;
			case REMOVE_GEOMETRY:  
				break;
			case ADD_FEATURE:  
				break;
			case REMOVE_FEATURE_BY_ID:  
				break;
			case CLEAR_MAP:  
				break;
			case ADD_LAYER:  
				break;
			case REMOVE_LAYER:  
				break;
			case CLEAR_LAYER:  
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
				break;
			case CANCEL_MAPCLICK:  
				break;
			default: 
				console.error('unbeḱannter Code ' + data.code);
		}
		
		//todo todo todo send action event mit message
		//
		//                $log.debug($(myMessageEventListener));

		//                !!!! message eventlistner muss eindeutig sein
		// data.code reicht nicht, deher muss module für die identifizierung eingesetzt werden
//		let eventListener = myMessageEventListener[data.module][data.code];
//		if (eventListener !== undefined && data.code === eventListener.myEventCode && eventListener.myCallBack !== undefined) {
//			//                  $log.debug('Client MessageListner: valid eventListener found');
//			eventListener.myCallBack(data.message);
//			// set communication line free
//			//                  implSetModuleCommunicationFree(pScope, moduleSite);
//		} else {
//			$log.error('Client MessageListener: event listener  for callback not found for module' + data.module + ' Code ' + data.code);
//		}
	}

	implPostCodeMessageFnModule = function(code, moduleSite, myModuleDomain, targetWindow) {
		//      $log.debug('Client : implPostMessageFnModule -->  moduleSite ? ' + moduleSite + 'code ' + code);
		//      Überlegung, ob post und handshake für alle Kommunikationen eingesetzt wird
		if (moduleSite !== undefined) {
			let param = '{ "code" : "' + code + '", "module" : "' + moduleSite + '"}';
			targetWindow.postMessage(JSON.parse(param), myModuleDomain);
		}

	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		console.log(' register FnModulePlugin onChange ');

		const {EnvironmentService: environmentService} = $injector.inject('EnvironmentService');

		const _window = environmentService.getWindow();

		_window.addEventListener('message', this.fnModuleMessageListener);

		const onChange = (active, state) => {

			console.log(active + ' FnModulePlugin onChange ');
			let scope = state.fnModuleComm;
			console.log(scope);

			if (active) {
				//aktiviere das Module
				//sende per postMessage
				this.implPostCodeMessageFnModule('open', scope.fnModuleSite, scope.fnModuleDomain, scope.fnModuleWindow);
			} else {
				//deaktiviere das Module
				this.implPostCodeMessageFnModule('close', scope.fnModuleSite, scope.fnModuleDomain, scope.fnModuleWindow);
			}
		};
		observe(store, state => state.fnModuleComm.active, onChange);
	}
}
