import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { open } from '../../../../../store/mainMenu/mainMenu.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { Analyse3DModuleContent } from '../analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../contribution/EAContribution';
import { GeothermModuleContent } from '../geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../mixer/MixerModuleContent';
import { RedesignModuleContent } from '../redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import css from './moduleContainer.css';


const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_ModuleId = 'update_moduleId';

export const Modules = [
	MixerModuleContent,
	RedesignModuleContent,
	EAContribution,
	ResearchModuleContent,
	Analyse3DModuleContent,
	GeothermModuleContent
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
			moduleId: null
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

			case Update_ModuleId:
				return { ...model, moduleId: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));
		this.observe(state => state.ea.currentModule, current => this.signal(Update_ModuleId, current));
	}

	/**
	 * @override
	 */
	createView(model) {
		const { moduleId, isPortrait, hasMinWidth } = model;

		const getContentPanel = (moduleId) => {
			const module = Modules.find(m => m.tag === moduleId);
			if (!module) {
				return nothing;
			}

			return html`${unsafeHTML(`<${module.tag}/>`)}`;
		};


		const close = () => {
			setCurrentModule(null);
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

		const content = getContentPanel(moduleId);
		if (content == null) {
			return nothing;
		}

		const changeWidth = (event) => {
			const container = this.shadowRoot.getElementById('module-container');
			container.style.width = parseInt(event.target.value) + 'em';
			window.dispatchEvent(new Event('resize'));
		};


		const getValue = () => {
			const container = this.shadowRoot.getElementById('module-container');
			return (container && container.style.width !== '') ? parseInt(container.style.width) : ModuleContainer.INITIAL_WIDTH_EM;
		};

		const onPreventDragging = (e) => {
			e.preventDefault();
			e.stopPropagation();
		};


		return content !== nothing ? html`
			<style>${css}</style>		

			<div class='slider-container'>
				<input  
					type="range" 
					min="${ModuleContainer.MIN_WIDTH_EM}" 
					max="${ModuleContainer.MAX_WIDTH_EM}" 
					value="${getValue()}" 
					draggable='true' 
					@input=${changeWidth} 
					@dragstart=${onPreventDragging}>
				</input>
			</div>

			<div id="module-container" class="column module-container ${getOrientationClass()}  ${getMinWidthClass()}"
				style="width: ${ModuleContainer.INITIAL_WIDTH_EM}em">
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
	 */
	onAfterRender(first) {
		super.onAfterRender(first);
		window.dispatchEvent(new Event('resize'));
	}

	static get tag() {
		return 'ea-module-container';
	}

	static get INITIAL_WIDTH_EM() {
		return 40;
	}

	static get MIN_WIDTH_EM() {
		return 34;
	}

	static get MAX_WIDTH_EM() {
		return 100;
	}
}
