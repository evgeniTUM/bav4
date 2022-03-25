import { html } from 'lit-html';
import { MvuElement } from '../../../../../modules/MvuElement';
import css from './mapContainer.css';

/**
 * Container for whole Map area with OlMap, Toolbox and mapButtons
 * @class
 * @author kun
 */

export class EaMapContainer extends MvuElement {


	/**
	 *@override
	 */
	createView() {
		return html`
		<style>${css}</style>
		<div class="map-container">
			<ea-ol-map></ea-ol-map>
			<ea-map-button-container></ea-map-button-container>
			<ea-tool-bar></ea-tool-bar>
		</div>
        `;
	}

	static get tag() {
		return 'ea-map-container';
	}
}
