/**
 * @module modules/header/components/Header
 */
import { html } from 'lit-html';
import { open as openMainMenu, setTab, toggle as toggleMainMenu } from '../../../store/mainMenu/mainMenu.action';
import { toggle as toggleNavigationRail } from '../../../store/navigationRail/navigationRail.action';
import { TabIds } from '../../../domain/mainMenu';
import { $injector } from '../../../injection';
import css from './header.css';
import { setQuery } from '../../../store/search/search.action';
import { disableResponsiveParameterObservation, enableResponsiveParameterObservation } from '../../../store/media/media.action';
import { MvuElement } from '../../MvuElement';
import VanillaSwipe from 'vanilla-swipe';
import { openModal } from '../../../store/modal/modal.action';
import { setCurrentTool } from '../../../store/tools/tools.action';
import { Tools } from '../../../domain/tools';
import { classMap } from 'lit-html/directives/class-map.js';

const Update_IsOpen_TabIndex = 'update_isOpen_tabIndex';
const Update_Fetching = 'update_fetching';
const Update_Layers = 'update_layers';
const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_SearchTerm = 'update_searchTerm';
const Update_IsOpen_NavigationRail = 'update_isOpen_NavigationRail';

/**
 * Container element for header stuff.
 * @class
 * @author taulinger
 * @author alsturm
 */
export class Header extends MvuElement {
	constructor() {
		super({
			isOpen: false,
			tabIndex: null,
			isFetching: false,
			layers: [],
			isPortrait: false,
			hasMinWidth: false,
			searchTerm: null,
			isOpenNavigationRail: false
		});

		const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject(
			'EnvironmentService',
			'TranslationService'
		);

		this._environmentService = environmentService;
		this._translationService = translationService;
	}

