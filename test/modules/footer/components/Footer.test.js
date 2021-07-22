/* eslint-disable no-undef */

import { Footer } from '../../../../src/modules/footer/components/Footer';
import { TestUtils } from '../../../test-utils.js';
import { $injector } from '../../../../src/injection';
import { createNoInitialStateMainMenuReducer } from '../../../../src/modules/menu/store/mainMenu.reducer';
import { createNoInitialStateMediaReducer } from '../../../../src/store/media/media.reducer';

window.customElements.define(Footer.tag, Footer);


describe('Footer', () => {

	const setup = (state = {}, config = {}) => {
		const { embed = false } = config;

		const initialState = {
			mainMenu: {
				open: true
			},
			media: {
				portrait: false
			},
			...state
		};

		TestUtils.setupStoreAndDi(initialState, { mainMenu: createNoInitialStateMainMenuReducer(), media: createNoInitialStateMediaReducer() });
		$injector.registerSingleton('EnvironmentService', {
			isEmbedded: () => embed
		});

		return TestUtils.render(Footer.tag);
	};

	describe('responsive layout ', () => {

		it('layouts with open main menu for landscape mode', async () => {
			const state = {
				media: {
					portrait: false
				}
			};
			const element = await setup(state);

			expect(element.shadowRoot.querySelectorAll('.footer.is-open')).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('.content')).toHaveSize(1);
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.content')).display).toBe('block');
			expect(element.shadowRoot.querySelectorAll('ba-map-info')).toHaveSize(1);
		});

		it('layouts with open main menu for portrait mode', async () => {
			const state = {
				media: {
					portrait: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelectorAll('.footer.is-open')).toHaveSize(0);
			expect(element.shadowRoot.querySelectorAll('.content')).toHaveSize(1);
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.content')).display).toBe('none');
			expect(element.shadowRoot.querySelectorAll('ba-map-info')).toHaveSize(1);
		});
	});


	describe('when initialized', () => {

		it('removes a preload css class', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelectorAll('.preload')).toHaveSize(0);
		});

		it('adds footer elements and css classes for landscape mode', async () => {
			const element = await setup({}, { portrait: false });

			expect(element.shadowRoot.querySelectorAll('.footer')).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('.content')).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('ba-map-info')).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('ba-attribution-info')).toHaveSize(1);
		});

		it('renders nothing when embedded', async () => {
			const element = await setup({}, { embed: true });

			expect(element.shadowRoot.children.length).toBe(0);
		});
	});
});
