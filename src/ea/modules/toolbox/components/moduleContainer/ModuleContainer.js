import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { updateSize } from '../../../../../../src/store/position/position.action';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { close, open } from '../../../../../store/mainMenu/mainMenu.action';
import { setCurrentTool } from '../../../../../store/tools/tools.action';
import { closeFnModules } from '../../../../store/fnModuleComm/fnModuleComm.action';
import { EAContribution } from '../contribution/EAContribution';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../researchModuleContent/ResearchModuleContent';
import css from './moduleContainer.css';


const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_ToolId = 'update_tooId';

const MODULE_TAGS = [
	MixerModuleContent.tag,
	ResearchModuleContent.tag,
	RedesignModuleContent.tag,
	EAContribution.tag
];

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

		this.getBodyStyle = () => {
			const body = document.querySelector('body');
			const bodyStyle = window.getComputedStyle(body);
			return bodyStyle;
		};

		this.calcContainerWidth = (factor) => {
			const bodyWidth = parseFloat(this.getBodyStyle().width);
			const containerWidth = bodyWidth - (factor / 100 * bodyWidth);
			return containerWidth;
		};

	}

	/**
	 * @override
	 */
	update(type, data, model) {


		switch (type) {
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };

			case Update_ToolId:
				if (MODULE_TAGS.includes(data)) {
					close();
				}
				else if (MODULE_TAGS.includes(model.toolId)) {
					open();
				}

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

	tileMap(prozent) {
		let leftPart = (100.0 - prozent).toString() + '%';
		const rightPart = prozent + '%';
		const container = this.shadowRoot.getElementById('module-container');
		if (container) {
			window.getComputedStyle(container);
			container.style.width = rightPart;
			container.style.left = leftPart;
		}
		else {
			leftPart = '100%';
		}
		const map = document.querySelector('ea-map-container');
		if (map !== null && map.shadowRoot !== null) {
			const mapContainer = map.shadowRoot.querySelector('.map-container');
			mapContainer.style.width = leftPart;
			updateSize(prozent);
		}
		else {
			console.error('tileMap nicht möglich');
		}
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
			closeFnModules();
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


		const changeWidth = (event) => {
			const sliderValue = parseFloat(event.target.value);
			const prozent = 100 - sliderValue;
			this.tileMap(prozent);
		};

		const getSlider = () => {
			const onPreventDragging = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};

			return html`<div class='slider-container'>
				<input  
					type="range" 
					min="1" 
					max="100" 
					value="0" 
					draggable='true' 
					@input=${changeWidth} 
					@dragstart=${onPreventDragging}
					></div>`;
		};

		const content = getContentPanel(toolId);
		if (content == null) {
			return nothing;
		}

		return content !== nothing ? html`
			<style>${css}</style>		
			<div class=" ${getOrientationClass()}  ${getMinWidthClass()}">
                                        ${getSlider()} 
			<div id ="module-container" class="module-container">
				<div class="module-container__content ${getOverlayClass()}">    
					<div class="module-container__tools-nav">                        
						<button @click=${close} class="module-container__close-button">
							x
						</button>
					</div>		
					${content}
				</div>		
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

	onAfterRender(first) {
		super.onAfterRender(first);
		const element = this.shadowRoot.getElementById('module-container');
		if (element !== null && this._rendered) {
			const modulecontainerStyle = window.getComputedStyle(element);
			const bodyStyle = window.getComputedStyle(document.querySelector('body'));
			//Arbeiten mit em
			const bodyWidth = parseFloat(window.innerWidth) / parseFloat(bodyStyle.fontSize);
			let containerWidth = parseFloat(modulecontainerStyle.width) / parseFloat(modulecontainerStyle.fontSize);
			containerWidth = containerWidth + 0.3;
			//calcSliderValue
			const ratio = 100.0 * containerWidth / bodyWidth;
			const factor = 100 - ratio;
			//           console.log('factor'); console.log(factor);
			//           das nachträgliche setzen der width des containers ist ein Hack, da der ermittelte Factor sich nicht auf den Rand des Containers platziert.
			//           hier müssten mal Experten befragt werden
			element.style.width = containerWidth + 'em';
			const sliderInput = this.shadowRoot.querySelector('.slider-container input');
			sliderInput.value = factor;
			this.tileMap(ratio);
		}
		else {
			this._deactivateModule();
		}
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

	_deactivateModule() {
		const map = document.querySelector('ea-map-container');
		if (map && map.shadowRoot) {
			const mapContainer = map.shadowRoot.querySelector('.map-container');
			mapContainer.style.width = '100%';
			updateSize(100);
		}
	}
}
