
import { LegendContent } from '../../../../../../src/ea/modules/legend/components/content/LegendContent';
import { setLegendGeoresourceId } from '../../../../../../src/ea/store/module/module.action';
import { moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { addLayer } from '../../../../../../src/store/layers/layers.action';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { changeZoom } from '../../../../../../src/store/position/position.action';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(LegendContent.tag, LegendContent);

describe('LegendContent', () => {

	const mapServiceMock = {
		calcResolution: () => {
			return 50;
		},
		getMaxZoomLevel: () => 100,
		getMinZoomLevel: () => 0
	};

	const geoResourceServiceMock = {
		byId: () => {
			return null;
		}
	};

	let store;

	const setup = async (state = {}) => {

		store = TestUtils.setupStoreAndDi(state, {
			module: moduleReducer,
			position: positionReducer,
			layers: layersReducer
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('MapService', mapServiceMock)
			.registerSingleton('GeoResourceService', geoResourceServiceMock);

		return await TestUtils.render(LegendContent.tag);
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

	const mockWmsLayerItems = (element) => {
		spyOn(element, '_extractWmsLayerItems')
			.withArgs('id1').and.returnValue([layerItem1])
			.withArgs('id2').and.returnValue([layerItem2])
			.withArgs('id3').and.returnValue([layerItem3]);
	};

	describe('when initialized', () => {
		it('renders nothing when module.legendActive is false', async () => {
			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('renders the legend when module.legendActive is true', async () => {
			const element = await setup({
				module: { legendActive: true }
			});

			expect(element.shadowRoot.querySelector('.ea-legend__title').innerText).toEqual('ea_legend_title');
		});


		describe('renders model correctly, ', () => {
			it('shows preview layers and then active layers', async () => {
				const element = await setup();

				element._model = {
					legendActive: true,
					activeLayers: [layerItem1, layerItem2],
					previewLayers: [layerItem3],
					zoom: 0
				};

				element.render();

				const itemTitles = element.shadowRoot.querySelectorAll('.ea-legend-item__title');
				const itemImages = element.shadowRoot.querySelectorAll('img');

				expect(itemTitles.length).toBe(3);
				expect(itemImages.length).toBe(3);

				expect(itemTitles[0].innerText).toEqual(layerItem3.title);
				expect(itemTitles[1].innerText).toEqual(layerItem1.title);
				expect(itemTitles[2].innerText).toEqual(layerItem2.title);
				expect(itemImages[0].src).toEqual(layerItem3.legendUrl);
				expect(itemImages[1].src).toEqual(layerItem1.legendUrl);
				expect(itemImages[2].src).toEqual(layerItem2.legendUrl);
			});

			it('sorts active layers alphabetically', async () => {
				const element = await setup();

				element._model = {
					legendActive: true,
					activeLayers: [layerItem2, layerItem1],
					previewLayers: [layerItem3],
					zoom: 0
				};

				element.render();

				const itemImages = element.shadowRoot.querySelectorAll('img');

				expect(itemImages.length).toBe(3);

				expect(itemImages[0].src).toEqual(layerItem3.legendUrl);
				expect(itemImages[1].src).toEqual(layerItem1.legendUrl);
				expect(itemImages[2].src).toEqual(layerItem2.legendUrl);
			});

			it('filters layers by current resolution on zoomLevel change', async () => {
				const element = await setup();

				const center = store.getState().position.center;
				spyOn(mapServiceMock, 'calcResolution')
					.withArgs(1, center).and.returnValue(50)
					.withArgs(2, center).and.returnValue(20)
					.withArgs(3, center).and.returnValue(10);

				element._model = {
					legendActive: true,
					activeLayers: [layerItem1, layerItem2, layerItem3],
					previewLayers: [],
					zoom: 1
				};

				element.render();
				expect(element.shadowRoot.querySelectorAll('img').length).toBe(3);

				changeZoom(2);
				expect(element.shadowRoot.querySelectorAll('img').length).toBe(2);

				changeZoom(3);
				expect(element.shadowRoot.querySelectorAll('img').length).toBe(1);
			});
		});

		it('updates model on active layer change', async () => {
			const element = await setup();
			mockWmsLayerItems(element);

			addLayer('id1');
			addLayer('id2');

			setTimeout(() => {
				const model = element.getModel();
				expect(model.activeLayers).toEqual([layerItem1, layerItem2]);
			});

		});

		it('updates model on preview layer change', async () => {
			const element = await setup();
			mockWmsLayerItems(element);

			setLegendGeoresourceId('id1');

			setTimeout(() => {
				const model = element.getModel();
				expect(model.previewLayers).toEqual([layerItem1]);
			});
		});

	});
});
