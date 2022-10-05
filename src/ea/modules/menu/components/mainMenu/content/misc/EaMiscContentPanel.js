import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { $injector } from '../../../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import css from './eaMiscContentPanel.css';


const Update_Collapsed = 'update_collapse';

const SECTIONS = Object.freeze({
	moreinfo: 'moreinfo',
	aboutus: 'aboutus',
	legal: 'legal',
	settings: 'settings',
	links: 'links'
});
export class EaMiscContentPanel extends AbstractMvuContentPanel {

	constructor() {
		super({
			collapsedSections: [
				SECTIONS.moreinfo,
				SECTIONS.aboutus,
				SECTIONS.legal,
				SECTIONS.settings,
				SECTIONS.links
			]
		});

		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
	}


	update(type, data, model) {
		switch (type) {
			case Update_Collapsed:
				return { ...model, collapsedSections: data };
		}
	}



	createView(model) {
		const { collapsedSections } = model;

		const translate = (key) => this._translationService.translate(key);

		const createToggleFn = (section) => () => {
			let newSet;
			if (collapsedSections.includes(section)) {
				newSet = collapsedSections.filter(e => e !== section);
			}
			else {
				newSet = model.collapsedSections.concat([section]);
			}
			this.signal(Update_Collapsed, newSet);
		};

		const collapseClassMap = (section) => classMap({ iscollapse: collapsedSections.includes(section) });
		const iconexpandClassMap = (section) => classMap({ iconexpand: !collapsedSections.includes(section) });


		const header = (section, text_id) =>
			html`<div id="${section}-header" class="ba-list-item" @click="${createToggleFn(section)}">
				   <span .title='visible-title'  class='ba-list-item__text ba-list-item__primary-text' tabindex='0' .checked='true' >${translate(text_id)}</span>
     	           <button id='button-detail' data-test-id class='ba-list-item__after' title="collapse-title" >
	 			       <i class='icon chevron icon-rotate-90 ${iconexpandClassMap(section)}'></i>
    	           </button>   
				</div>`;

		const link = (link, text_id, tooltip_id, icon) =>
			html`<a class="ba-list-item" href='${link}'
					title='${translate(tooltip_id)}' target='_blank'>
					<span class="ba-list-item__pre">
						<span class="ba-list-item__icon link-icon ${icon}">
						</span>
					</span>
					<span class="ba-list-item__text vertical-center">${translate(text_id)}</span>
				</a>`;


		const appLink = (link, text_id, desc_id, image) =>
			html`<a class="ba-list-item" href=${link} target='_blank'>
					<span class="ba-list-item__pre ">
						<span class="ba-list-item__image link-image ${image}">
						</span>
					</span>
					<span class="ba-list-item__text ">
						<span class="ba-list-item__primary-text">${translate(text_id)}</span>
						<span class="ba-list-item__secondary-text">${translate(desc_id)}</span>
					</span>
				</a>`;


		return html`
		<style>${css}</style>
        <div class="ba-list">
			<div class='ba-section divider'>
				${header(SECTIONS.moreinfo, 'ea_menu_misc_content_panel_moreinfo')}
				<div id="moreinfo-content" class="collapse-content ${collapseClassMap(SECTIONS.moreinfo)}">
					${link('https://www.energieatlas.bayern.de/', 'ea_menu_misc_content_panel_ea', 'ea_menu_misc_content_panel_ea_tooltip', 'link')}
					${link('https://www.energieatlas.bayern.de/hilfe/karten', 'ea_menu_misc_content_panel_help', 'ea_menu_misc_content_panel_help_tooltip', 'help')}
					${link('https://www.lfu.bayern.de/publikationen/newsletter/eab_nl_anmeldung/anmeldung.htm', 'ea_menu_misc_content_panel_newsletter', 'ea_menu_misc_content_panel_newsletter_tooltip', 'link')}
				</div>
			</div>

			<div class='ba-section divider'>
				${header(SECTIONS.aboutus, 'ea_menu_misc_content_panel_aboutus')}
				<div id="${SECTIONS.aboutus}-content" class="collapse-content ${collapseClassMap(SECTIONS.aboutus)}">
					${link('https://www.energieatlas.bayern.de/service/impressum.html', 'ea_menu_misc_content_panel_imprint', 'ea_menu_misc_content_panel_imprint_tooltip', 'imprint')}
					${link('https://www.energieatlas.bayern.de/service/kontakt.html', 'ea_menu_misc_content_panel_contact', 'ea_menu_misc_content_panel_contact_tooltip', 'contact')}
				</div>
			</div>

			<div class='ba-section divider'>
				${header(SECTIONS.legal, 'ea_menu_misc_content_panel_legal')}
				<div id="${SECTIONS.legal}-content" class="collapse-content ${collapseClassMap(SECTIONS.legal)}">
					${link('https://www.energieatlas.bayern.de/service/datenschutz.html', 'ea_menu_misc_content_panel_privacy_policy', 'ea_menu_misc_content_panel_privacy_policy_tooltip', 'lock')}
					${link('https://www.energieatlas.bayern.de/hilfe/karten/HilfeTech/HilfeNutzung', 'ea_menu_misc_content_panel_terms_of_use', 'ea_menu_misc_content_panel_terms_of_use_tooltip', 'checklist')}
				</div>
			</div>

			<div class='ba-section divider'>
				${header(SECTIONS.settings, 'menu_misc_content_panel_settings')}
				<div id="${SECTIONS.settings}-content" class="collapse-content ${collapseClassMap(SECTIONS.settings)}">
					<div  class="ba-list-item divider">
						<span class="ba-list-item__text vertical-center">${translate('menu_misc_content_panel_dark_mode')}</span>
						<span class="ba-list-item__after">
							<ba-theme-toggle></ba-theme-toggle>
						</span>
					</div>
					${link('https://www.energieatlas.bayern.de/infos_schriftgroesse', 'ea_menu_misc_content_panel_change_font', 'ea_menu_misc_content_panel_change_font_tooltip', 'link')}
				</div>
			</div>

			<div class='ba-section divider'>
				${header(SECTIONS.links, 'ea_menu_misc_content_panel_links')}
				<div id="${SECTIONS.links}-content" class="collapse-content ${collapseClassMap(SECTIONS.links)}">
					${appLink('https://geoportal.bayern.de/bayernatlas/?lang=de&topic=ba&bgLayer=atkis', 'ea_menu_misc_content_panel_ba_header', 'ea_menu_misc_content_panel_ba_text', 'ba')}
					${appLink('https://geodatenonline.bayern.de/geodatenonline', 'menu_misc_content_panel_gdo_header', 'menu_misc_content_panel_gdo_text', 'gdo')}
					${appLink('https://www.geoportal.bayern.de/geoportalbayern', 'menu_misc_content_panel_gp_header', 'menu_misc_content_panel_gp_text', 'geoportal')}
				</div>
			</div>
		</div>
    `;
	}

	static get tag() {
		return 'ea-misc-content-panel';
	}
}
