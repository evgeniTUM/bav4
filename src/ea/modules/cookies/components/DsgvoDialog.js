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

			openModal('Cookie Einstellungen', html`
        	<style>${css}</style>
			<div>
				<div>
					<div class='row setting'> 
						<div>Base</div>
						<ba-toggle .checked=${true} .disabled=${true} .title=${'Base'}></ba-toggle>
					</div>
					<div class='row setting'> 
						<div>Webanalyse</div> 
						<ba-toggle id='toggle-webanalyse' .checked=${settings.webanalyse} .title=${'Webanalyse'} @toggle=${onToggle}></ba-toggle>
					</div>
					<div class='row'>
						<ba-button id='rejectAll' .label=${'Alle Cookies ablehnen'} .type=${'secondary'} @click=${rejectAll}></ba-button>
						<ba-button id='acceptAll' .label=${'Alle Cookies annehmen'} .type=${'secondary'} @click=${acceptAll}></ba-button>
						<ba-button id='save' .label=${'Speichern'} .type=${'primary'} @click=${saveSettings}></ba-button>
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
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					<ba-button id='' .label=${'Datenschutzerklärung'} .type=${'secondary'}></ba-button>
					<ba-button id='cookie-settings' .label=${'Cookie Einstellungen'} .type=${'secondary'} @click=${openSettings}></ba-button>
				</div>
				<div class='row'>
					<ba-button id='reject-all' .label=${'Alle Cookies ablehnen'} .type=${'primary'} @click=${rejectAll}></ba-button>
					<ba-button id='accept-all' .label=${'Alle Cookies annehmen'} .type=${'primary'} @click=${acceptAll}></ba-button>
				</div>
			</div>	
		</div>
        `;
	}

	static get tag() {
		return 'ea-dsgvo-dialog';
	}
}
