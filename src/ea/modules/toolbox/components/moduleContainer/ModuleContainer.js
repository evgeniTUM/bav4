import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { open } from '../../../../../store/mainMenu/mainMenu.action';
import { EaModules, setCurrentModule } from '../../../../store/module/ea.action';
import css from './moduleContainer.css';


const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_ModuleId = 'update_moduleId';


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

		const module = EaModules.find(m => m.name === moduleId);
		if (!module) {
			return nothing;
		}

		const content = html`${unsafeHTML(`<${module.tag}/>`)}`;

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

		const changeWidth = (event) => {
			const container = this.shadowRoot.getElementById('module-container');
			container.style.width = parseInt(event.target.value) + 'em';
			window.dispatchEvent(new Event('resize'));
			this.render();
		};


		const getValue = () => {
			const container = this.shadowRoot.getElementById('module-container');
			return (container && container.style.width !== '') ? parseInt(container.style.width) : module.initialWidth;
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
					min="${module.minWidth}" 
					max="${module.maxWidth}" 
					value="${getValue()}" 
					draggable='true' 
					@input=${changeWidth} 
					@dragstart=${onPreventDragging}>
				</input>
			</div>

			<div id="module-container" class="column module-container ${getOrientationClass()}  ${getMinWidthClass()}"
				style="width: ${module.initialWidth}em">
				<div class="module-container__content ${getOverlayClass()}">
					<div class="module-container__tools-nav">
						<span style='color: white; font-weight: large'> Fensterbreite: ${getValue()}em</span>
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
}
