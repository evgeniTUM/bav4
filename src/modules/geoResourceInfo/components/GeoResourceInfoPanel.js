import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { $injector } from '../../../injection';
import { emitNotification, LevelTypes } from '../../../store/notifications/notifications.action';
import { AbstractMvuContentPanel } from '../../menu/components/mainMenu/content/AbstractMvuContentPanel';
import { GeoResourceInfoResult } from '../services/GeoResourceInfoService';
import css from './geoResourceInfoPanel.css';

const Update_IsPortrait = 'update_isPortrait_hasMinWidth';
const UPDATE_GEORESOURCEINFO = 'UPDATE_GEORESOURCEINFO';

/**
 * Component for managing georesourceinfo.
 * @class
 * @author costa_gi
 * @author alsturm
 */
export class GeoResourceInfoPanel extends AbstractMvuContentPanel {

	constructor() {
		super({ geoResourceInfo: null });
		const { TranslationService: translationService, GeoResourceInfoService: geoResourceInfoService }
		= $injector.inject('TranslationService', 'GeoResourceInfoService');
		this._translationService = translationService;
		this._geoResourceInfoService = geoResourceInfoService;
		this.observe(state => state.media, media => this.signal(Update_IsPortrait, media.portrait));
	}

	update(type, data, model) {
		switch (type) {
			case UPDATE_GEORESOURCEINFO:
				return { ...model, geoResourceInfo: data };
			case Update_IsPortrait:
				return { ...model, isPortrait: data };
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const { geoResourceInfo, isPortrait } = model;

		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};


		const augmentChapter = (chapter, headlineTag) => {
			chapter.classList.add('ba-section');
			chapter.classList.add('divider');

			const container = document.createElement('div');
			container.classList.add('container');
			container.classList.add('collapse-content');
			container.classList.add('iscollapse');

			const icon = document.createElement('button');
			icon.classList.add('icon');
			icon.classList.add('chevron');
			icon.classList.add('icon-rotate-90');
			icon.style.marginLeft = '0.5em';

			const headline = chapter.getElementsByTagName(headlineTag)[0];
			headline.appendChild(icon);

			const elements = chapter.children;
			Array.from(elements).forEach(e => container.appendChild(e));

			headline.onclick = () => {
				const collapsed = container.classList.contains('iscollapse');

				if (collapsed) {
					container.classList.remove('iscollapse');
					icon.classList.add('iconexpand');
				}
				else {
					container.classList.add('iscollapse');
					icon.classList.remove('iconexpand');
				}
			};

			chapter.appendChild(headline);
			chapter.appendChild(container);
		};

		const augmentDetailInfo = () => {
			const content = this.shadowRoot.getElementById('content');
			if (content) {
				const chapters = content.getElementsByClassName('chapter');
				Array.from(chapters).forEach(e => augmentChapter(e, 'H5'));
				content.style.display = 'block';
			}
		};

		if (geoResourceInfo) {
			setTimeout(augmentDetailInfo, 50);

			return html`
			<style>${css}</style>
			<div>${geoResourceInfo.title}</div>
			<div id='content' style='display: none' class='${getOrientationClass()}'>${unsafeHTML(`${geoResourceInfo.content}`)}</div>
			`;
		}
		return html`<ba-spinner></ba-spinner>`;
	}

	static get tag() {
		return 'ba-georesourceinfo-panel';
	}

	/**
	 * @property {string} geoResourceId - the Id for the georesourceinfo
	 */
	set geoResourceId(value) {
		this._getGeoResourceInfo(value);
	}

	/**
	 * @private
	 */
	async _getGeoResourceInfo(geoResourceId) {

		try {
			let result = await this._geoResourceInfoService.byId(geoResourceId);
			if (result === null) {
				const translate = (key) => this._translationService.translate(key);
				const infoText = translate('geoResourceInfo_empty_geoResourceInfo');
				result = new GeoResourceInfoResult(infoText);
			}
			this.signal(UPDATE_GEORESOURCEINFO, result);
		}
		catch (e) {
			const message = this._translationService.translate('geoResourceInfo_geoResourceInfo_response_error');
			emitNotification(message, LevelTypes.WARN);
			console.warn(e);
			this.signal(UPDATE_GEORESOURCEINFO, null);
		}
	}
}
