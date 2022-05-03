import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { updateSize } from '../../../../../../src/store/position/position.action';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { open } from '../../../../../store/mainMenu/mainMenu.action';
import { setCurrentTool } from '../../../../../store/tools/tools.action';
import { EAContribution } from '../contribution/EAContribution';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../researchModuleContent/ResearchModuleContent';
import css from './moduleContainer.css';


const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_ToolId = 'update_tooId';

/**
 * @class
 * @author kunze_ge
 */
export class ModuleContainer extends MvuElement {

	constructor() {
		super({
			isPortrait: false,
			hasMinWidth: false,
			toolId: null
		});

		const { EnvironmentService, TranslationService } = $injector.inject('EnvironmentService', 'TranslationService');
		this._environmentService = EnvironmentService;
		this._translationService = TranslationService;
		this._lastContentId = false;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };

			case Update_ToolId:
				return { ...model, toolId: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));
		this.observe(state => state.tools.current, current => this.signal(Update_ToolId, current));
	}

	/**
	 * @override
	 */
	createView(model) {
		const { toolId, isPortrait, hasMinWidth } = model;

		const getContentPanel = (toolId) => {
			switch (toolId) {
				case MixerModuleContent.tag:
					return html`${unsafeHTML(`<${MixerModuleContent.tag}/>`)}`;
				case RedesignModuleContent.tag:
					return html`${unsafeHTML(`<${RedesignModuleContent.tag}/>`)}`;
				case EAContribution.tag:
					return html`${unsafeHTML(`<${EAContribution.tag}/>`)}`;
				case ResearchModuleContent.tag:
					return html`${unsafeHTML(`<${ResearchModuleContent.tag}/>`)}`;
				default:
					return nothing;
			}
		};


		const close = () => {
			setCurrentTool(null);
		};

		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return hasMinWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return open ? 'is-open' : '';
		};

		const content = getContentPanel(toolId);
		if (content == null) {
			return nothing;
		}

		return content !== nothing ? html`
			<style>${css}</style>		
			<div class="column module-container ${getOrientationClass()}  ${getMinWidthClass()}">
				<div class="module-container__content ${getOverlayClass()}">    
					<div class="module-container__tools-nav">                        
						<button @click=${close} class="module-container__close-button">
							x
						</button>
					</div>		
					${content}
				</div>		
			</div>		
		` : nothing;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	/**
	 * @override
	 * @param {Object} globalState
	 */
	extractState(globalState) {
		const { toolContainer: { open, contentId }, media: { portrait, minWidth }, layers: { active: activeLayers } } = globalState;
		return { open, contentId, portrait, minWidth, activeLayers };
	}

	_deactivateModule() {
		updateSize(100);
	}

	static get tag() {
		return 'ea-module-container';
	}

}
