import { html } from 'lit-html';
import { AbstractMvuContentPanel } from '../../../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import css from './eaMiscContentPanel.css';
import { $injector } from '../../../../../../../injection';


export class EaMiscContentPanel extends AbstractMvuContentPanel {

	constructor() {
		super({});
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
	}


	createView() {

		const translate = (key) => this._translationService.translate(key);

		return html`
		<style>${css}</style>
        <div class="ba-list">
			<div class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('ea_menu_misc_content_panel_moreinfo')}</span>
				</span>
			</div>
			<a class="ba-list-item" href='https://www.energieatlas.bayern.de/'
				title='${translate('ea_menu_misc_content_panel_ea_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon link">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_ea')}</span>
			</a>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/hilfe/karten'
				title='${translate('ea_menu_misc_content_panel_help_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon help">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_help')}</span>
			</a>
			<a class="ba-list-item"  href='https://www.lfu.bayern.de/publikationen/newsletter/eab_nl_anmeldung/anmeldung.htm'
				title='${translate('ea_menu_misc_content_panel_newsletter_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon link">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_newsletter')}</span>
			</a>

			<div class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('ea_menu_misc_content_panel_aboutus')}</span>
				</span>
			</div>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/service/kontakt.html'
				title='${translate('ea_menu_misc_content_panel_contact_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon contact">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_contact')}</span>
			</a>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/service/impressum.html'
				title='${translate('ea_menu_misc_content_panel_imprint_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon imprint">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_imprint')}</span>
			</a>

			<div class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('ea_menu_misc_content_panel_legal')}</span>
				</span>
			</div>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/service/datenschutz.html'
				title='${translate('ea_menu_misc_content_panel_privacy_policy_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon lock">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_privacy_policy')}</span>
			</a>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/service/nutzungsbedingungen-karten.html'
				title='${translate('ea_menu_misc_content_panel_terms_of_use_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon checklist">					
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_terms_of_use')}</span>
			</a> 

			<div class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('menu_misc_content_panel_settings')}</span>
				</span>
			</div>		
			<div  class="ba-list-item divider">
				<span class="ba-list-item__text vertical-center">${translate('menu_misc_content_panel_dark_mode')}</span>
				<span class="ba-list-item__after">
					<ba-theme-toggle></ba-theme-toggle>
				</span>
			</div>
			<a class="ba-list-item"  href='https://www.energieatlas.bayern.de/service/infos_schriftgroesse.html'
				title='${translate('ea_menu_misc_content_panel_change_font_tooltip')}' target='_blank'>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon link">					
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate('ea_menu_misc_content_panel_change_font')}</span>
			</a> 
		

			<div class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('ea_menu_misc_content_panel_links')}</span>
				</span>
			</div>	
			<a class="ba-list-item" href='https://geoportal.bayern.de/bayernatlas/?lang=de&topic=ba&bgLayer=atkis' target='_blank'>
				<span class="ba-list-item__pre ">
					<span class="ba-list-item__image image ba">
					</span>
				</span>
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('ea_menu_misc_content_panel_ba_header')}</span>
					<span class="ba-list-item__secondary-text">${translate('ea_menu_misc_content_panel_ba_text')}</span>
				</span>
			</a>             		          
			<a class="ba-list-item" href='https://geodatenonline.bayern.de/geodatenonline' target='_blank'>
				<span class="ba-list-item__pre ">
					<span class="ba-list-item__image image gdo">
					</span>
				</span>
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('menu_misc_content_panel_gdo_header')}</span>
					<span class="ba-list-item__secondary-text">${translate('menu_misc_content_panel_gdo_text')}</span>
				</span>
			</a>             
			<a class="ba-list-item" href='https://www.geoportal.bayern.de/geoportalbayern' target='_blank'>
				<span class="ba-list-item__pre ">
					<span class="ba-list-item__image image geoportal">
					</span>
				</span>
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate('menu_misc_content_panel_gp_header')}</span>
					<span class="ba-list-item__secondary-text">${translate('menu_misc_content_panel_gp_text')}</span>
				</span>
			</a>             		          

			
		</div>
    `;
	}

	static get tag() {
		return 'ea-misc-content-panel';
	}
}
