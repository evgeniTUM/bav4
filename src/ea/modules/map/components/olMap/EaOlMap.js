import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { OlMap } from '../../../../../modules/map/components/olMap/OlMap';
import css from './olMap.css';

/**
 * Element which extendedrenders the ol map.
 * @class
 * @author kunze
 */
export class EaOlMap extends OlMap {

	constructor() {
		super({
			zoom: null,
			center: null,
			rotation: null,
			fitRequest: null,
			layers: []
		});
		const {
			OlGeoFeatureLayerHandler: olGeoFeatureLayerHandler,
			OlContributionHandler: olContributionHandler
		} = $injector.inject('OlGeoFeatureLayerHandler', 'OlContributionHandler');
		//
		this._layerHandler.set(olGeoFeatureLayerHandler.id, olGeoFeatureLayerHandler);
		this._layerHandler.set(olContributionHandler.id, olContributionHandler);

	}

	extendedCss() {
		return html`
		<style>
		${css}
		</style>
		`;
	}

	//    Erweiterung des CSS Imports um EAB spezifische Style definitionen
	defaultCss() {
		return html`${this.extendedCss()} ${super.defaultCss()}`;
	}

	/**
	 * @override
	 */
	static get tag() {
		return 'ea-ol-map';
	}
}
