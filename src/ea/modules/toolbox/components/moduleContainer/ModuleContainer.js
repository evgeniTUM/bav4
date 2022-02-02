import { html, nothing } from 'lit-html';
import { BaElement } from '../../../../../modules/BaElement';
import { MvuElement } from '../../../../../modules/MvuElement';
import { $injector } from '../../../../../injection';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../redesignModuleContent/RedesignModuleContent';
import { closeToolContainer } from '../../../../../store/toolContainer/toolContainer.action';
import { LevelTypes } from '../../../../../store/notifications/notifications.action';
import { emitNotification } from '../../../../../store/notifications/notifications.action';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { changeCenter, updateSize } from '../../../../../../src/store/position/position.action';
import { getLayerById } from '../../../../../modules/map/components/olMap/olMapUtils';
import {getCenter} from 'ol/extent';

import css from './moduleContainer.css';

/**
 * @class
 * @author kunze_ge
 */
export class ModuleContainer extends BaElement {

    constructor() {
        super();

        const {EnvironmentService, TranslationService, MapService} = $injector.inject('EnvironmentService', 'TranslationService');
        this._environmentService = EnvironmentService;
        this._translationService = TranslationService;
        this._lastContentId = false;

        this.getBodyStyle  = () => { 
            let body = document.querySelector("body");
            let bodyStyle = window.getComputedStyle(body);
            return bodyStyle;
        };

        this.calcContainerWidth = (factor) =>{
            let bodyWidth = parseFloat(this.getBodyStyle().width);
            let containerWidth = bodyWidth - ( factor / 100 * bodyWidth );
            return containerWidth ;
        };

    }

    /**
     * @override
     */
    createView(state) {

//        throw new Exception('jhjkhjkjk');
        console.log('createView of ModuleContainer');
        console.log(state);
        const {open, contentId, portrait, minWidth, activeLayers, zoom} = state;
        const translate = (key) => this._translationService.translate(key);

        const getContent = (contentId) => {
            switch (contentId) {
                case MixerModuleContent.tag:
                    return html`${unsafeHTML(`<${MixerModuleContent.tag}/>`)}`;
                case RedesignModuleContent.tag:
                    return html`${unsafeHTML(`<${RedesignModuleContent.tag}/>`)}`;
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
        } else {
            if (nextActiveContentId) {
                this._lastContentId = nextActiveContentId;
                this._activateByContentId(nextActiveContentId);
            } else {
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


        const closeModuleContainer = () => {
            closeToolContainer();
            this.tileMap(100 );
        }

        const changeWidth = (event) => {
            let sliderValue = parseFloat(event.target.value);
            let prozent = 100 - sliderValue;
            this.tileMap( prozent);
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

        const content = getContent(nextActiveContentId);
        if (content == null) {
            return nothing;
        }

        return html`
			<style>${css}</style>		
			<div class=" ${getOrientationClass()}  ${getMinWidthClass()}">
                                        ${getSlider()} 
			<div id ="module-container" class="module-container">
				<div class="module-container__content ${getOverlayClass()}">    
				<div class="module-container__tools-nav">                        
                        <button @click=${closeModuleContainer} class="module-container__close-button">
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
        let mapContainer = map.shadowRoot.querySelector('.map-container');
        mapContainer.style.width = leftPart;
        updateSize(prozent);
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
            console.warn('module-container not found')
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
