/**
 * @module modules/toolbox/components/shareToolContent/ShareToolContent
 */
import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { $injector } from '../../../../injection';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { openModal } from '../../../../store/modal/modal.action';
import { AbstractToolContent } from '../toolContainer/AbstractToolContent';
import css from './shareToolContent.css';
import { LevelTypes, emitNotification } from '../../../../store/notifications/notifications.action';

const Update_fallback_on_internal_implementation = 'update_fallback_on_internal_implementation';

/**
 * @class
 * @author bakir_en
 * @author thiloSchlemmer
 * @author taulinger
 */
export class ShareToolContent extends AbstractToolContent {
	constructor() {
		super({
			useShareAPI: true
		});

		const {
			TranslationService: translationService,
			UrlService: urlService,
			ShareService: shareService,
			EnvironmentService: environmentService
		} = $injector.inject('TranslationService', 'UrlService', 'ShareService', 'EnvironmentService');
		this._translationService = translationService;
		this._urlService = urlService;
		this._shareService = shareService;
		this._environmentService = environmentService;
		this._window = this._environmentService.getWindow();
	}

	update(type, _, model) {
		switch (type) {
			case Update_fallback_on_internal_implementation:
				return {
					...model,
					useShareAPI: false
				};
		}
	}

	_getToolsDefinitions() {
		const translate = (key) => this._translationService.translate(key);
		const shareApi = {
			id: 1,
			name: 'share-api',
			title: this._useShareApi() ? translate('toolbox_shareTool_share') : translate('toolbox_shareTool_link'),
			icon: this._useShareApi() ? 'share' : 'link'
		};

		const mail = {
			id: 2,
			name: 'mail',
			title: translate('toolbox_shareTool_mail'),
			icon: 'mail',
			href: (url) => `mailto:?body=${url}`
		};

		const qrCode = {
			id: 3,
			name: 'qr',
			title: translate('toolbox_shareTool_qr'),
			icon: 'qr',
			href: (url) => this._urlService.qrCode(url)
		};

		if (this._useShareApi()) {
			return [shareApi];
		} else {
			if (this._environmentService.isStandalone()) {
				return [shareApi, mail];
			}
			return [shareApi, mail, qrCode];
		}
	}

	/**
	 *@private
	 */
	_useShareApi() {
		return this.getModel().useShareAPI && this._window.navigator.share;
	}

	/**
	 *@private
	 */
	async _generateShortUrl() {
		const url = this._shareService.encodeState();
		try {
			return await this._urlService.shorten(url);
		} catch (e) {
			console.warn('Could not shorten url: ' + e);
			return url;
		}
	}

	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);

		const onToggle = (event) => {
			//Todo: This is workaround until all commons components / ba-button is reworked
			//then we bind a local field to the disabled property and just call render() afterwards
			this.shadowRoot.querySelector('.preview_button').disabled = !event.detail.checked;
		};

		const onPreview = () => {
			const content = html`<ba-iframe-generator></ba-iframe-generator>`;
			openModal(translate('toolbox_shareTool_embed'), content);
		};

		const shareWithoutShareAPI = async () => {
			const shortUrl = await this._generateShortUrl();
			const title = translate('toolbox_shareTool_share');
			const content = html`<ba-share-content .urls=${shortUrl}></ba-share-content>`;
			openModal(title, content);
		};
		const shareWithShareAPI = async () => {
			try {
				const shortUrl = await this._generateShortUrl();

				const shareData = {
					url: shortUrl
				};

				await this._window.navigator.share(shareData);
			} catch (e) {
				emitNotification(translate('toolbox_shareTool_share_api_failed'), LevelTypes.WARN);
				console.warn('error when using Web Share API, falling back to internal implementation');
				this.signal(Update_fallback_on_internal_implementation);
			}
		};

		const getToolTemplate = (tool) => {
			const buttonContent = html`
				<div class="tool-container__background"></div>
				<div class="tool-container__icon ${tool.icon}"></div>
				<div class="tool-container__button-text">${tool.title}</div>
			`;

			const getOnClickFunction = () => {
				if (tool.name === 'share-api') {
					if (this._useShareApi()) {
						return shareWithShareAPI;
					} else {
						return shareWithoutShareAPI;
					}
				} else {
					return async () => {
						try {
							const shortUrl = await this._generateShortUrl();

							if (this._window.open(tool.href(shortUrl)) === null) {
								throw new Error('Could not open window');
							}
						} catch (e) {
							console.warn('Could not share content: ' + e);
						}
					};
				}
			};

			return html` <button
				id=${tool.name}
				class="tool-container__button"
				title=${tool.title}
				role="button"
				tabindex="0"
				@click=${getOnClickFunction()}
				target="_blank"
			>
				${buttonContent}
			</button>`;
		};
		return html`
			<style>
				${css}
			</style>
			<div class="ba-tool-container">
				<div class="ba-tool-container__title">${translate('toolbox_shareTool_header')}</div>
				<div class="ba-tool-container__content">
					<div class="tool-container__buttons">
						${repeat(
							this._getToolsDefinitions(),
							(tool) => tool.id,
							(tool) => getToolTemplate(tool)
						)}
					</div>
				</div>
				<div class="ba-tool-container__title">${translate('toolbox_shareTool_embed')}</div>
				<div class="ba-tool-container__content">
					<ba-checkbox class="tool-container__checkbox" tabindex="0" @toggle=${onToggle} .checked=${false}>
						<span class="disclaimer-text">${unsafeHTML(`${translate('toolbox_shareTool_disclaimer')}`)}</span>
					</ba-checkbox>
				</div>
				<div class="ba-tool-container__actions">
					<ba-button
						class="preview_button"
						.type=${'primary'}
						.label=${translate('toolbox_shareTool_preview')}
						.disabled=${true}
						@click=${onPreview}
					></ba-button>
				</div>
			</div>
		`;
	}

	static get tag() {
		return 'ba-tool-share-content';
	}
}
