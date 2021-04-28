import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { BaElement } from '../../../BaElement';
import { LocationResultsPanel } from './types/location/LocationResultsPanel';
import { GeoResouceResultsPanel } from './types/geoResource/GeoResourceResultsPanel';
import css from './searchResultsPanel.css';

/**
 * Container for different types of search result panels.
 * @class
 * @author taulinger
 */
export class SearchResultsPanel extends BaElement {

	/**
     * 
     */
	createView() {
		return html`
        <style>${css}</style>
		<div class="search-results-panel">
		${unsafeHTML(`<${LocationResultsPanel.tag}/>`)}
		${unsafeHTML(`<${GeoResouceResultsPanel.tag}/>`)}
		</div>
        `;
	}

	static get tag() {
		return 'ba-search-results-panel';
	}
}