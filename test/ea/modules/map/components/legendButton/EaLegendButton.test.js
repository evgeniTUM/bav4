import { EaLegendButton } from '../../../../../../src/ea/modules/map/components/legendButton/EaLegendButton';
import { $injector } from '../../../../../../src/injection';
import { geolocationReducer } from '../../../../../../src/store/geolocation/geolocation.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(EaLegendButton.tag, EaLegendButton);


describe('LegendButton', () => {
	let store;
	const defaultState = {
		active: false, denied: false, tracking: false, accuracy: null, position: null
	};

	const setup = async (geolocationState = defaultState) => {

		const state = {
			geolocation: geolocationState
		};

		store = TestUtils.setupStoreAndDi(state, { geolocation: geolocationReducer });
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
			const element = await setup({ ...defaultState, active: true });

			expect(element.shadowRoot.querySelector('.legend')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.legend-button').title).toBe('map_legendButton_title_deactivate');
			expect(element.shadowRoot.querySelector('.icon')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.active')).toBeTruthy();
		});
	});

	describe('when clicked', () => {
		it('activates geolocation', async () => {
			const element = await setup();

			expect(store.getState().geolocation.active).toBe(false);
			element.shadowRoot.querySelector('button').click();

			expect(store.getState().geolocation.active).toBe(true);
		});

		it('deactivates geolocation', async () => {
			const element = await setup({ ...defaultState, active: true });

			expect(store.getState().geolocation.active).toBe(true);
			element.shadowRoot.querySelector('button').click();

			expect(store.getState().geolocation.active).toBe(false);
		});
	});
});
