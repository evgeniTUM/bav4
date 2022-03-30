import { combineReducers, createStore } from 'redux';
import { positionReducer } from '../store/position/position.reducer';
import { layersReducer } from '../store/layers/layers.reducer';
import { $injector } from '../injection';
import { topicsReducer } from '../store/topics/topics.reducer';
import { networkReducer } from '../store/network/network.reducer';
import { searchReducer } from '../store/search/search.reducer';
import { highlightReducer } from '../store/highlight/highlight.reducer';
import { notificationReducer } from '../store/notifications/notifications.reducer';
import { createMediaReducer } from '../store/media/media.reducer';
import { topicsContentPanelReducer } from '../store/topicsContentPanel/topicsContentPanel.reducer';
import { modalReducer } from '../store/modal/modal.reducer';
import { toolsReducer } from '../store/tools/tools.reducer';
import { drawReducer } from '../store/draw/draw.reducer';
import { sharedReducer } from '../store/shared/shared.reducer';
import { geolocationReducer } from '../store/geolocation/geolocation.reducer';
import { mapReducer } from '../store/map/map.reducer';
import { measurementReducer } from '../store/measurement/measurement.reducer';
import { pointerReducer, POINTER_MOVE_CHANGED } from '../store/pointer/pointer.reducer';
import { mapContextMenuReducer } from '../store/mapContextMenu/mapContextMenu.reducer';
import { createMainMenuReducer } from '../store/mainMenu/mainMenu.reducer';
import { featureInfoReducer } from '../store/featureInfo/featureInfo.reducer';
import { importReducer } from '../store/import/import.reducer';
import { contributeReducer } from '../store/ea/contribute/contribute.reducer'

import { fnModuleCommReducer } from '../ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../ea/store/geofeature/geofeature.reducer';
//import { geopresentReducer } from '../ea/store/geopresent/geopresent.reducer';


/**
 * Service which configures, initializes and holds the redux store.
 * @class
 * @author taulinger
 */
export class StoreService {

	constructor() {

		const rootReducer = combineReducers({
			/*
			 * must be named like the field of the state
			 * see: https://redux.js.org/recipes/structuring-reducers/initializing-state#combined-reducers
			 */
			map: mapReducer,
			pointer: pointerReducer,
			position: positionReducer,
			mainMenu: createMainMenuReducer(),
			tools: toolsReducer,
			modal: modalReducer,
			layers: layersReducer,
			mapContextMenu: mapContextMenuReducer,
			measurement: measurementReducer,
			draw: drawReducer,
			shared: sharedReducer,
			geolocation: geolocationReducer,
			topics: topicsReducer,
			network: networkReducer,
			search: searchReducer,
			topicsContentPanel: topicsContentPanelReducer,
			highlight: highlightReducer,
			notifications: notificationReducer,
			featureInfo: featureInfoReducer,
			contribute: contributeReducer,
			media: createMediaReducer(),
			import: importReducer,
			geofeature: geofeatureReducer,
			fnModuleComm: fnModuleCommReducer
		});

		this._store = createStore(rootReducer);

		$injector.onReady(async () => {

			const {
				LayersPlugin: layersPlugin,
				TopicsPlugin: topicsPlugin,
				GeolocationPlugin: geolocationPlugin,
				MeasurementPlugin: measurementPlugin,
				DrawPlugin: drawPlugin,
				PositionPlugin: positionPlugin,
				ContextClickPlugin: contextClickPlugin,
				HighlightPlugin: highlightPlugin,
				MediaPlugin: mediaPlugin,
				FeatureInfoPlugin: featureInfoPlugin,
				MainMenuPlugin: mainMenuPlugin,
				EnvironmentService: environmentService,
				ImportPlugin: importPlugin,
				ConfigService: configService,
				GeoFeaturePlugin: geoFeaturePlugin,
				FnModulePlugin: fnModulePlugin
			}
				= $injector.inject(
					'TopicsPlugin',
					'LayersPlugin',
					'GeolocationPlugin',
					'MeasurementPlugin',
					'DrawPlugin',
					'PositionPlugin',
					'ContextClickPlugin',
					'HighlightPlugin',
					'MediaPlugin',
					'FeatureInfoPlugin',
					'MainMenuPlugin',
					'EnvironmentService',
					'ImportPlugin',
					'ConfigService',
					'GeoFeaturePlugin',
					'FnModulePlugin'
				);

			setTimeout(async () => {
				//register plugins
				await mediaPlugin.register(this._store);
				await topicsPlugin.register(this._store);
				await layersPlugin.register(this._store);
				await positionPlugin.register(this._store);
				await measurementPlugin.register(this._store);
				await drawPlugin.register(this._store);
				await geolocationPlugin.register(this._store);
				await contextClickPlugin.register(this._store);
				await highlightPlugin.register(this._store);
				await featureInfoPlugin.register(this._store);
				await mainMenuPlugin.register(this._store);
				await importPlugin.register(this._store);
				await geoFeaturePlugin.register(this._store);
				await fnModulePlugin.register(this._store);
				//we remove all query params shown in the browsers address bar
				if (configService.getValue('RUNTIME_MODE') !== 'development') {
					environmentService.getWindow().history.replaceState(null, '', location.href.split('?')[0]);
				}
			});
		});
	}

	/**
	 * Returns the fully initialized store.
	 */
	getStore() {
		return this._store;
	}
}
