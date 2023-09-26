import { html } from 'lit-html';
import { $injector } from '../../../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import css from './eaMiscContentPanel.css';
import { closeModal, openModal } from '../../../../../../../store/modal/modal.action';

const Update_Collapsed = 'update_collapse';

export class EaMiscContentPanel extends AbstractMvuContentPanel {
	constructor() {
		super();

		const { TranslationService } = $injector.inject('TranslationService');
		(this._selectedFeedbackPanel = null), (this._translationService = TranslationService);
		this._onSubmit = () => {
			closeModal();
		};
	}

	update(type, data, model) {
		switch (type) {
			case Update_Collapsed:
				return { ...model, collapsedSections: data };
		}
	}

	createView() {
		const translate = (key) => this._translationService.translate(key);

		const openFeedbackDialog = () => {
			const title = translate('menu_misc_content_panel_feedback_title');
			const content = html`<ba-mvu-generalfeedbackpanel .onSubmit=${this._onSubmit}></ba-mvu-generalfeedbackpanel>`;
			openModal(title, content, { steps: 1 });
		};

		const link = (link, text_id, tooltip_id, icon) =>
			html`<a class="ba-list-item" href="${link}" title="${translate(tooltip_id)}" target="_blank">
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon link-icon ${icon}"> </span>
				</span>
				<span class="ba-list-item__text vertical-center">${translate(text_id)}</span>
			</a>`;

		const appLink = (link, text_id, desc_id, image) =>
			html`<a class="ba-list-item" href=${link} target="_blank">
				<span class="ba-list-item__pre ">
					<span class="ba-list-item__image link-image ${image}"> </span>
				</span>
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">${translate(text_id)}</span>
					<span class="ba-list-item__secondary-text">${translate(desc_id)}</span>
				</span>
			</a>`;

		return html` <style>
				${css}
			</style>
			<div>
				<collapsable-content .title=${translate('ea_menu_misc_content_panel_moreinfo')}>
					${link('https://www.energieatlas.bayern.de/', 'ea_menu_misc_content_panel_ea', 'ea_menu_misc_content_panel_ea_tooltip', 'link')}
					${link(
						'https://www.energieatlas.bayern.de/hilfe/karten',
						'ea_menu_misc_content_panel_help',
						'ea_menu_misc_content_panel_help_tooltip',
						'help'
					)}
					${link(
						'https://www.lfu.bayern.de/publikationen/newsletter/eab_nl_anmeldung/anmeldung.htm',
						'ea_menu_misc_content_panel_newsletter',
						'ea_menu_misc_content_panel_newsletter_tooltip',
						'link'
					)}
				</collapsable-content>
				<collapsable-content .title=${translate('ea_menu_misc_content_panel_aboutus')}>
					${link(
						'https://www.energieatlas.bayern.de/service/kontakt.html',
						'ea_menu_misc_content_panel_contact',
						'ea_menu_misc_content_panel_contact_tooltip',
						'contact'
					)}
					<button id="feedbackGeneralButton" class="ba-list-item" @click=${openFeedbackDialog}>
						<span class="ba-list-item__pre ">
							<span class="ba-list-item__icon link-icon feedback"> </span>
						</span>
						<span class="ba-list-item__text vertical-center">${translate('feedback_generalFeedback')}</span>
					</button>
					${link(
						'https://www.energieatlas.bayern.de/service/impressum.html',
						'ea_menu_misc_content_panel_imprint',
						'ea_menu_misc_content_panel_imprint_tooltip',
						'imprint'
					)}
				</collapsable-content>
				<collapsable-content .title=${translate('ea_menu_misc_content_panel_legal')}>
					${link(
						'https://www.energieatlas.bayern.de/service/datenschutz.html',
						'ea_menu_misc_content_panel_privacy_policy',
						'ea_menu_misc_content_panel_privacy_policy_tooltip',
						'lock'
					)}
					${link(
						'https://www.energieatlas.bayern.de/hilfe/karten/HilfeTech/HilfeNutzung',
						'ea_menu_misc_content_panel_terms_of_use',
						'ea_menu_misc_content_panel_terms_of_use_tooltip',
						'checklist'
					)}
				</collapsable-content>
				<collapsable-content .title=${translate('menu_misc_content_panel_settings')}>
					${link(
						'https://www.energieatlas.bayern.de/infos_schriftgroesse',
						'ea_menu_misc_content_panel_change_font',
						'ea_menu_misc_content_panel_change_font_tooltip',
						'link'
					)}
				</collapsable-content>
				<collapsable-content .title=${translate('ea_menu_misc_content_panel_links')}>
					${appLink(
						'https://geoportal.bayern.de/bayernatlas/?lang=de&topic=ba&bgLayer=atkis',
						'ea_menu_misc_content_panel_ba_header',
						'ea_menu_misc_content_panel_ba_text',
						'ba'
					)}
					${appLink(
						'https://geodatenonline.bayern.de/geodatenonline',
						'menu_misc_content_panel_gdo_header',
						'menu_misc_content_panel_gdo_text',
						'gdo'
					)}
					${appLink(
						'https://www.geoportal.bayern.de/geoportalbayern',
						'menu_misc_content_panel_gp_header',
						'menu_misc_content_panel_gp_text',
						'geoportal'
					)}
				</collapsable-content>
			</div>`;
	}

	set onSubmit(callback) {
		this._onSubmit = callback;
	}

	static get tag() {
		return 'ea-misc-content-panel';
	}
}
