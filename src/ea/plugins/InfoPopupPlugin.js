import { html } from 'lit-html';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { openModal } from '../../store/modal/modal.action';
import { isHttpUrl } from '../../utils/checks';
import { observe } from '../../utils/storeUtils';

export const INFO_POPUP_NOTIFICATION_DELAY_TIME = 3000;

export class InfoPopupPlugin extends BaPlugin {
	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {
		const { CookieService: cookieService, EaInfoPopupService: eaInfoPopupService } = $injector.inject('CookieService', 'EaInfoPopupService');

		let mustShow = true; //depence on cookie

		this._cookieService = cookieService;
		this._eaInfoPopupService = eaInfoPopupService;
		this._infoPopupResult = null;

		const loadInfo = async () => {
			const result = await this._eaInfoPopupService.loadInfoPopupResult();
			this._infoPopupResult = result;
			const contentAvailable = this._infoPopupResult != null && isHttpUrl(this._infoPopupResult.url);
			if (this._infoPopupResult && this._cookieService.getCookie(this._infoPopupResult.key) !== undefined) {
				mustShow = false;
			}

			if (mustShow && contentAvailable) {
				window.setTimeout(() => openModalInfoPopup(this._infoPopupResult), INFO_POPUP_NOTIFICATION_DELAY_TIME);
			}
			return result;
		};

		const openModalInfoPopup = (data) => {
			openModal(data.title, html`<eab-info-popup .msgKey=${data.key} .msgUrl=${data.url}></eab-info-popup>`);
		};

		const onInfoConfirmed = (active, state) => {
			window.console.log('onInfoConfirmed ...' + state.ea.infoPopupId);
			const messageId = state.ea.infoPopupId;
			if (active) {
				window.console.log('set Cookie with ...' + messageId);
				this._cookieService.setCookie(messageId, 'show', 120);
			} else {
				window.console.log('delete Cookie with ...' + messageId);
				this._cookieService.deleteCookie(messageId);
			}
		};

		loadInfo();
		observe(store, (state) => state.ea.infoPopupActive, onInfoConfirmed, true);
	}
}
