import { LayerVisibilityNotificationPlugin } from '../../../src/ea/plugins/LayerVisibilityNotificationPlugin.js';
import { setMapResolution } from '../../../src/ea/store/module/ea.action.js';
import { eaReducer } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { addLayer } from '../../../src/store/layers/layers.action';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { LevelTypes } from '../../../src/store/notifications/notifications.action.js';
import { notificationReducer, NOTIFICATION_ADDED } from '../../../src/store/notifications/notifications.reducer.js';
import { positionReducer } from '../../../src/store/position/position.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('LayerVisibilityNotificationPlugin', () => {

	const wmsCapabilitiesServiceMock = { getWmsLayers: () => ([]) };

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
			ea: eaReducer
		});

		$injector
			.registerSingleton('WmsCapabilitiesService', wmsCapabilitiesServiceMock)
			.registerSingleton('TranslationService', translationServiceMock);

		const instanceUnderTest = new LayerVisibilityNotificationPlugin();
		await instanceUnderTest.register(store);

		spyOn(wmsCapabilitiesServiceMock, 'getWmsLayers')
			.withArgs('id1').and.returnValue([layerItem1, layerItem2]);

		return store;
	};


	it('shows a notification if switching from active to inactive layer for wms', async () => {
		await setup();

		addLayer('id1', { label: 'wms' });
		setMapResolution(10);
		await TestUtils.timeout();

		setMapResolution(50);
		setMapResolution(55);
		await TestUtils.timeout();

		const notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(1);
		expect(notificationActions[0].payload._payload).toEqual({
			content: '"wms" ea_notification_layer_not_visible',
			level: LevelTypes.INFO
		});
	});

	it('does not show notification if switching from inactive to active layer for wms', async () => {
		await setup();

		addLayer('id1');
		setMapResolution(50);
		await TestUtils.timeout();

		storeActions.length = 0;

		setMapResolution(90);
		await TestUtils.timeout();

		const notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(0);
	});

	it('does not show a notification if switching form active to another activ layer for wms', async () => {
		await setup();

		addLayer('id1');
		setMapResolution(10);
		await TestUtils.timeout();

		setMapResolution(90);
		await TestUtils.timeout();

		const notificationActions = storeActions.filter(a => a.type === NOTIFICATION_ADDED);
		expect(notificationActions.length).toBe(0);
	});
});
