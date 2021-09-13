/* eslint-disable no-undef */
import { Header } from '../../../../src/modules/header/components/Header';
import { createNoInitialStateMainMenuReducer } from '../../../../src/modules/menu/store/mainMenu.reducer';
import { modalReducer } from '../../../../src/modules/modal/store/modal.reducer';
import { TestUtils } from '../../../test-utils.js';
import { $injector } from '../../../../src/injection';
import { OlCoordinateService } from '../../../../src/services/OlCoordinateService';
import { layersReducer } from '../../../../src/store/layers/layers.reducer';
import { networkReducer } from '../../../../src/store/network/network.reducer';
import { setFetching } from '../../../../src/store/network/network.action';
import { MainMenuTabIndex } from '../../../../src/modules/menu/components/mainMenu/MainMenu';
import { searchReducer } from '../../../../src/store/search/search.reducer';
import { EventLike } from '../../../../src/utils/storeUtils';
import { createNoInitialStateMediaReducer } from '../../../../src/store/media/media.reducer';

window.customElements.define(Header.tag, Header);

let store;


describe('Header', () => {

	const setup = (state = {}, config = {}) => {
		const { embed = false } = config;

		const initialState = {
			mainMenu: {
				open: true,
				tabIndex: 0
			},
			network: {
				fetching: false,
				pendingRequests: 0
			},
			layers: {
				active: ['test']
			},
			search: {
				query: new EventLike(null)
			},
			media: {
				portrait: false,
				minWidth: true,
				observeResponsiveParameter: true
			},
			...state
		};
		store = TestUtils.setupStoreAndDi(initialState, {
			mainMenu: createNoInitialStateMainMenuReducer(),
			modal: modalReducer,
			network: networkReducer,
			layers: layersReducer,
			search: searchReducer,
			media: createNoInitialStateMediaReducer()
		});
		$injector
			.register('CoordinateService', OlCoordinateService)
			.registerSingleton('EnvironmentService', { isEmbedded: () => embed })
			.registerSingleton('TranslationService', { translate: (key) => key });


		return TestUtils.render(Header.tag);
	};

	describe('responsive layout ', () => {

		it('layouts for landscape and width >= 80em', async () => {
			const state = {
				media: {
					portrait: false,
					minWidth: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-landscape')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeFalsy();
			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.header__logo')).display).toBe('block');
			expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('none');
		});

		it('layouts for portrait and width >= 80em', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: true
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-portrait')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeFalsy();
			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.header__logo')).display).toBe('none');
			expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');
		});

		it('layouts for landscape and width < 80em', async () => {
			const state = {
				media: {
					portrait: false,
					minWidth: false
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-landscape')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeFalsy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.header__logo')).display).toBe('none');
			expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');
		});

		it('layouts for portrait and layouts for width < 80em', async () => {
			const state = {
				media: {
					portrait: true,
					minWidth: false
				}
			};

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.is-portrait')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.is-desktop')).toBeFalsy();
			expect(element.shadowRoot.querySelector('.is-tablet')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(window.getComputedStyle(element.shadowRoot.querySelector('.header__logo')).display).toBe('none');
			expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');
		});

	});

	describe('when initialized', () => {

		it('removes a preload css class', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('.preload')).toBeFalsy();
		});

		it('adds header bar', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('.header')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.header__modal-button')).toBeTruthy();

			expect(element.shadowRoot.querySelector('.header__button-container')).toBeTruthy();
			expect(element.shadowRoot.querySelector('.header__button-container').children.length).toBe(3);
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].classList.contains('is-active')).toBeTrue();
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].innerText).toBe('header_tab_topics_button');

			expect(element.shadowRoot.querySelector('.header__button-container').children[1].children[0].innerText).toBe('header_tab_maps_button');
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].children[1].innerText).toBe('1');
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].classList.contains('is-active')).toBeFalse();

			expect(element.shadowRoot.querySelector('.header__button-container').children[2].innerText).toBe('header_tab_more_button');
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].classList.contains('is-active')).toBeFalse();
		});

		it('adds a close button', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('button.close-menu').title).toBe('header_close_button_title');
		});

		it('renders nothing when embedded', async () => {
			const element = await setup({}, { embed: true });

			expect(element.shadowRoot.children.length).toBe(0);
		});


		it('with 3 active Layers', async () => {
			const state = {
				layers: {
					active: ['test', 'test', 'test']
				}
			};
			const element = await setup(state);

			expect(element.shadowRoot.querySelector('.header__button-container').children[1].children[1].innerText).toBe('3');
		});

	});

	describe('when menu button clicked', () => {

		it('updates the store', async () => {
			const state = {
				mainMenu: {
					open: false
				}
			};

			const element = await setup(state);

			expect(store.getState().mainMenu.open).toBe(false);
			element.shadowRoot.querySelector('button.close-menu').click();
			expect(store.getState().mainMenu.open).toBe(true);
		});
	});

	describe('when modal button is clicked', () => {

		it('shows a modal window with the showcase', async () => {
			const element = await setup();

			element.shadowRoot.querySelector('.header__modal-button').click();

			expect(store.getState().modal.data.title).toBe('Showcase');
			//we expect a lit-html TemplateResult as content
			expect(store.getState().modal.data.content.strings[0]).toBe('<ba-showcase>');
		});
	});

	describe('when menu button is clicked', () => {

		it('click button Theme', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].click());
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].classList.contains('is-active')).toBeTrue();
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].classList.contains('is-active')).toBeFalse();
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].classList.contains('is-active')).toBeFalse();
		});

		it('click button Map', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].click());
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].classList.contains('is-active')).toBeFalse();
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].classList.contains('is-active')).toBeTrue();
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].classList.contains('is-active')).toBeFalse();
		});

		it('click button More', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].click());
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].classList.contains('is-active')).toBeFalse();
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].classList.contains('is-active')).toBeFalse();
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].classList.contains('is-active')).toBeTrue();
		});

		it('updates the store', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.header__button-container').children[0].click());
			expect(store.getState().mainMenu.tabIndex).toBe(MainMenuTabIndex.TOPICS.id);
			expect(element.shadowRoot.querySelector('.header__button-container').children[1].click());
			expect(store.getState().mainMenu.tabIndex).toBe(MainMenuTabIndex.MAPS.id);
			expect(element.shadowRoot.querySelector('.header__button-container').children[2].click());
			expect(store.getState().mainMenu.tabIndex).toBe(MainMenuTabIndex.MORE.id);
		});

	});

	describe('input for search queries', () => {

		describe('when input changes', () => {

			it('updates the store', async () => {

				const element = await setup();

				const inputElement = element.shadowRoot.querySelector('#input');
				inputElement.value = 'foo';
				inputElement.dispatchEvent(new Event('input'));

				expect(store.getState().search.query.payload).toBe('foo');
			});

			it('opens the main menu', async () => {
				const state = {
					mainMenu: {
						open: false
					}
				};
				const element = await setup(state);

				expect(store.getState().mainMenu.open).toBeFalse();

				const inputElement = element.shadowRoot.querySelector('#input');
				inputElement.value = 'foo';
				inputElement.dispatchEvent(new Event('input'));

				expect(store.getState().mainMenu.open).toBeTrue();
			});
		});

		describe('when input is focused or blurred ', () => {

			it('disables/enables the \'observeResponsiveParameter\' property', async () => {
				const state = {
					mainMenu: {
						open: false
					},
					media: {
						portrait: true,
						minWidth: true
					}
				};
				const element = await setup(state);
				const input = element.shadowRoot.querySelector('#input');

				input.focus();

				expect(store.getState().media.observeResponsiveParameter).toBeFalse();

				input.blur();

				expect(store.getState().media.observeResponsiveParameter).toBeTrue();
			});

			describe('in portrait mode', () => {

				beforeEach(function () {
					jasmine.clock().install();
				});

				afterEach(function () {
					jasmine.clock().uninstall();
				});

				it('opens the main menu when input has content', async () => {
					const state = {
						mainMenu: {
							open: false
						},
						media: {
							portrait: true,
							minWidth: true
						}
					};
					const element = await setup(state);
					const input = element.shadowRoot.querySelector('#input');

					input.focus();

					expect(store.getState().mainMenu.open).toBeFalse();

					input.blur();
					input.value = 'foo';
					input.focus();

					expect(store.getState().mainMenu.open).toBeTrue();
				});

				it('hides/shows the mobile header', async () => {
					const state = {
						mainMenu: {
							open: false
						},
						media: {
							portrait: true,
							minWidth: true
						}
					};
					const element = await setup(state);
					const input = element.shadowRoot.querySelector('#input');

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');

					input.focus();

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('none');

					input.blur();

					jasmine.clock().tick(300 + 100);

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');
				});
			});


			describe('min-width < 80em', () => {

				beforeEach(function () {
					jasmine.clock().install();
				});

				afterEach(function () {
					jasmine.clock().uninstall();
				});

				it('hides/shows the mobile header', async () => {
					const state = {
						mainMenu: {
							open: false
						},
						media: {
							portrait: false,
							minWidth: false
						}
					};
					const element = await setup(state);
					const input = element.shadowRoot.querySelector('#input');

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');

					input.focus();

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('none');

					input.blur();

					jasmine.clock().tick(300 + 100);

					expect(window.getComputedStyle(element.shadowRoot.querySelector('#headerMobile')).display).toBe('block');
				});
			});


			it('sets the correct tab index for the search-content-panel', async () => {
				const state = {
					mainMenu: {
						open: false
					},
					media: {
						portrait: true,
						minWidth: true
					}
				};
				const element = await setup(state);
				element.shadowRoot.querySelector('#input').focus();

				expect(store.getState().mainMenu.tabIndex).toBe(MainMenuTabIndex.SEARCH.id);
			});

			describe('in portrait mode and min-width < 80em', () => {

				beforeEach(function () {
					jasmine.clock().install();
				});

				afterEach(function () {
					jasmine.clock().uninstall();
				});

				it('hide mobile header and show again', async () => {
					const state = {

						media: {
							portrait: true,
							minWidth: false
						}
					};

					const element = await setup(state);

					const container = element.shadowRoot.querySelector('#headerMobile');
					expect(window.getComputedStyle(container).display).toBe('block');
					expect(window.getComputedStyle(container).opacity).toBe('1');
					element.shadowRoot.querySelector('#input').focus();
					expect(window.getComputedStyle(container).display).toBe('none');
					expect(window.getComputedStyle(container).opacity).toBe('0');
					element.shadowRoot.querySelector('#input').blur();
					expect(window.getComputedStyle(container).display).toBe('block');
					expect(window.getComputedStyle(container).opacity).toBe('0');
					jasmine.clock().tick(800);
					/**
					 * From https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle:
					 * 'The element.style object should be used to set styles on that element, or inspect styles directly added to it from JavaScript manipulation or the global style attribute.'
					 * --> So we have to test for 'style' here
					 */
					expect(container.style.opacity).toBe('1');
				});
			});

			describe('in landscape mode and min-width < 80em', () => {

				beforeEach(function () {
					jasmine.clock().install();
				});

				afterEach(function () {
					jasmine.clock().uninstall();
				});

				it('hide mobile header and show again', async () => {
					const state = {

						media: {
							portrait: false,
							minWidth: false
						}
					};

					const element = await setup(state);

					const container = element.shadowRoot.querySelector('#headerMobile');
					expect(window.getComputedStyle(container).display).toBe('block');
					expect(window.getComputedStyle(container).opacity).toBe('1');
					element.shadowRoot.querySelector('#input').focus();
					expect(window.getComputedStyle(container).display).toBe('none');
					expect(window.getComputedStyle(container).opacity).toBe('0');
					element.shadowRoot.querySelector('#input').blur();
					expect(window.getComputedStyle(container).display).toBe('block');
					expect(window.getComputedStyle(container).opacity).toBe('0');
					jasmine.clock().tick(800);
					/**
					 * From https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle:
					 * 'The element.style object should be used to set styles on that element, or inspect styles directly added to it from JavaScript manipulation or the global style attribute.'
					 * --> So we have to test for 'style' here
					 */
					expect(container.style.opacity).toBe('1');
				});
			});
		});

	});

	describe('when network fetching state changes', () => {

		it('runs or pauses the border animation class', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelector('.action-button__border.animated-action-button__border').classList.contains('animated-action-button__border__running')).toBeFalse();
			setFetching(true);
			expect(element.shadowRoot.querySelector('.action-button__border.animated-action-button__border').classList.contains('animated-action-button__border__running')).toBeTrue();
			setFetching(false);
			expect(element.shadowRoot.querySelector('.action-button__border.animated-action-button__border').classList.contains('animated-action-button__border__running')).toBeFalse();
		});
	});
});
