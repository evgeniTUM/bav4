import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { OlMap }  from '../../../../../modules/map/components/olMap/OlMap';
import css from './olMap.css';
import { OlGeoFeatureLayerHandler } from '../olMap/handler/geofeature/OlGeoFeatureLayerHandler';

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
			OlGeoFeatureLayerHandler: olGeoFeatureLayerHandler
		} = $injector.inject('OlGeoFeatureLayerHandler');
//
		this._layerHandler.set(olGeoFeatureLayerHandler.id, olGeoFeatureLayerHandler);

	}

	/**
	 * @override
	 * observeModel('updateSize' .. ) is no longer needed if this behavior is implemented 
	 *  in the parent class
	 */
	onInitialize() {
		super.onInitialize();
		this.observeModel('updateSize', () => {
			this._viewSyncBlocked = true;
			this._map.updateSize();
			this._viewSyncBlocked = false;
		});
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
