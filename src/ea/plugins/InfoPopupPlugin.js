import { html } from 'lit-html';
import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { observe } from '../../utils/storeUtils';
import { openModal } from '../../store/modal/modal.action';
import { isHttpUrl } from '../../utils/checks';
import { activateInfoPopup, deactivateInfoPopup } from '../../ea/store/module/ea.action';

export const INFO_POPUP_NOTIFICATION_DELAY_TIME = 3000;

export class InfoPopupPlugin extends BaPlugin {

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const {
			EaInfoPopupService: eaInfoPopupService
		}
			= $injector.inject('EaInfoPopupService');

		this._eaInfoPopupService = eaInfoPopupService;
		this._infoPopupResult;

		const loadInfo = async () => {
			const result = await this._eaInfoPopupService.loadInfoPopupResult();
			this._infoPopupResult = result;
			const contentAvailable = this._infoPopupResult != null && isHttpUrl(this._infoPopupResult.url);
			if (!hasBeenVisible && contentAvailable) {
				window.setTimeout(() => openModalInfoPopup(this._infoPopupResult), INFO_POPUP_NOTIFICATION_DELAY_TIME);
			}
			return result;
		}

		const hasBeenVisible = false; //depence on cookie

		const openModalInfoPopup = (data) => {
			openModal(data.title, html`<eab-info-popup .msgKey=${data.key} .msgUrl=${data.url}></eab-info-popup>`);
		};

		const _activateInfoPopup = () => {
			window.console.log('activateInfoPopup');
		};

		const _deactivateInfoPopup = () => {
			window.console.error('de activateInfoPopup');
		};

		const onActiveStateChange = (active) => {
			if (active) {
				_activateInfoPopup();
			}
			else {
				_deactivateInfoPopup();
			}
		};

		loadInfo();
		window.console.log('register InfoPopup plugin');
		observe(store, state => state.ea.infoPopupActive, onActiveStateChange, false);
	}
}
