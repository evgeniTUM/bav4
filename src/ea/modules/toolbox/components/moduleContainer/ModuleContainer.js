import { html, nothing } from 'lit-html';
import { BaElement } from '../../../../../modules/BaElement';
import { $injector } from '../../../../../injection';
import { MixerModuleContent } from '../mixerModuleContent/MixerModuleContent';
import { closeToolContainer } from '../../../../../store/toolContainer/toolContainer.action';
import { LevelTypes } from '../../../../../store/notifications/notifications.action';
import { emitNotification } from '../../../../../store/notifications/notifications.action';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { changeRotation, changeZoomAndCenter, setFit } from '../../../../../../src/store/position/position.action';

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

        const { EnvironmentService, TranslationService, MapService } = $injector.inject('EnvironmentService', 'TranslationService', 'MapService');
        this._environmentService = EnvironmentService;
        this._translationService = TranslationService;
	this._mapService = MapService;
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

        const {open, contentId, portrait, minWidth} = state;

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
        
            const tileMap = (width) => {

              let wGesamt = window.innerWidth;
              
              const container = this.shadowRoot.getElementById('module-container');
              
            let popup = window.getComputedStyle(container);

              let prozent = width / wGesamt * 100;
              // prozent = prozent < 10 ? 10 : prozent ;
              let leftPart = (100.0 - prozent).toString() + '%';
              let rightPart = prozent + '%';
              //              window.console.log('tileMap : body width ' + wGesamt + ' rightPart ' + rightPart + ' leftPart ' + leftPart);
              popup.css('width', rightPart);
              popup.css('left', leftPart);
              let map = document.querySelector("map");
              map.style.width = leftPart;
              
//	      setFit(extent, { maxZoom: CpResultItem._maxZoomLevel });
          
              setFit ( extent ) ;
            };
                

        const changeWidth = (event) => {
            let sliderValue = parseFloat(event.target.value);
            let newWidth = this.calcContainerWidth(sliderValue);
            const container = this.shadowRoot.getElementById('module-container');
            let style = window.getComputedStyle(container);
            container.style.width = 100 - sliderValue + 'vw';
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
			<div class=" ${getOrientationClass()}">
                                        ${getSlider()} 
			<div id ="module-container" class="module-container">
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
        const {toolContainer: {open, contentId}, media: {portrait, minWidth}} = globalState;
        return {open, contentId, portrait, minWidth};
    }
    
     onAfterRender(first) {
        super.onAfterRender(first);
        const element = this.shadowRoot.getElementById('module-container');
        if ( element !== null ) {
            let modulecontainerStyle = window.getComputedStyle(element);
            let bodyStyle = window.getComputedStyle(document.querySelector("body"));
            //Arbeiten mit em
            let bodyWidth = parseFloat(window.innerWidth) / parseFloat(bodyStyle.fontSize);
            let containerWidth = parseFloat(modulecontainerStyle.width) / parseFloat(modulecontainerStyle.fontSize);
             containerWidth = containerWidth + 0.3;
//             console.log( ' containerWidth ' + containerWidth + ' bodyWith ' + bodyWidth + ' bodyStyle.fontsize ' + bodyStyle.fontSize) ;
             //calcSliderValue
             let ratio = 100.0 * containerWidth / bodyWidth ;
             let factor = 100 - ratio; 
//           console.log('factor'); console.log(factor);
//           das nachträgliche setzen der width des containers ist ein Hack, da der ermittelte Factor sich nicht auf den Rand des Containers platziert.
//           hier müssten mal Experten befragt werden
             element.style.width = containerWidth + 'em';
            const sliderInput = this.shadowRoot.querySelector('.slider-container input');
             sliderInput.value = factor; 
        }
        else {
            console.log('module-container not yet created');
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
