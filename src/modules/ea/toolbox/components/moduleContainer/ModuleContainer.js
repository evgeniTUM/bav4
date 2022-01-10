import { html, nothing } from 'lit-html';
import { BaElement } from '../../../../BaElement';
import { $injector } from '../../../../../injection';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { closeToolContainer } from '../../../../../store/toolContainer/toolContainer.action';
import { LevelTypes } from '../../../../../store/notifications/notifications.action';
import { emitNotification } from '../../../../../store/notifications/notifications.action';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

//import { activate as activateMeasurement, deactivate as deactivateMeasurement } from '../../../map/store/measurement.action';
//import { activate as activateDraw, deactivate as deactivateDraw } from '../../../map/store/draw.action';
import css from './moduleContainer.css';

/**
 * @class
 * @author kunze_ge
 */
export class ModuleContainer extends BaElement {

	constructor() {
		super();

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService

		}
		= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._lastContentId = false;
	}



	/**
	 * @override
	 */
	createView(state) {

		const { open, contentId, portrait, minWidth } = state;
                
                console.log('createView ModuleContainer contentId' + contentId + ' open ' + open );
                
		const translate = (key) => this._translationService.translate(key);

		const getContent = (contentId) => {
			switch (contentId) {
				case MixerModuleContent.tag:
					return html`${unsafeHTML(`<${MixerModuleContent.tag}/>`)}`;
				default:
					return null;
			}
		};

		const getNextActiveContent = () => {
			if (this._lastContentId !== contentId && open) {
				if (this._lastContentId) {
					return this._lastContentId;
				}

			}
			if (!open) {
				return null;
			}
			return contentId;
		};
		const nextActiveContentId = getNextActiveContent();
		if (nextActiveContentId === this._lastContentId) {
			emitNotification(translate('module_prevent_switching_tool'), LevelTypes.WARN);
		}
		else {
			if (nextActiveContentId) {
				this._lastContentId = nextActiveContentId;
				this._activateByContentId(nextActiveContentId);
			}
			else {
				this._deactivateByContentId(this._lastContentId);
			}
		}

		const getOrientationClass = () => {
			return portrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return minWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return open ? 'is-open' : '';
		};
                
		const content = getContent(nextActiveContentId);
		if (content == null) {
			return nothing;
		}
                
		return html`
			<style>${css}</style>		
			<div class=" ${getOrientationClass()} ${getMinWidthClass()}">  	
			<div class="module-container">
				<div class="module-container__content ${getOverlayClass()}">    
				<div class="module-container__tools-nav">                        
                        <button @click=${closeToolContainer} class="module-container__close-button">
                            x
                        </button>                             
                </div>		
					${content}
				</div>		
			</div>		
			</div>		
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	/**
 * @override
 * @param {Object} globalState
 */
	extractState(globalState) {
		const { toolContainer: { open, contentId }, media: { portrait, minWidth } } = globalState;
		return { open, contentId, portrait, minWidth };
	}

	static get tag() {
		return 'ea-module-container';
	}

	_activateByContentId(contentId) {
		switch (contentId) {
			case MixerModuleContent.tag:
//				activateMeasurement();
				break;
//			case DrawToolContent.tag:
//				activateDraw();
//				break;
		}
	}

	_deactivateByContentId(contentId) {
		switch (contentId) {
			case MixerModuleContent.tag:
//				deactivateMeasurement();
				break;
//			case DrawToolContent.tag:
//				deactivateDraw();
//				break;
		}
		this._lastContentId = false;
	}
}
