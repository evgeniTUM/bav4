import '../../../../modules/header/i18n';
import { open as openMainMenu, setTab, TabId, toggle } from '../../../../store/mainMenu/mainMenu.action';
//import { TabIndex as TabIndex } from '../../../../store_ea/mainMenu/mainMenu.action';
import { html } from 'lit-html';
import { Header } from '../../../../modules/header/components/Header';
import { $injector } from '../../../../injection';
import css from './ea_header.css';
import baCss from '../../../../modules/header/components/header.css';


/**
 * Container element for header stuff customized for Energieatlas.
 * @class
 * @author kunze_ge
 */
export class EaHeader extends Header {

	constructor() {
		super();
		const { TranslationService: translationService } = $injector.inject('TranslationService');
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

		const helper = super.getViewAttrProvider(model);

		const openExtendedTab = () => {
			setTab(TabId.EXTENSION);
			openMainMenu();
		};

		const translate = (key) => this._translationService.translate(key);
		return html`
			<style>${baCss}</style>
			<div class="preload">
				<div class="${helper.getOrientationClass()} ${helper.getMinWidthClass()}">
					<a  title=${translate('header_action_button_title')} class="header_action_link" target="_blank" href="https://www.energieatlas.bayern.de/">
						<div class='header__logo'>				
							<div class="action-button">
								<div class="action-button__border animated-action-button__border ${helper.getAnimatedBorderClass()}">
								</div>
								<div class="action-button__icon">
									<div class="ba">
									</div>
								</div>
							</div>
							<div id='header__text' class='${helper.getOverlayClass()} header__text'>
							</div>
							<div class='header__logo-badge'>										
							${translate('header_logo_badge')}
						</div>	
						</div>
						<div id='headerMobile' class='${helper.getOverlayClass()} header__text-mobile'>	
						</div>
					</a>
					<span class='header__emblem_label' >Bayerische Staatsregierung</span>
					<a  title=${translate('header_emblem_action_title')} class="header_action_link" target="_blank" href="https://www.bayern.de/">
						<div class='header__emblem'></div>
					</a>
					<div  class="header ${helper.getOverlayClass()}">  
						<button id='header_toggle' class="close-menu" title=${translate('header_close_button_title')}  @click="${toggle}"">
							<i class="resize-icon "></i>
						</button> 
						<div class="header__background">
						</div>
						<div class='header__search-container'>
							<input id='input' data-test-id placeholder='${translate('header_search_placeholder')}' @focus="${helper.onInputFocus}" @blur="${helper.onInputBlur}" @input="${helper.onInput}" class='header__search' type="search" placeholder="" />          
							<span class="header__search-clear ${helper.getIsClearClass()}" @click="${helper.clearSearchInput}">        							
							</span>
							<button @click="${helper.showModalInfo}" class="header__modal-button hide" title="modal">
							&nbsp;
							</button>
						</div>
						<div  class="header__button-container">
							<button id="topics_button" data-test-id class="${helper.getActiveClass(TabId.TOPICS)}" title=${translate('ea_header_tab_topics_title')} @click="${helper.openTopicsTab}">
								<span>
									${translate('ea_header_tab_topics_button')}
								</span>
							</button>
							<button id="maps_button" data-test-id class="${helper.getActiveClass(TabId.EXTENSION)}" title=${translate('ea_header_tab_additional_title')}  @click="${openExtendedTab}">
								<span>
									${translate('ea_header_tab_additional_button')}
								</span>
							</button>
							<button id="maps_button" data-test-id class="${helper.getActiveClass(TabId.MAPS)}" title=${translate('ea_header_tab_maps_title')}  @click="${helper.openMapLayerTab}">
								<span>
									${translate('ea_header_tab_maps_button')}
								</span>
								<div class="badges">
									${helper.layerCount}
								</div>
							</button>
							<button id="misc_button" data-test-id class="${helper.getActiveClass(TabId.MORE)}" title=${translate('ea_header_tab_more_title')}  @click="${helper.openMiscTab}">
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

	//    Erweiterung des CSS Imports um EAB spezifische Style definitionen
	defaultCss() {
		return html`${this.extendedCss()} ${super.defaultCss()}`;
	}

	static get tag() {
		return 'ea-header';
	}
}
