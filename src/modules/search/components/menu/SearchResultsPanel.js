import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { LocationResultsPanel } from './types/location/LocationResultsPanel';
import { GeoResourceResultsPanel } from './types/geoResource/GeoResourceResultsPanel';
import { AbstractMvuContentPanel } from '../../../menu/components/mainMenu/content/AbstractMvuContentPanel';

/**
 * Container for different types of search result panels.
 * @class
 * @author taulinger
 * @author costa_gi
 */
export class SearchResultsPanel extends AbstractMvuContentPanel {
	/**
	 *
	 */
	createView() {
		return html`
			<div class="search-results-panel">${unsafeHTML(`<${LocationResultsPanel.tag}/>`)} ${unsafeHTML(`<${GeoResourceResultsPanel.tag}/>`)}</div>
		`;
	}

	static get tag() {
		return 'ba-search-results-panel';
	}
}
