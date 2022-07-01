
import { LegendContent } from '../../../../../../src/ea/modules/legend/components/content/LegendContent';
import { moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(LegendContent.tag, LegendContent);


describe('LegendContent', () => {

	const mapServiceMock = {
		calcResolution: () => {
			return 500;
		}
	};

	const geoResourceServiceMock = {
		byId: (id) => {
			null;
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
				module: { legendActive: true },
				layers: { active: [{ id: 'id42' }] }
			});

			expect(element.shadowRoot.querySelector('.ea-legend__title').innerText).toEqual('ea_legend_title');
			const itemTitles = element.shadowRoot.querySelectorAll('.ea-legend-item__title');
			const itemImages = element.shadowRoot.querySelectorAll('img');

			expect(itemTitles.length).toBe(2);
			expect(itemImages.length).toBe(2);

		});
	});
});
