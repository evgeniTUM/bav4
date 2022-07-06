import { LegendPlugin } from '../../../src/ea/plugins/LegendPlugin.js';
import { activateLegend, deactivateLegend, setPreviewGeoresourceId } from '../../../src/ea/store/module/module.action.js';
import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { bvvCapabilitiesProvider } from '../../../src/services/provider/wmsCapabilities.provider.js';
import { addLayer, modifyLayer, removeLayer } from '../../../src/store/layers/layers.action';
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

	describe('extractWmsLayerItems method', () => {

		it('return empty list when unknown goeresource id', async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			const byIdSpy = spyOn(geoResourceServiceMock, 'byId')
				.withArgs('id1').and.returnValue(null);

			expect(await instanceUnderTest._extractWmsLayerItems('id1')).toEqual([]);
			expect(byIdSpy).toHaveBeenCalled();
		});

		it('return empty list when goeresource has no _layers element', async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			const byIdSpy = spyOn(geoResourceServiceMock, 'byId')
				.withArgs('id1').and.returnValue({ id: 'id1' });

			expect(await instanceUnderTest._extractWmsLayerItems('id1')).toEqual([]);
			expect(byIdSpy).toHaveBeenCalled();
		});

		it('uses bvvCapabilites provider', async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			expect(instanceUnderTest._capabilitiesProvider).toEqual(bvvCapabilitiesProvider);
		});

		it('calls capabilites provider to get the wms capabilities', async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			spyOn(geoResourceServiceMock, 'byId')
				.withArgs('id1').and.returnValue({
					id: 'id1',
					_url: 'url42',
					_layers: 'l1,l2'
				});

			let actualUrl = null;
			instanceUnderTest._capabilitiesProvider = async (url) => {
				actualUrl = url;

				return [] ;
			};

			await instanceUnderTest._extractWmsLayerItems('id1');

			expect(actualUrl).toEqual('url42');
		});

		it('maps wms resources to legend items', async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			spyOn(geoResourceServiceMock, 'byId')
				.withArgs('id1').and.returnValue({
					_id: 'id1',
					_url: 'url42',
					_layers: 'l1,l2'
				});

			instanceUnderTest._capabilitiesProvider = async () => [
				{ _label: 'name1', _layers: 'l1', _extraParams: { legendUrl: 'url1', minResolution: 0, maxResolution: 1 } },
				{ _label: 'name2', _layers: 'l2', _extraParams: { legendUrl: 'url2', minResolution: 0, maxResolution: 1 } },
				{ _label: 'name3', _layers: 'l3', _extraParams: { legendUrl: 'url3', minResolution: 0, maxResolution: 1 } }
			];

			const actual = await instanceUnderTest._extractWmsLayerItems('id1');

			expect(actual).toEqual([
				{ title: 'name1', legendUrl: 'url1', minResolution: 0, maxResolution: 1 },
				{ title: 'name2', legendUrl: 'url2', minResolution: 0, maxResolution: 1 }
			]);
		});
	});

	const mockWmsLayerItems = (obj) => {
		spyOn(obj, '_extractWmsLayerItems')
			.withArgs('id1').and.returnValue([layerItem1])
			.withArgs('id2').and.returnValue([layerItem2])
			.withArgs('id3').and.returnValue([layerItem3]);
	};

	describe('when legendActive is true, ', () => {

		const setupActive = async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			mockWmsLayerItems(instanceUnderTest);

			activateLegend();

			return store;
		};

		it('creates legend items on active layer change', async () => {
			const store = await setupActive();

			addLayer('id1');
			addLayer('id2');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1, layerItem2]);
			});
		});


		it('show legend only for visible layers', async () => {
			const store = await setupActive();

			addLayer('id1');
			addLayer('id2');
			addLayer('id3');
			modifyLayer('id2', { visible: false });

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1, layerItem3]);
			});
		});

		it('create preview layers items first', async () => {
			const store = await setupActive();

			addLayer('id3');
			setPreviewGeoresourceId('id2');
			addLayer('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem2, layerItem1, layerItem3]);
			});
		});

		it('sorts active layers alphabetically', async () => {
			const store = await setupActive();

			addLayer('id2');
			addLayer('id3');
			addLayer('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1, layerItem2, layerItem3]);
			});
		});


		it('ignores preview layer if it is already active', async () => {
			const store = await setupActive();

			addLayer('id1');
			setPreviewGeoresourceId('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1]);
			});
		});

		it('clears preview layer if it is added to active layers', async () => {
			const store = await setupActive();

			setPreviewGeoresourceId('id1');
			addLayer('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1]);
			});
		});

		it('handles several incoming preview events correctly', async () => {
			const store = await setupActive();

			setPreviewGeoresourceId('id1');
			setPreviewGeoresourceId('id2');
			setPreviewGeoresourceId('id3');
			setPreviewGeoresourceId(null);

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([]);
			});
		});


		it('handles several incoming active layers changes correctly', async () => {
			const store = await setupActive();

			addLayer('id1');
			addLayer('id2');
			addLayer('id3');
			removeLayer('id1');
			removeLayer('id2');
			removeLayer('id3');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([]);
			});
		});
	});

	describe('when legendActive is false, ', () => {

		const setupInactive = async () => {
			const store = await setup();
			const instanceUnderTest = new LegendPlugin();
			await instanceUnderTest.register(store);

			mockWmsLayerItems(instanceUnderTest);

			deactivateLegend();

			return store;
		};

		it('updates active layers even if legendActive is false', async () => {
			const store = await setupInactive();

			addLayer('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([layerItem1]);
			});
		});

		it('does not legend on preview id change', async () => {
			const store = await setupInactive();

			setPreviewGeoresourceId('id1');

			setTimeout(() => {
				expect(store.getState().module.legendItems).toEqual([]);
			});

		});
	});
});
