import { BaElement } from '../../BaElement';
import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { $injector } from '../../../injection';
import { LevelTypes } from '../../../store/notifications/notifications.reducer';
import css from './notificationItem.css';

export const NOTIFICATION_AUTOCLOSE_TIME_NEVER = 0;
export class NotificationItem extends BaElement {
	constructor() {
		super();
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
		this._notification = { content: null, level: null };
		this._autocloseTime = NOTIFICATION_AUTOCLOSE_TIME_NEVER;
		this._autocloseTimeoutId = null;
		this._onClose = () => { };
	}


	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);

		const levelClass = {
			notification_info: this._level === LevelTypes.INFO,
			notification_warn: this._level === LevelTypes.WARN,
			notification_error: this._level === LevelTypes.ERROR,
			notification_custom: this._level === LevelTypes.CUSTOM
		};
		const getLevelText = (level) => {
			switch (level) {
				case LevelTypes.INFO:
					return html`<div class='notification_level'>${translate('notifications_item_info')}</div>`;
				case LevelTypes.WARN:
					return html`<div class='notification_level'>${translate('notifications_item_warn')}</div>`;
				case LevelTypes.ERROR:
					return html`<div class='notification_level'>${translate('notifications_item_error')}</div>`;
				default:
					return html.nothing;
			}
		};
		if (this._autocloseTime > NOTIFICATION_AUTOCLOSE_TIME_NEVER) {
			this._autocloseTimeoutId = setTimeout(() => {
				this._hide();
			}, this._autocloseTime);
		}

		const content = this._notification.content ? this._notification.content : html.nothing;
		return html`
		<style>${css}</style>
		<div class='notification_item ${classMap(levelClass)}'>
        	${getLevelText(this._notification.level)}
        	<div class='notification_content'>${content}</div>			
		</div>`;
	}

	_hide() {
		const element = this.shadowRoot.querySelector('.notification_item');

		// If the notification-item is not yet closed
		element.classList.add('notification_item_hide');

		element.addEventListener('animationend', () => {
			// If the notification-item is not yet closed
			this.onClose(this._notification);
			clearTimeout(this._autocloseTimeoutId);
		});
	}

	static get tag() {
		return 'ba-notification-item';
	}

	set content(value) {
		this._notification = value;
		this._autocloseTime = value.autocloseTime;
		this.render();
	}

	set onClose(callback) {
		this._onClose = callback;
	}

	get onClose() {
		return this._onClose;
	}

}
