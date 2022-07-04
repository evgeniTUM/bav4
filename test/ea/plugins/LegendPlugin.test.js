import { LegendPlugin } from '../../../src/ea/plugins/LegendPlugin.js';
import { setPreviewGeoresourceId } from '../../../src/ea/store/module/module.action.js';
import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { addLayer } from '../../../src/store/layers/layers.action';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('ManageModulesPlugin', () => {

	const geoResourceServiceMock = { byId: () => ({ label: 'label' }) };

	const storeActions = [];

	const setup = (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			module: moduleReducer
		});

		$injector
			.registerSingleton('GeoResourceService', geoResourceServiceMock);
		return store;
	};

	const layerItem1 = {
		title: 'title1',
		minResolution: 100,
		maxResolution: 0,
		legendUrl: 'https://url1/img'
	};

	const layerItem2 = {
		title: 'title2',
		minResolution: 90,
		maxResolution: 10,
		legendUrl: 'https://url2/img'
	};

	const layerItem3 = {
		title: 'title3',
		minResolution: 80,
		maxResolution: 20,
		legendUrl: 'https://url2/img'
	};

	const mockWmsLayerItems = (obj) => {
		spyOn(obj, '_extractWmsLayerItems')
			.withArgs('id1').and.returnValue([layerItem1])
			.withArgs('id2').and.returnValue([layerItem2])
			.withArgs('id3').and.returnValue([layerItem3]);
	};

	it('creates legend items on active layer change', async () => {
		const store = await setup();
		const instanceUnderTest = new LegendPlugin();
		await instanceUnderTest.register(store);

		mockWmsLayerItems(instanceUnderTest);

		addLayer('id1');
		addLayer('id2');

		setTimeout(() => {
			expect(store.getState().module.legendItems).toEqual([layerItem1, layerItem2]);
		});
	});

	it('create preview layers items first', async () => {
		const store = await setup();
		const instanceUnderTest = new LegendPlugin();
		await instanceUnderTest.register(store);

		mockWmsLayerItems(instanceUnderTest);

		addLayer('id3');
		setPreviewGeoresourceId('id2');
		addLayer('id1');

		setTimeout(() => {
			expect(store.getState().module.legendItems).toEqual([layerItem2, layerItem1, layerItem3]);
		});
	});

	it('sorts active layers alphabetically', async () => {
		const store = await setup();
		const instanceUnderTest = new LegendPlugin();
		await instanceUnderTest.register(store);

		mockWmsLayerItems(instanceUnderTest);

		addLayer('id2');
		addLayer('id3');
		addLayer('id1');

		setTimeout(() => {
			expect(store.getState().module.legendItems).toEqual([layerItem1, layerItem2, layerItem3]);
		});
	});


	it('ignores preview layer if it is already active', async () => {
		const store = await setup();
		const instanceUnderTest = new LegendPlugin();
		await instanceUnderTest.register(store);

		mockWmsLayerItems(instanceUnderTest);

		addLayer('id1');
		setPreviewGeoresourceId('id1');

		setTimeout(() => {
			expect(store.getState().module.legendItems).toEqual([layerItem1]);
		});
	});

	it('clears preview layer if it is added to active layers', async () => {
		const store = await setup();
		const instanceUnderTest = new LegendPlugin();
		await instanceUnderTest.register(store);

		mockWmsLayerItems(instanceUnderTest);

		setPreviewGeoresourceId('id1');
		addLayer('id1');

		setTimeout(() => {
			expect(store.getState().module.legendItems).toEqual([layerItem1]);
		});
	});

});
