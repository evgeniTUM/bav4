import { $injector } from '../../src/injection';
import { StoreService } from '../../src/services/StoreService';
import { TestUtils } from '../test-utils';

describe('StoreService', () => {
	describe('constructor', () => {
		const topicsServiceMock = {
			init: () => {}
		};
		const geoResourceServiceMock = {
			init: () => {}
		};
		const measurementPluginMock = {
			register: () => {}
		};
		const drawPluginMock = {
			register: () => {}
		};
		const routingPluginMock = {
			register: () => {}
		};
		const geolocationPluginMock = {
			register: () => {}
		};
		const layersPluginMock = {
			register: () => {}
		};
		const topicsPluginMock = {
			register: () => {}
		};
		const positionPluginMock = {
			register() {}
		};
		const contextClickPluginMock = {
			register() {}
		};
		const highlightPluginMock = {
			register() {}
		};
		const featureInfoPluginMock = {
			register() {}
		};
		const importPluginMock = {
			register: () => {}
		};
		const searchPluginMock = {
			register: () => {}
		};
		const exportMfpPluginMock = {
			register: () => {}
		};
		const mainMenuPluginMock = {
			register() {}
		};
		const navigationRailPluginMock = {
			register() {}
		};
		const mediaPluginMock = {
			register() {}
		};
		const fnModulePluginMock = {
			register() {}
		};

		const manageModulesPluginMock = {
			register() {}
		};

		const legendPluginMock = {
			register() {}
		};
		const chipsPlugin = {
			register() {}
		};
		const elevationProfilePluginMock = {
			register() {}
		};
		const iframeStatePluginMock = {
			register: () => {}
		};
		const iframeContainerPluginMock = {
			register: () => {}
		};
		const sharePluginMock = {
			register: () => {}
		};
		const toolsPluginMock = {
			register: () => {}
		};
		const beforeUnloadPluginMock = {
			register: () => {}
		};
		const iframeGeometryIdPluginMock = {
			register: () => {}
		};
		const historyStatePluginMock = {
			register: () => {}
		};
		const observeStateForEncodingPluginMock = {
			register: () => {}
		};

		const layerVisibilityNotificationPluginMock = {
			register() {}
		};

		const WebAnalyticsPluginMock = {
			register() {}
		};

		const InfoPopupPluginMock = {
			register() {}
		};
		const setupInjector = () => {
			$injector
				.reset()
				.registerSingleton('TopicsService', topicsServiceMock)
				.registerSingleton('GeoResourceService', geoResourceServiceMock)
				.registerSingleton('MeasurementPlugin', measurementPluginMock)
				.registerSingleton('DrawPlugin', drawPluginMock)
				.registerSingleton('RoutingPlugin', routingPluginMock)
				.registerSingleton('GeolocationPlugin', geolocationPluginMock)
				.registerSingleton('LayersPlugin', layersPluginMock)
				.registerSingleton('TopicsPlugin', topicsPluginMock)
				.registerSingleton('PositionPlugin', positionPluginMock)
				.registerSingleton('ContextClickPlugin', contextClickPluginMock)
				.registerSingleton('HighlightPlugin', highlightPluginMock)
				.registerSingleton('FeatureInfoPlugin', featureInfoPluginMock)
				.registerSingleton('MainMenuPlugin', mainMenuPluginMock)
				.registerSingleton('NavigationRailPlugin', navigationRailPluginMock)
				.registerSingleton('MediaPlugin', mediaPluginMock)
				.registerSingleton('ImportPlugin', importPluginMock)
				.registerSingleton('FnModulePlugin', fnModulePluginMock)
				.registerSingleton('ManageModulesPlugin', manageModulesPluginMock)
				.registerSingleton('LegendPlugin', legendPluginMock)
				.registerSingleton('WebAnalyticsPlugin', WebAnalyticsPluginMock)
				.registerSingleton('InfoPopupPlugin', InfoPopupPluginMock)
				.registerSingleton('LayerVisibilityNotificationPlugin', layerVisibilityNotificationPluginMock)
				.registerSingleton('SearchPlugin', searchPluginMock)
				.registerSingleton('ExportMfpPlugin', exportMfpPluginMock)
				.registerSingleton('ElevationProfilePlugin', elevationProfilePluginMock)
				.registerSingleton('ChipsPlugin', chipsPlugin)
				.registerSingleton('IframeStatePlugin', iframeStatePluginMock)
				.registerSingleton('IframeContainerPlugin', iframeContainerPluginMock)
				.registerSingleton('SharePlugin', sharePluginMock)
				.registerSingleton('ToolsPlugin', toolsPluginMock)
				.registerSingleton('BeforeUnloadPlugin', beforeUnloadPluginMock)
				.registerSingleton('IframeGeometryIdPlugin', iframeGeometryIdPluginMock)
				.registerSingleton('HistoryStatePlugin', historyStatePluginMock)
				.registerSingleton('ObserveStateForEncodingPlugin', observeStateForEncodingPluginMock)

				.ready();
		};

		it('registers all reducers', () => {
			const instanceUnderTest = new StoreService();

			const store = instanceUnderTest.getStore();
			expect(store).toBeDefined();

			const reducerKeys = Object.keys(store.getState());
			expect(reducerKeys.length).toBe(34);
			expect(reducerKeys.includes('map')).toBeTrue();
			expect(reducerKeys.includes('pointer')).toBeTrue();
			expect(reducerKeys.includes('position')).toBeTrue();
			expect(reducerKeys.includes('mainMenu')).toBeTrue();
			expect(reducerKeys.includes('tools')).toBeTrue();
			expect(reducerKeys.includes('modal')).toBeTrue();
			expect(reducerKeys.includes('layers')).toBeTrue();
			expect(reducerKeys.includes('mapContextMenu')).toBeTrue();
			expect(reducerKeys.includes('measurement')).toBeTrue();
			expect(reducerKeys.includes('draw')).toBeTrue();
			expect(reducerKeys.includes('shared')).toBeTrue();
			expect(reducerKeys.includes('geolocation')).toBeTrue();
			expect(reducerKeys.includes('topics')).toBeTrue();
			expect(reducerKeys.includes('network')).toBeTrue();
			expect(reducerKeys.includes('search')).toBeTrue();
			expect(reducerKeys.includes('topicsContentPanel')).toBeTrue();
			expect(reducerKeys.includes('highlight')).toBeTrue();
			expect(reducerKeys.includes('notifications')).toBeTrue();
			expect(reducerKeys.includes('featureInfo')).toBeTrue();
			expect(reducerKeys.includes('media')).toBeTrue();
			expect(reducerKeys.includes('import')).toBeTrue();
			expect(reducerKeys.includes('locationSelection')).toBeTrue();
			expect(reducerKeys.includes('fnModuleComm')).toBeTrue();
			expect(reducerKeys.includes('geofeature')).toBeTrue();
			expect(reducerKeys.includes('mapclick')).toBeTrue();
			expect(reducerKeys.includes('ea')).toBeTrue();
			expect(reducerKeys.includes('mfp')).toBeTrue();
			expect(reducerKeys.includes('bottomSheet')).toBeTrue();
			expect(reducerKeys.includes('elevationProfile')).toBeTrue();
			expect(reducerKeys.includes('chips')).toBeTrue();
			expect(reducerKeys.includes('stateForEncoding')).toBeTrue();
			expect(reducerKeys.includes('iframeContainer')).toBeTrue();
			expect(reducerKeys.includes('routing')).toBeTrue();
			expect(reducerKeys.includes('navigationRail')).toBeTrue();
		});

		it('registers all plugins', async () => {
			const measurementPluginSpy = spyOn(measurementPluginMock, 'register');
			const drawPluginSpy = spyOn(drawPluginMock, 'register');
			const routingPluginSpy = spyOn(routingPluginMock, 'register');
			const geolocationPluginSpy = spyOn(geolocationPluginMock, 'register');
			const layersPluginSpy = spyOn(layersPluginMock, 'register');
			const topicsPluginSpy = spyOn(topicsPluginMock, 'register');
			const positionPluginSpy = spyOn(positionPluginMock, 'register');
			const contextClickPluginSpy = spyOn(contextClickPluginMock, 'register');
			const highlightPluginSpy = spyOn(highlightPluginMock, 'register');
			const featureInfoPluginSpy = spyOn(featureInfoPluginMock, 'register');
			const mainMenuPluginSpy = spyOn(mainMenuPluginMock, 'register');
			const navigationRailPluginSpy = spyOn(navigationRailPluginMock, 'register');
			const mediaPluginSpy = spyOn(mediaPluginMock, 'register');
			const importPluginSpy = spyOn(importPluginMock, 'register');
			const fnModulePluginSpy = spyOn(fnModulePluginMock, 'register');
			const manageModulesPlugingSpy = spyOn(manageModulesPluginMock, 'register');
			const legendPluginSpy = spyOn(legendPluginMock, 'register');
			const WebAnalyticsPluginSpy = spyOn(WebAnalyticsPluginMock, 'register');
			const InfoPopupPluginSpy = spyOn(InfoPopupPluginMock, 'register');
			const layerVisibilityNotificationPluginSpy = spyOn(layerVisibilityNotificationPluginMock, 'register');
			const searchPluginSpy = spyOn(searchPluginMock, 'register');
			const exportMfpPluginSpy = spyOn(exportMfpPluginMock, 'register');
			const elevationProfilePluginSpy = spyOn(elevationProfilePluginMock, 'register');
			const iframeStatePluginSpy = spyOn(iframeStatePluginMock, 'register');
			const iframeContainerPluginSpy = spyOn(iframeContainerPluginMock, 'register');
			const sharePluginSpy = spyOn(sharePluginMock, 'register');
			const toolsPluginSpy = spyOn(toolsPluginMock, 'register');
			const beforeUnloadPluginSpy = spyOn(beforeUnloadPluginMock, 'register');
			const iframeGeometryIdPluginSpy = spyOn(iframeGeometryIdPluginMock, 'register');
			const historyStatePluginSpy = spyOn(historyStatePluginMock, 'register');
			const observeStateForEncodingPluginSpy = spyOn(observeStateForEncodingPluginMock, 'register');
			const instanceUnderTest = new StoreService();

			setupInjector();
			const store = instanceUnderTest.getStore();

			//we need two timeout calls: async plugins registration is done within a timeout function
			await TestUtils.timeout();
			await TestUtils.timeout();

			expect(measurementPluginSpy).toHaveBeenCalledWith(store);
			expect(drawPluginSpy).toHaveBeenCalledWith(store);
			expect(routingPluginSpy).toHaveBeenCalledWith(store);
			expect(geolocationPluginSpy).toHaveBeenCalledWith(store);
			expect(layersPluginSpy).toHaveBeenCalledWith(store);
			expect(topicsPluginSpy).toHaveBeenCalledWith(store);
			expect(positionPluginSpy).toHaveBeenCalledWith(store);
			expect(contextClickPluginSpy).toHaveBeenCalledWith(store);
			expect(highlightPluginSpy).toHaveBeenCalledWith(store);
			expect(featureInfoPluginSpy).toHaveBeenCalledWith(store);
			expect(mainMenuPluginSpy).toHaveBeenCalledWith(store);
			expect(navigationRailPluginSpy).toHaveBeenCalledWith(store);
			expect(mediaPluginSpy).toHaveBeenCalledWith(store);
			expect(importPluginSpy).toHaveBeenCalledWith(store);
			expect(fnModulePluginSpy).toHaveBeenCalledWith(store);
			expect(manageModulesPlugingSpy).toHaveBeenCalledWith(store);
			expect(legendPluginSpy).toHaveBeenCalledWith(store);
			expect(InfoPopupPluginSpy).toHaveBeenCalledWith(store);
			expect(WebAnalyticsPluginSpy).toHaveBeenCalledWith(store);
			expect(layerVisibilityNotificationPluginSpy).toHaveBeenCalledWith(store);
			expect(searchPluginSpy).toHaveBeenCalledWith(store);
			expect(exportMfpPluginSpy).toHaveBeenCalledWith(store);
			expect(elevationProfilePluginSpy).toHaveBeenCalledWith(store);
			expect(iframeStatePluginSpy).toHaveBeenCalledWith(store);
			expect(iframeContainerPluginSpy).toHaveBeenCalledWith(store);
			expect(sharePluginSpy).toHaveBeenCalledWith(store);
			expect(toolsPluginSpy).toHaveBeenCalledWith(store);
			expect(beforeUnloadPluginSpy).toHaveBeenCalledWith(store);
			expect(iframeGeometryIdPluginSpy).toHaveBeenCalledWith(store);
			expect(historyStatePluginSpy).toHaveBeenCalledWith(store);
			expect(observeStateForEncodingPluginSpy).toHaveBeenCalledWith(store);
		});
	});
});
