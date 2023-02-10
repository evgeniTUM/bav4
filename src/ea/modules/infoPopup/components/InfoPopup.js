import { html } from 'lit-html';
import { $injector } from '../../../../injection';
import css from './infoPopup.css';
import { MvuElement } from '../../../../modules/MvuElement';
import { QueryParameters } from '../../../../domain/queryParameters';

export const INFO_POPUP_NOTIFICATION_DELAY_TIME = 3000;

const Update_MsgKey = 'update_key';
const Update_MsgUrl = 'update_url';

/**
 * @class
 * @author kun
 */
export class InfoPopup extends MvuElement {

	constructor() {
		super({
			isPortrait: false,
			hasMinWidth: false,
			isOpen: false,
			hasBeenVisible: false,
			msgKey: null,
			msgUrl: null
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService
		}
			= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
	}


	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_MsgKey:
				return { ...model, msgKey: data };
			case Update_MsgUrl:
				return { ...model, msgUrl: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
	}



	/**
	 * @override
	 */
	createView(model) {
		const { msgKey, msgUrl } = model;
		const translate = (key) => this._translationService.translate(key);
		const label = translate('help_infoPopup_check_label');
		const checkbox_title = translate('help_infoPopup_check_title');
		const checked = false;

		const onToggle = (event) => {
			if (event.detail.checked) {
				window.console.log('add Cookie ' + msgKey);
			}
			else {
				window.console.log('remove Cookie ' + msgKey);
			}
		};

		return html`<style>${css}</style><iframe title=${translate('help_infoPopup_notification_info_popup')}
				 src=${msgUrl} allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe> 
				<ba-checkbox class="ba-list-item__text" @toggle=${onToggle} .checked=${checked} tabindex='0' .title=${checkbox_title}><span>${label}</span></ba-checkbox>`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get tag() {
		return 'eab-info-popup';
	}

	/**
	 * @property {string} msgUrl=null - Info-Popup-Message-Url
	 */
	set msgUrl(value) {
		this.signal(Update_MsgUrl, value);
	}

	get msgUrl() {
		return this.getModel().msgUrl;
	}

	/**
	 * @property {string} msgKey=null - Key from Info-Popup-Message
	 */
	set msgKey(value) {
		this.signal(Update_MsgKey, value);
	}

	get msgKey() {
		return this.getModel().msgKey;
	}

}
