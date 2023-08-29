import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { OlMap } from '../../../../../modules/olMap/components/OlMap';
import { setMapResolution } from '../../../../store/module/ea.action';
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
		const { OlGeoFeatureLayerHandler: olGeoFeatureLayerHandler, OlSelectLocationHandler: OlSelectLocationHandler } = $injector.inject(
			'OlGeoFeatureLayerHandler',
			'OlSelectLocationHandler'
		);
		//
		this._layerHandler.set(olGeoFeatureLayerHandler.id, olGeoFeatureLayerHandler);
		this._layerHandler.set(OlSelectLocationHandler.id, OlSelectLocationHandler);

		this._cursorStyle = 'auto';
	}

	onInitialize() {
		super.onInitialize();
		this.observe(
			(state) => state.ea.mapCursorStyle,
			(style) => {
				this._cursorStyle = style;
				this.render();
			}
		);

		setMapResolution(this._view.getResolution());
		this._view.on('change:resolution', (evt) => {
			setMapResolution(evt.target.targetResolution_);
		});
	}

	extendedCss() {
		return html`
			<style>
				${css} #ol-map {
					cursor: ${this._cursorStyle};
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
