import { LayerVisibilityNotificationPlugin } from '../../../src/ea/plugins/LayerVisibilityNotificationPlugin.js';
import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { addLayer } from '../../../src/store/layers/layers.action';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { LevelTypes } from '../../../src/store/notifications/notifications.action.js';
import { notificationReducer, NOTIFICATION_ADDED } from '../../../src/store/notifications/notifications.reducer.js';
import { changeZoom } from '../../../src/store/position/position.action.js';
import { positionReducer } from '../../../src/store/position/position.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('LayerVisibilityNotificationPlugin', () => {

	const wmsCapabilitiesServiceMock = { getWmsLayers: () => ([]) };

	const mapServiceMock = {
		calcResolution: () => {
			return 50;
		},
		getMaxZoomLevel: () => 100,
		getMinZoomLevel: () => 0
	};

	const translationServiceMock = {
		translate: key => key
	};

	const storeActions = [];

	const layerItem1 = {
		title: 'title1',
		minResolution: 20,
		maxResolution: 0,
		legendUrl: 'https://url1/img'
	};

	const layerItem2 = {
		title: 'title2',
		minResolution: 100,
		maxResolution: 80,
		legendUrl: 'https://url2/img'
	};


	const setup = async (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			layers: layersReducer,
			position: positionReducer,
			notification: notificationReducer,
			module: moduleReducer
		});

		$injector
			.registerSingleton('WmsCapabilitiesService', wmsCapabilitiesServiceMock)
			.registerSingleton('MapService', mapServiceMock)
			.registerSingleton('TranslationService', translationServiceMock);

		const instanceUnderTest = new LayerVisibilityNotificationPlugin();
		await instanceUnderTest.register(store);

		spyOn(wmsCapabilitiesServiceMock, 'getWmsLayers')
			.withArgs('id1').and.returnValue([layerItem1, layerItem2]);


		return store;
	};

	it('shows a notification on zoom change and a active layer not visible anymore', async () => {

		const store = await setup();
		const center = store.getState().position.center;
		spyOn(mapServiceMock, 'calcResolution')
			.withArgs(1, center).and.returnValue(10)
			.withArgs(2, center).and.returnValue(50)
			.withArgs(3, center).and.returnValue(55)
			.withArgs(4, center).and.returnValue(90);

		const waitForAsyncFunctionsToRun = new Promise(r => setTimeout(r));

		changeZoom(1);
		addLayer('id1');
		await waitForAsyncFunctionsToRun;

		let notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(0);


		changeZoom(2);
		await waitForAsyncFunctionsToRun;

		notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(1);
		expect(notificationActions[0].payload._payload).toEqual({
			content: '"title1" ea_notification_layer_not_visible',
			level: LevelTypes.INFO
		});

		storeActions.length = 0;
		changeZoom(3);
		changeZoom(4);
		await waitForAsyncFunctionsToRun;

		notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(0);
	});
});
