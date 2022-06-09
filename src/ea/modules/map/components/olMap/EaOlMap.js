import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { OlMap } from '../../../../../modules/olMap/components/OlMap';
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
			OlContributionHandler: olContributionHandler,
			OlWmsActionsLayerHandler: olWmsActionsLayerHandler
		} = $injector.inject('OlGeoFeatureLayerHandler', 'OlContributionHandler', 'OlWmsActionsLayerHandler');
		//
		this._layerHandler.set(olGeoFeatureLayerHandler.id, olGeoFeatureLayerHandler);
		this._layerHandler.set(olContributionHandler.id, olContributionHandler);
		this._layerHandler.set(olWmsActionsLayerHandler.id, olWmsActionsLayerHandler);

		this._cursorStyle = 'auto';
	}


	onInitialize() {
		super.onInitialize();
		this.observe(state => state.mapclick.mapCursorStyle, (style) => {
			this._cursorStyle = style;
			this.render();
		});
	}

	extendedCss() {
		return html`
		<style>
		${css}

		#ol-map {
			cursor: ${this._cursorStyle}
		}
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
