import '../../../header/i18n';
import { open as openMainMenu, setTabIndex, toggle } from '../../../../store/mainMenu/mainMenu.action';
//import { TabIndex as TabIndex } from '../../../../store_ea/mainMenu/mainMenu.action';
import { html } from 'lit-html';
import { Header } from '../../../header/components/Header';
import { $injector } from '../../../../injection';
import css from './ea_header.css';
import baCss from '../../../header/components/header.css';


/**
 * Extension of available menu tabs for EAB
 * @module menu/action
 @enum
 */
   const TabIndex = Object.freeze({
	EXTENSION: 6
});
/**
 * Container element for header stuff customized for Energieatlas.
 * @class
 * @author kunze_ge
 */
export class EaHeader extends Header {

	constructor() {
		super();
		const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject('EnvironmentService', 'TranslationService');
		this._translationService = translationService;
        }
        
        extendedCss() {
		return html`
		<style>
		${css}
		</style>
		`;
	}
        
	createView(model) {
            
                const viewAttrProvider = super.getViewAttrProvider(model);
                
		const openExtendedTab = () => {
			setTabIndex(TabIndex.EXTENSION);
			openMainMenu();
		};

		const translate = (key) => this._translationService.translate(key);
		return html`
			<style>${baCss}</style>
			<div class="preload ${viewAttrProvider.getOrientationClass()} ${viewAttrProvider.getMinWidthClass()}">
			<a  title=${translate('header_action_button_title')} class="header_action_link" target="_blank" href="https://www.energieatlas.bayern.de/">
				<div class='header__logo'>
					<div class="action-button">
						<div class="action-button__border animated-action-button__border ${viewAttrProvider.getAnimatedBorderClass()}">
						</div>
						<div class="action-button__icon">
							<div class="ba">
							</div>
						</div>
					</div>
					<div class='header__text'>
					</div>
				</div>	
				<div id='headerMobile' class='header__text-mobile'>	
				</div>
				<div class='header__emblem'>
				</div>
                                                 </a>

				<div  class="header ${viewAttrProvider.getOverlayClass()}">   
					<div class="header__background">
					</div>
					<div class='header__search-container'>
						<input id='input' @focus="${viewAttrProvider.onInputFocus}" @blur="${viewAttrProvider.onInputBlur}" @input="${viewAttrProvider.onInput}" class='header__search' type="search" placeholder="" />          
						<span class="header__search-clear ${viewAttrProvider.getIsClearClass()}" @click="${viewAttrProvider.clearSearchInput}">        							
						</span>
						<button @click="${viewAttrProvider.showModalInfo}" class="header__modal-button" title="modal">
							&nbsp;
							</button>
					</div>
					<div  class="header__button-container">
						<button class="${viewAttrProvider.getActiveClass(0)}" title=${translate('header_tab_topics_title')} @click="${viewAttrProvider.openTopicsTab}">
							<span>
								${translate('header_tab_topics_button')}
							</span>
						</button>
						<button class="${viewAttrProvider.getActiveClass(6)}" title=${translate('header_tab_additional_title')}  @click="${openExtendedTab}">
							<span>
								${translate('header_tab_additional_button')}
							</span>
						</button>
						<button class="${viewAttrProvider.getActiveClass(1)}" title=${translate('header_tab_maps_title')}  @click="${viewAttrProvider.openMapLayerTab}">
							<span>
								${translate('ea_header_tab_maps_button')}
							</span>
							 <div class="badges">
							 	${viewAttrProvider.layerCount}
							</div>
						</button>
						<button class="${viewAttrProvider.getActiveClass(2)}" title=${translate('header_tab_more_title')}  @click="${viewAttrProvider.openMoreTab}">
							<span>
								${translate('header_tab_more_button')}
							</span>
						</button>

					</div>
					<button class="close-menu" title=${translate('header_close_button_title')}  @click="${toggle}"">
						<span class='arrow'></span>	
					</button>
				</div>				
            </div>
		`;
	}

//    Erweiterung des CSS Imports um EAB spezifische Style definitionen
        defaultCss() {
            return html`${this.extendedCss()} ${super.defaultCss()}`;
	}
        
        static get tag() {
		return 'ea-header';
	}
}
