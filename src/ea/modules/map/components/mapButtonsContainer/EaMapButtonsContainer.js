import { html } from 'lit-html';
import { MapButtonsContainer }  from '../../../../../modules/map/components/mapButtonsContainer/MapButtonsContainer'

import css from './mapButtonsContainer.css';
import bacss from  '../../../../../modules/map/components/mapButtonsContainer/mapButtonsContainer.css';

const Update_IsOpen = 'update_isOpen';
const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';

/**
 * ea extended container for Map-Buttons
 * @class
 * @author kunze
 */

export class EaMapButtonsContainer extends MapButtonsContainer {


	constructor() {
		super({
			isOpen: false,
			isPortrait: false,
			hasMinWidth: false
		});
        }
        
        
	update(type, data, model) {
		switch (type) {
			case Update_IsOpen:
				return { ...model, isOpen: data };
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };
		}
	}

	onInitialize() {
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));
	}


	extendedCss() {
		return html`
		<style>
		${bacss}
		${css}
                
		</style>
		`;
	}
        

	createView(model) {
            
		const { isFetching, isPortrait, hasMinWidth, isOpen } = model;

		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return hasMinWidth ? 'is-desktop' : 'is-tablet';
		};

		return html`
            <style>${bacss}</style>
            <style>${css}</style>
            <div class="map-buttons-container ${getOrientationClass()} ${getMinWidthClass()}"> 
				<ba-rotation-button></ba-rotation-button>
				<ba-geolocation-button></ba-geolocation-button>
				<ba-zoom-buttons></ba-zoom-buttons>
				<ba-extent-button></ba-extent-button>              
            </div>			            
        `;
	}
        
//        //    Erweiterung des CSS Imports um EAB spezifische Style definitionen
//        defaultCss() {
//            return html`${this.extendedCss()} ${super.defaultCss()}`;
//	}

	static get tag() {
		return 'ea-map-button-container';
	}
}
