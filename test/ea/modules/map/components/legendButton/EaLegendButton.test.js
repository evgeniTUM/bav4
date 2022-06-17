import { EaLegendButton } from '../../../../../../src/ea/modules/map/components/legendButton/EaLegendButton';
import { activateLegend } from '../../../../../../src/ea/store/module/module.action';
import { initialState, moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(EaLegendButton.tag, EaLegendButton);


describe('LegendButton', () => {
	let store;

	const setup = async () => {

		const state = { module: initialState };

		store = TestUtils.setupStoreAndDi(state, { module: moduleReducer });
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key });


		return await TestUtils.render(EaLegendButton.tag);
	};

	describe('when initialized', () => {
		it('shows legend button in inactive state', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.legend')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.legend-button').title).toBe('map_legendButton_title_activate');
			expect(element.shadowRoot.querySelector('.icon')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.inactive')).toBeTruthy();
		});


		it('shows legend button in active state', async () => {
			const element = await setup();

			activateLegend();

			expect(element.shadowRoot.querySelector('.legend')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.legend-button').title).toBe('map_legendButton_title_deactivate');
			expect(element.shadowRoot.querySelector('.icon')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.active')).toBeTruthy();
		});
	});

	describe('when clicked', () => {
		it('activates/deactivates legend', async () => {
			const element = await setup();

			element.shadowRoot.querySelector('button').click();

			expect(store.getState().module.legendActive).toBe(true);

			element.shadowRoot.querySelector('button').click();

			expect(store.getState().module.legendActive).toBe(false);
		});

	});
});
