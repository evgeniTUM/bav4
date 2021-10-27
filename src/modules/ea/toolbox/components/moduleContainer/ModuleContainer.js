import { html, nothing } from 'lit-html';
import { BaElement } from '../../../../BaElement';
import { $injector } from '../../../../../injection';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { closeToolContainer } from '../../../../toolbox/store/toolContainer.action';
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
			EnvironmentService: environmentService
		}
			= $injector.inject('EnvironmentService');

		this._environmentService = environmentService;
		this._lastContentId = false;
	}



	/**
	 * @override
	 */
	createView(state) {

		const { open, contentId, portrait, minWidth } = state;
                
                console.log('createView ModuleContainer' + contentId);

		let content;
		switch (contentId) {
			case MixerModuleContent.tag:
				content = html`<ea-module-mixer-content></ea-module-mixer-content>`;
				break;
			default:
				return nothing;
		}

		if (this._lastContentId !== contentId && open) {
			this._deactivateByContentId(this._lastContentId);
			this._activateByContentId(contentId);
		}

		if (!open) {
			this._deactivateByContentId(this._lastContentId);
		}
		else {
			this._lastContentId = contentId;
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
