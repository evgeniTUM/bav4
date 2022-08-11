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

		const { StoreService, TranslationService } = $injector
			.inject('StoreService', 'TranslationService');
		this._storeService = StoreService;
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

		const eabSettings = parseEabCookies();

		if (eabSettings.base && eabSettings.webanalyse) {
			activateWebAnalytics();
		}
		else {
			deactivateWebAnalytics();
		}

		if (eabSettings.base) {
			return nothing;
		}

		const settings = eabSettings;
		settings.base = true;

		const saveSettings = () => {
			document.cookie = serialize('eab', JSON.stringify(settings));

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
			openModal('Cookie Einstellungen', html`
			<div class='ea-cookie-settings>
				<div class='row'>
					<ba-button id='rejectAll' .label=${'Alle Cookies ablehnen'} .type=${'secondary'} @click=${rejectAll}></ba-button>
					<ba-button id='acceptAll' .label=${'Alle Cookies annehmen'} .type=${'secondary'} @click=${acceptAll}></ba-button>
					<ba-button id='save' .label=${'Speichern'} .type=${'primary'} @click=${saveSettings}></ba-button>
				</div>
			</div>
			`);
		};

		return html`
        <style>${css}</style>
		<div class='ea-dsgvo-popup'>
			<div class='row'>									
				<div style='min-width: 5em'>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				<ba-button id='cookie-settings' .label=${'Cookie Einstellungen'} .type=${'secondary'} @click=${openSettings}></ba-button>
				<ba-button id='cookie-settings' .label=${'Datenschutzerklärung'} .type=${'secondary'}></ba-button>
				</div>
				<div class='row'>
					<ba-button id='rejectAll' .label=${'Alle Cookies ablehnen'} .type=${'primary'} @click=${rejectAll}></ba-button>
					<ba-button id='acceptAll' .label=${'Alle Cookies annehmen'} .type=${'primary'} @click=${acceptAll}></ba-button>
				</div>
			</div>	
		</div>
        `;
	}

	static get tag() {
		return 'ea-dsgvo-dialog';
	}
}
