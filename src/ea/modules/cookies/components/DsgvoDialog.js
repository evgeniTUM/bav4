import { html, nothing } from 'lit-html';
import { $injector } from '../../../../injection';
import { MvuElement } from '../../../../modules/MvuElement';
import { openModal } from '../../../../store/modal/modal.action';
import { parse, serialize } from 'cookie';
import css from './dsgvoDialog.css';
import { activateWebAnalytics, deactivateWebAnalytics } from '../../../store/module/ea.action';


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
		const cookies = parse(document.cookie);
		console.log(cookies);

		if (('webAnalyticsActive' in cookies)) {
			if (cookies['webAnalyticsActive']) {
				console.log('activating');
				activateWebAnalytics();
			}
			else {
				console.log('deactivating');
				deactivateWebAnalytics();
			}

			return nothing;
		}

		const onAcceptAll = () => {
			document.cookie = serialize('webAnalyticsActive', true, { maxAge: 600 });
			console.log(document.cookie);
			this.onModelChanged();
		};

		const onRejectAll = () => {
			document.cookie = serialize('webAnalyticsActive', false, { maxAge: 600 });
			console.log(document.cookie);
			this.onModelChanged();
		};

		const openSettings = () => {

			openModal('Cookie Einstellungen', html`<ba-button id='accept' .label=${'Alle Cookies annehmen'} .type=${'primary'} @click=${onAcceptAll}></ba-button>
			`);
		};

		return html`
        <style>${css}</style>
		<div class='ea-dsgvo-container'>
			<div class='row'>									
				<div style='min-width: 5em'>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				<ba-button id='cookie-settings' .label=${'Cookie Einstellungen'} .type=${'secondary'} @click=${openSettings}></ba-button>
				<ba-button id='cookie-settings' .label=${'Datenschutzerklärung'} .type=${'secondary'}></ba-button>
				</div>
				<div class='row'>
					<ba-button id='reject' .label=${'Alle Cookies ablehnen'} .type=${'primary'} @click=${onRejectAll}></ba-button>
					<ba-button id='accept' .label=${'Alle Cookies annehmen'} .type=${'primary'} @click=${onAcceptAll}></ba-button>
				</div>
			</div>	
		</div>
        `;
	}

	static get tag() {
		return 'ea-dsgvo-dialog';
	}
}