	update(type, data, model) {
		switch (type) {
			case Update_IsOpen_TabIndex:
				return { ...model, ...data };
			case Update_Fetching:
				return { ...model, isFetching: data };
			case Update_Layers:
				return { ...model, layers: data };
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };
			case Update_SearchTerm:
				return { ...model, searchTerm: data };
			case Update_IsOpen_NavigationRail:
				return { ...model, ...data };
		}
	}

	onInitialize() {
		this.observe(
			(state) => state.mainMenu,
			(mainMenu) => this.signal(Update_IsOpen_TabIndex, { isOpen: mainMenu.open, tabIndex: mainMenu.tab })
		);
		this.observe(
			(state) => state.network.fetching,
			(fetching) => this.signal(Update_Fetching, fetching)
		);
		this.observe(
			(state) => state.layers.active,
			(active) =>
				this.signal(
					Update_Layers,
					active.filter((l) => l.constraints.hidden === false)
				)
		);
		this.observe(
			(state) => state.media,
			(media) => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth })
		);
		this.observe(
			(state) => state.search.query,
			(query) => this.signal(Update_SearchTerm, query.payload)
		);
		this.observe(
			(state) => state.navigationRail,
			(navigationRail) => this.signal(Update_IsOpen_NavigationRail, { isOpenNavigationRail: navigationRail.open })
		);
	}

	onAfterRender(firsttime) {
		if (firsttime) {
			const handler = (event, data) => {
				if (['touchmove', 'mousemove'].includes(event.type) && data.directionX === 'LEFT' && data.absX > Header.SWIPE_DELTA_PX) {
					swipeElement.focus();
					toggleMainMenu();
				}
			};
			const swipeElement = this.shadowRoot.getElementById('header_toggle');

			const swipe = new VanillaSwipe({
				element: swipeElement,
				onSwipeStart: handler,
				delta: Header.SWIPE_DELTA_PX,
				mouseTrackingEnabled: true
			});

			swipe.init();
		}
	}

	onWindowLoad() {
		// we use optional chaining here because preload class may not be available
		this._root.querySelector('.preload')?.classList.remove('preload');
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	createView(model) {
		const { isOpen, isOpenNavigationRail, tabIndex, isFetching, layers, isPortrait, hasMinWidth, searchTerm } = model;
		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return hasMinWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return isOpen && !isPortrait ? 'is-open' : '';
		};

		const getAnimatedBorderClass = () => {
			return isFetching ? 'animated-action-button__border__running' : '';
		};

		const getActiveClass = (buttonIndex) => {
			return tabIndex === buttonIndex ? 'is-active' : '';
		};

		const getIsClearClass = () => {
			return searchTerm ? 'is-clear-visible' : '';
		};

		const getBadgeText = () => {
			return this._environmentService.isStandalone() ? translate('header_logo_badge_standalone') : translate('header_logo_badge');
		};

		const getEmblem = () => {
			return this._environmentService.isStandalone()
				? html`<a
						href="${translate('header_emblem_link_standalone')}"
						title="${translate('header_emblem_title_standalone')}"
						class="header__emblem"
						target="_blank"
					></a>`
				: html`<span class="header__emblem_label">Bayerische Staatsregierung</span>
						<a title=${translate('header_emblem_action_title')} class="header_action_link" target="_blank" href="https://www.bayern.de/">
							<div class="header__emblem"></div>
						</a>`;
		};

		const layerCount = layers.length;

		const onInputFocus = () => {
			disableResponsiveParameterObservation();
			setTab(TabIds.SEARCH);
			if (isPortrait || !hasMinWidth) {
				const popup = this.shadowRoot.getElementById('headerMobile');
				popup.style.display = 'none';
				popup.style.opacity = 0;
			}

			//in portrait mode we open the main menu to display existing results
			if (isPortrait) {
				const value = this.shadowRoot.querySelector('#input').value;
				if (value.length > 0) {
					openMainMenu();
				}
			}
		};

		const onInput = (evt) => {
			const term = evt.target.value;
			openMainMenu();
			setQuery(term);
		};

		const onInputBlur = () => {
			enableResponsiveParameterObservation();
			if (isPortrait || !hasMinWidth) {
				const popup = this.shadowRoot.getElementById('headerMobile');
				popup.style.display = '';
				window.setTimeout(() => (popup.style.opacity = 1), 300);
			}
		};

		const openTopicsTab = () => {
			setTab(TabIds.TOPICS);
			openMainMenu();
		};

		const openMapLayerTab = () => {
			setTab(TabIds.MAPS);
			openMainMenu();
		};

		const openMiscTab = () => {
			setTab(TabIds.MISC);
			openMainMenu();
		};

		const openExtendedTab = () => {
			setTab(TabIds.EXTENSION);
			openMainMenu();
		};

		const clearSearchInput = () => {
			const input = this.shadowRoot.getElementById('input');
			input.value = '';
			input.focus();
			input.dispatchEvent(new Event('input'));
		};

		const classes = {
			'is-open': isOpen && !isPortrait,
			'is-open-navigationRail': isOpenNavigationRail && !isPortrait,
			'is-desktop': hasMinWidth,
			'is-tablet': !hasMinWidth,
			'is-portrait': isPortrait,
			'is-landscape': !isPortrait,
			'is-demo': this._environmentService.isStandalone()
		};

		const translate = (key) => this._translationService.translate(key);
		return html`
			<style>${css}</style>
			<div class="preload">
				<div class="${classMap(classes)}">
					<div class='header__logo'>				
						<div class="action-button"  @click="${toggleNavigationRail}">
							<div class="action-button__border animated-action-button__border ${getAnimatedBorderClass()}">
							</div>
							<div class="action-button__icon">
								<div class="ba">
								</div>
							</div>
						</div>
						<div id='header__text' class='header__text'>
							<a  title=${translate('header_action_button_title')} class="eab-logo-link" target="_blank" href="https://www.energieatlas.bayern.de/"></a>
						</div>
						<div class='header__logo-badge'>										
						${getBadgeText()}
						</div>	
					</div>		
					<div id='headerMobile' class='header__text-mobile'>	
						<a  title=${translate('header_action_button_title')} class="eab-logo-link" target="_blank" href="https://www.energieatlas.bayern.de/"></a>
					</div>
					${getEmblem()}					
					<div class="header" ?data-register-for-viewport-calc=${isPortrait}>  
						<button id='header_toggle' class="close-menu" title=${translate('header_close_button_title')}  @click="${toggleMainMenu}"">
							<i class="resize-icon "></i>
						</button> 
						<div class="header__background">
						</div>
						<div class='header__search-container'>
						<input id='input' data-test-id placeholder='${translate(
							'header_search_placeholder'
						)}' value="${searchTerm}" @focus="${onInputFocus}" @blur="${onInputBlur}" @input="${onInput}" class='header__search' type="search" placeholder="" />          
								<div class='header_search_icon'>
								</div>
							<span class="header__search-clear ${getIsClearClass()}" @click="${clearSearchInput}">        							
							</span>       
						</div>
						<div  class="header__button-container">
							<button id="topics_button" data-test-id class="${getActiveClass(TabIds.TOPICS)}" title=${translate(
								'ea_header_tab_topics_title'
							)} @click="${openTopicsTab}">
								<span>
									${translate('ea_header_tab_topics_button')}
								</span>
							</button>
							<button id="extension_button" data-test-id class="${getActiveClass(TabIds.EXTENSION)} ${getMinWidthClass()}" title=${translate(
								'ea_header_tab_additional_title'
							)}  @click="${openExtendedTab}">
								<span>
									${translate('ea_header_tab_additional_button')}
								</span>
							</button>
							<button id="maps_button" data-test-id class="${getActiveClass(TabIds.MAPS)}" title=${translate(
								'ea_header_tab_maps_title'
							)}  @click="${openMapLayerTab}">
								<span>
									${translate('ea_header_tab_maps_button')}
								</span>
								<div class="badges">
									${layerCount}
								</div>
							</button>
							<button id="misc_button" data-test-id class="${getActiveClass(TabIds.MISC)}" title=${translate('ea_header_tab_more_title')}  @click="${openMiscTab}">
								<span>
									${translate('header_tab_misc_button')}
								</span>
							</button>
						</div>
					</div>				
				</div>				
            </div>
		`;
	}

	static get SWIPE_DELTA_PX() {
		return 50;
	}

	static get tag() {
		return 'ba-header';
	}
}
