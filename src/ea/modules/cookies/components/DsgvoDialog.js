import { parse, serialize } from 'cookie';
import { html, nothing } from 'lit-html';
import { $injector } from '../../../../injection';
import { MvuElement } from '../../../../modules/MvuElement';
import { closeModal, openModal } from '../../../../store/modal/modal.action';
import { activateWebAnalytics, deactivateWebAnalytics } from '../../../store/module/ea.action';
import css from './dsgvoDialog.css';


export class DsgvoDialog extends MvuElement {

	constructor() {
		super();

		const { TranslationService } = $injector
			.inject('TranslationService');

		this._translationService = TranslationService;
	}

	/**
	 * @override
	 */
	onInitialize() {
	}

	createView() {

		const translate = (key) => this._translationService.translate(key);

		const parseEabCookies = () => {
			const cookies = parse(document.cookie);

			if (cookies.eab) {
				try {
					return JSON.parse(cookies.eab);
				}
				catch (e) {
					console.warn('Parsing of cookie property eab failed: ' + e);
				}
			}

			return {};
		};

		const loadedSettings = parseEabCookies();

		if (loadedSettings.base && loadedSettings.webanalyse) {
			activateWebAnalytics();
		}
		else {
			deactivateWebAnalytics();
		}

		if (loadedSettings.base) {
			return nothing;
		}

		const settings = { base: true, webanalyse: true };

		const saveSettings = () => {
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 120);
			const options = {
				expires: expirationDate,
				sameSite: 'lax'
			};

			document.cookie = serialize('eab', JSON.stringify(settings), options);

			closeModal();
			this.onModelChanged();
		};

		const acceptAll = () => {
			settings.webanalyse = true;
			saveSettings();
		};

		const rejectAll = () => {
			settings.webanalyse = false;
			saveSettings();
		};


		const openSettings = () => {
			const onToggle = (event) => {
				settings.webanalyse = event.detail.checked;
			};

			openModal(translate('ea_dsgvo_cookie_settings'), html`
        	<style>${css}</style>
			<div>
				<div>

					<div class='setting'>
						<div class='setting-description'> 
							<div class='setting-title'>${translate('ea_dsgvo_basic_cookies_title')}</div>
							<div>
								${translate('ea_dsgvo_basic_cookies_text')}
							</div>
						</div>
						<ba-toggle .checked=${true} .disabled=${true} .title=${translate('ea_dsgvo_basic_cookies_title')}>
							<span style="margin-right: 0.5em">${translate('ea_dsgvo_always_on')}</span>
						</ba-toggle>
					</div>

					<div class='setting'> 
						<div class='setting-description'> 
							<div class='setting-title'>${translate('ea_dsgvo_webanalytics_cookies_title')}</div>
							<div>
								${translate('ea_dsgvo_webanalytics_cookies_text')}
							</div>
						</div>
						<ba-toggle id='toggle-webanalyse' .checked=${settings.webanalyse} .title=${translate('ea_dsgvo_webanalytics_cookies_title')} @toggle=${onToggle}></ba-toggle>
					</div>

					<div class='row settings-button-container'>
						<div class='row'>
							<ba-button id='rejectAll' .label=${translate('ea_dsgvo_reject_all')} .type=${'secondary'} @click=${rejectAll}></ba-button>
							<ba-button id='acceptAll' .label=${translate('ea_dsgvo_accept_all')} .type=${'secondary'} @click=${acceptAll}></ba-button>
						</div>
						<ba-button id='save' .label=${translate('ea_dsgvo_save')} .type=${'primary'} @click=${saveSettings}></ba-button>
					</div>
					
				</div>
			</div>
			`);
		};

		return html`
        <style>${css}</style>
		<div class='popup'>
			<div class='row'>
				<div class='row popup-text'>
					${translate('ea_dsgvo_text')}
					<a id='privacy-policy-link' href='https://prod.energieatlas.bayern.de/datenschutz' target='_blank'>
						<ba-button .label=${translate('ea_dsgvo_privacy_policy')} .type=${'secondary'}></ba-button>
					</a>
					<ba-button id='cookie-settings' .label=${translate('ea_dsgvo_cookie_settings')} .type=${'secondary'} @click=${openSettings}></ba-button>
				</div>
				<div class='row'>
					<ba-button id='reject-all' .label=${translate('ea_dsgvo_reject_all')} .type=${'primary'} @click=${rejectAll}></ba-button>
					<ba-button id='accept-all' .label=${translate('ea_dsgvo_accept_all')} .type=${'primary'} @click=${acceptAll}></ba-button>
				</div>
			</div>	
		</div>
        `;
	}

	static get tag() {
		return 'ea-dsgvo-dialog';
	}
}
