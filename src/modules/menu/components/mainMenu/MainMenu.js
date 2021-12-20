import { html, nothing } from 'lit-html';
import { BaElement, renderTagOf } from '../../../BaElement';
import css from './mainMenu.css';
import { $injector } from '../../../../injection';
import { DevInfo } from '../../../utils/components/devInfo/DevInfo';
import { TopicsContentPanel } from '../../../topics/components/menu/TopicsContentPanel';
import { SearchResultsPanel } from '../../../search/components/menu/SearchResultsPanel';
import { TabIndex, toggle } from '../../../../store/mainMenu/mainMenu.action';
import { FeatureInfoPanel } from '../../../featureInfo/components/FeatureInfoPanel';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';


/**
 *
 * @class
 * @author alsturm
 * @author taulinger
 */
export class MainMenu extends BaElement {

	constructor() {
		super();
		const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject('EnvironmentService', 'TranslationService');
		this._environmentService = environmentService;
		this._translationService = translationService;
		this._activeTabIndex = 0;
	}

	_activateTab(index) {
		const tabcontents = [...this._root.querySelectorAll('.tabcontent')];
		tabcontents.forEach((tabcontent, i) => (i === index) ? tabcontent.classList.add('is-active') : tabcontent.classList.remove('is-active'));
	}

	/**
	* @override
	*/
	onAfterRender() {
		this._activateTab(this._activeTabIndex);
	}

	/**
	 * @override
	 */
	createView(state) {

		const { open, tabIndex, portrait, minWidth, observeResponsiveParameter } = state;

		this._activeTabIndex = tabIndex;

		const getOrientationClass = () => portrait ? 'is-portrait' : 'is-landscape';

		const getMinWidthClass = () => minWidth ? 'is-desktop' : 'is-tablet';

		const getFullSizeClass = () => (tabIndex === TabIndex.FEATUREINFO) ? 'is-full-size' : '';

		const getOverlayClass = () => open ? 'is-open' : '';

		const getPreloadClass = () => observeResponsiveParameter ? '' : 'prevent-transition';

		const contentPanels = Object.values(TabIndex)
			//Todo: refactor me when all content panels are real components
			.map(v => this._getContentPanel(v));

		const translate = (key) => this._translationService.translate(key);

		const changeWidth = (event) => {
			const container = this.shadowRoot.getElementById('mainmenu');
			container.style.width = parseInt(event.target.value) + 'em';
		};

		const getSlider = () => {

			const onPreventDragging = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};

			return html`<div class='slider-container'>
				<input  
					type="range" 
					min="28" 
					max="100" 
					value="28" 
					draggable='true' 
					@input=${changeWidth} 
					@dragstart=${onPreventDragging}
					></div>`;
		};


		return html`
			<style>${css}</style>
			<div class="${getOrientationClass()} ${getPreloadClass()}">
				<div id='mainmenu' class="main-menu ${getOverlayClass()} ${getMinWidthClass()} ${getFullSizeClass()}">            
					<button @click="${toggle}" title=${translate('menu_main_open_button')} class="main-menu__close-button">
						<span class='main-menu__close-button-text'>${translate('menu_main_open_button')}</span>	
						<i class='resize-icon'></i>	
					</button>	
					${getSlider()} 
					<div id='mainMenuContainer' class='main-menu__container'>					
						<div class="overlay-content">
							${contentPanels.map(item => html`
								<div class="tabcontent">						
									${item}
								</div>								
							`)}
						</div>
					</div>		
					<div>
						${renderTagOf(DevInfo)}	
					</div>	
				</div>			
			</div>			
		`;
	}

	_getContentPanel(index) {
		switch (index) {
			case TabIndex.MAPS:
				return this._demoMapContent();
			case TabIndex.MORE:
				return this._demoMoreContent();
			case TabIndex.SEARCH:
				return html`${unsafeHTML(`<${SearchResultsPanel.tag}/>`)}`;
			case TabIndex.TOPICS:
				return html`${unsafeHTML(`<${TopicsContentPanel.tag}/>`)}`;
			case TabIndex.FEATUREINFO:
				return html`${unsafeHTML(`<${FeatureInfoPanel.tag}/>`)}`;
			default:
				return nothing;
		}
	}

	_demoMapContent() {

		return html`
		<div>
			<ba-base-layer-switcher></ba-base-layer-switcher>
			<ba-layer-manager></ba-layer-manager>
		</div>
		`;
	}

	_demoMoreContent() {
		return html`
		<ul class="ba-list">	
		<li class="ba-list-item  ba-list-item__header">
		<span class="ba-list-item__text ">
			<span class="ba-list-item__primary-text">
				Settings
			</span>
		</span>
	</li>		
		<li  class="ba-list-item">
		<span class="ba-list-item__text vertical-center">
		<span class="ba-list-item__primary-text">
		Dark mode
		</span>              
	</span>
	<span class="ba-list-item__after">
	<ba-theme-toggle></ba-theme-toggle>
	</span>
		</li>
		<li  class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Lorem ipsum dolor
				</span>
			</span>
		</li>
		<li  class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Lorem ipsum dolor
				</span>
			</span>
		</li>
		<li class="ba-list-item  ba-list-item__header">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
					Links
				</span>
			</span>
		</li>
   
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Lorem ipsum
				</span>
				<span class="ba-list-item__secondary-text">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr
				</span>
			</span>
		</li>             
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Lorem ipsum 
				</span>
				<span class="ba-list-item__secondary-text">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr
				</span>
			</span>
		</li>             
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Lorem ipsum 
				</span>
				<span class="ba-list-item__secondary-text">
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr
				</span>
			</span>
		</li>          
		<li class="ba-list-item" style="display:none">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
				Lorem ipsum dolor
				</span>              
			</span>
			<span class="ba-list-item__after">
			<span class="ba-list-item__icon-info">                                
			</span>
		</span>
		</li>  		          
	</ul>
	`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	/**
	 * @override
	 * @param {Object} globalState
	 */
	extractState(globalState) {
		const { mainMenu: { open, tabIndex }, media: { portrait, minWidth, observeResponsiveParameter } } = globalState;
		return { open, tabIndex, portrait, minWidth, observeResponsiveParameter };
	}

	static get tag() {
		return 'ba-main-menu';
	}
}
