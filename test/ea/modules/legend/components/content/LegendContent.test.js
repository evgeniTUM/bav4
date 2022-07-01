
import { LegendContent } from '../../../../../../src/ea/modules/legend/components/content/LegendContent';
import { moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { addLayer } from '../../../../../../src/store/layers/layers.action';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(LegendContent.tag, LegendContent);


describe('LegendContent', () => {

	const mapServiceMock = {
		calcResolution: () => {
			return 50;
		}
	};

	const geoResourceServiceMock = {
		byId: (id) => {
			return null;
		}
	};

	const setup = async (state = {}) => {

		TestUtils.setupStoreAndDi(state, {
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

	describe('when initialized', () => {
		it('renders nothing when module.legendActive is false', async () => {
			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});


		it('renders the legend', async () => {
			const element = await setup({
				module: { legendActive: true }
			});

			spyOn(element, '_extractWmsLayerItems')
				.withArgs('id42').and.returnValue([{
					title: 'title1',
					minResolution: 100,
					maxResolution: 0,
					legendUrl: 'https://url1/img'
				}])
				.withArgs('id24').and.returnValue([{
					title: 'title2',
					minResolution: 99,
					maxResolution: 1,
					legendUrl: 'https://url2/img'
				}]);

			addLayer('id42');
			addLayer('id24');

			setTimeout(() => {
				expect(element.shadowRoot.querySelector('.ea-legend__title').innerText).toEqual('ea_legend_title');
				const itemTitles = element.shadowRoot.querySelectorAll('.ea-legend-item__title');
				const itemImages = element.shadowRoot.querySelectorAll('img');

				expect(itemTitles.length).toBe(2);
				expect(itemImages.length).toBe(2);

				expect(itemTitles[0].innerText).toEqual('title1');
				expect(itemTitles[1].innerText).toEqual('title2');
				expect(itemImages[0].src).toEqual('https://url1/img');
				expect(itemImages[1].src).toEqual('https://url2/img');
			});

		});
	});
});
