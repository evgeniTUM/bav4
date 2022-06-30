
import { LegendContent } from '../../../../../../src/ea/modules/legend/components/content/LegendContent';
import { activateLegend, deactivateLegend } from '../../../../../../src/ea/store/module/module.action';
import { initialState, moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(LegendContent.tag, LegendContent);


describe('LegendContent', () => {
	let store;

	const mapServiceMock = {
		calcResolution: () => {
			return 500;
		}
	};

	const geoResourceServiceMock = {};

	const setup = async () => {

		const state = { module: initialState };

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

	describe('when initialized', () => {
		it('renders nothing when module.legendActive is false', async () => {
			const element = await setup();

			deactivateLegend();
			expect(element.shadowRoot.children.length).toBe(0);
		});

		describe('when activated', () => {
			let element;

			beforeEach(async () => {
				element = await setup();
				activateLegend();
			});

			it('renders the legend', async () => {
				expect(element.shadowRoot.querySelector('.ea-legend__title').innerText).toEqual('ea_legend_title');
				expect(element.shadowRoot.querySelector('.ea-legend__title').innerText).toEqual('ea_legend_title');
			});
		});
	});
});
