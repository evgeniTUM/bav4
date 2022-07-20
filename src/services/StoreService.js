import { combineReducers, createStore } from 'redux';
import { contributionReducer } from '../ea/store/contribution/contribution.reducer';
import { fnModuleCommReducer } from '../ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../ea/store/geofeature/geofeature.reducer';
import { mapclickReducer } from '../ea/store/mapclick/mapclick.reducer';
import { eaReducer } from '../ea/store/module/ea.reducer';
import { $injector } from '../injection';
import { drawReducer } from '../store/draw/draw.reducer';
import { featureInfoReducer } from '../store/featureInfo/featureInfo.reducer';
import { geolocationReducer } from '../store/geolocation/geolocation.reducer';
import { highlightReducer } from '../store/highlight/highlight.reducer';
import { importReducer } from '../store/import/import.reducer';
import { layersReducer } from '../store/layers/layers.reducer';
import { createMainMenuReducer } from '../store/mainMenu/mainMenu.reducer';
import { mapReducer } from '../store/map/map.reducer';
import { mapContextMenuReducer } from '../store/mapContextMenu/mapContextMenu.reducer';
import { measurementReducer } from '../store/measurement/measurement.reducer';
import { createMediaReducer } from '../store/media/media.reducer';
import { modalReducer } from '../store/modal/modal.reducer';
import { networkReducer } from '../store/network/network.reducer';
import { notificationReducer } from '../store/notifications/notifications.reducer';
import { pointerReducer } from '../store/pointer/pointer.reducer';
import { positionReducer } from '../store/position/position.reducer';
import { searchReducer } from '../store/search/search.reducer';
import { sharedReducer } from '../store/shared/shared.reducer';
import { toolsReducer } from '../store/tools/tools.reducer';
import { topicsReducer } from '../store/topics/topics.reducer';
import { topicsContentPanelReducer } from '../store/topicsContentPanel/topicsContentPanel.reducer';



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
			media: createMediaReducer(),
			mapclick: mapclickReducer,
			geofeature: geofeatureReducer,
			contribution: contributionReducer,
			fnModuleComm: fnModuleCommReducer,
			ea: eaReducer,
			import: importReducer
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
				ImportPlugin: importPlugin,
				ManageModulesPlugin: manageModulesPlugin,
				FnModulePlugin: fnModulePlugin,
				LegendPlugin: legendPlugin,
				LayerVisibilityNotificationPlugin: layerVisibilityNotificationPlugin,
				SearchPlugin: searchPlugin,
				HistoryStatePlugin: HistoryStatePlugin
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
					'ImportPlugin',
					'ManageModulesPlugin',
					'FnModulePlugin',
					'LegendPlugin',
					'LayerVisibilityNotificationPlugin',
					'SearchPlugin',
					'HistoryStatePlugin'
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
				await manageModulesPlugin.register(this._store);
				await fnModulePlugin.register(this._store);
				await legendPlugin.register(this._store);
				await layerVisibilityNotificationPlugin.register(this._store);
				await searchPlugin.register(this._store);
				await HistoryStatePlugin.register(this._store); // should be registered as last plugin
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
