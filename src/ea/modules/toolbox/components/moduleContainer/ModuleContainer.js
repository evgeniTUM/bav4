import { html, nothing } from 'lit-html';
import { MvuElement } from '../../../../../modules/MvuElement';
import { $injector } from '../../../../../injection';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../redesignModuleContent/RedesignModuleContent';
import { setCurrentTool, ToolId } from '../../../../../store/tools/tools.action';
import { LevelTypes } from '../../../../../store/notifications/notifications.action';
import { emitNotification } from '../../../../../store/notifications/notifications.action';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { changeCenter, updateSize } from '../../../../../../src/store/position/position.action';
import { getLayerById } from '../../../../../modules/map/components/olMap/olMapUtils';
import {getCenter} from 'ol/extent';
import { closeFnModules  } from '../../../../store/fnModuleComm/fnModuleComm.action';

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

		const {EnvironmentService, TranslationService, MapService} = $injector.inject('EnvironmentService', 'TranslationService');
		this._environmentService = EnvironmentService;
		this._translationService = TranslationService;
		this._lastContentId = false;

		this.getBodyStyle = () => {
			let body = document.querySelector("body");
			let bodyStyle = window.getComputedStyle(body);
			return bodyStyle;
		};

		this.calcContainerWidth = (factor) => {
			let bodyWidth = parseFloat(this.getBodyStyle().width);
			let containerWidth = bodyWidth - (factor / 100 * bodyWidth);
			return containerWidth;
		};

	}
	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_IsPortrait_HasMinWidth:
				return {...model, ...data};
			case Update_ToolId:
				return {...model, toolId: data};
		}
	}
	;
		/**
		 * @override
		 */
		onInitialize() {
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, {isPortrait: media.portrait, hasMinWidth: media.minWidth}));
		this.observe(state => state.tools.current, current => this.signal(Update_ToolId, current));
	}
	
		tileMap = (prozent) => {
			let leftPart = (100.0 - prozent).toString() + '%';
			let rightPart = prozent + '%';
			const container = this.shadowRoot.getElementById('module-container');
			if (container) {
				let popup = window.getComputedStyle(container);
				container.style.width = rightPart;
				container.style.left = leftPart;
			} else {
				leftPart = '100%';
			}
			let map = document.querySelector("ea-map-container");
			if (map !== null && map.shadowRoot !== null) {
				let mapContainer = map.shadowRoot.querySelector('.map-container');
				mapContainer.style.width = leftPart;
				updateSize(prozent);
			} else {
				console.error('tileMap nicht möglich');
			}
		}


	/**
	 * @override
	 */
	createView(model) {
		const {toolId, isPortrait, hasMinWidth} = model;

		const getContentPanel = (toolId) => {
			switch (toolId) {
				case MixerModuleContent.tag:
					return html`${unsafeHTML(`<${MixerModuleContent.tag}/>`)}`;
				case RedesignModuleContent.tag:
					return html`${unsafeHTML(`<${RedesignModuleContent.tag}/>`)}`;
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
			let sliderValue = parseFloat(event.target.value);
			let prozent = 100 - sliderValue;
			this.tileMap(prozent);
		};

		const getSlider = () => {
			const elt_ea_module_container = this;
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

		return toolId ? html`
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
		const {toolContainer: {open, contentId}, media: {portrait, minWidth}, layers: {active: activeLayers, ready: layersStoreReady}} = globalState;
		return {open, contentId, portrait, minWidth, activeLayers};
	}

	onAfterRender(first) {
		super.onAfterRender(first);
		const element = this.shadowRoot.getElementById('module-container');
		if (element !== null && this._rendered) {
			let modulecontainerStyle = window.getComputedStyle(element);
			let bodyStyle = window.getComputedStyle(document.querySelector("body"));
			//Arbeiten mit em
			let bodyWidth = parseFloat(window.innerWidth) / parseFloat(bodyStyle.fontSize);
			let containerWidth = parseFloat(modulecontainerStyle.width) / parseFloat(modulecontainerStyle.fontSize);
			containerWidth = containerWidth + 0.3;
			//calcSliderValue
			let ratio = 100.0 * containerWidth / bodyWidth;
			let factor = 100 - ratio;
//           console.log('factor'); console.log(factor);
//           das nachträgliche setzen der width des containers ist ein Hack, da der ermittelte Factor sich nicht auf den Rand des Containers platziert.
//           hier müssten mal Experten befragt werden
			element.style.width = containerWidth + 'em';
			const sliderInput = this.shadowRoot.querySelector('.slider-container input');
			sliderInput.value = factor;
			this.tileMap(ratio);
		} else {
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
		let map = document.querySelector("ea-map-container");
		let mapContainer = map.shadowRoot.querySelector('.map-container');
		mapContainer.style.width = '100%';
		updateSize(100);
	}
}
