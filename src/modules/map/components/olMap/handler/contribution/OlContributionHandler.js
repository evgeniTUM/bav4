import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { $injector } from '../../../../../../injection';
import { observe } from '../../../../../../utils/storeUtils';
import { OlLayerHandler } from '../OlLayerHandler';
import { geolocationStyleFunction } from './styleUtils';



export const CONTRIBUTION_LAYER_ID = "contribution_layer_id";

export class OlContributionHandler extends OlLayerHandler {

	constructor() {
		super(CONTRIBUTION_LAYER_ID, { preventDefaultClickHandling: false, preventDefaultContextClickHandling: false });
		const { StoreService } = $injector.inject('StoreService');
		this._storeService = StoreService;
		this._positionFeature = new Feature();
		this._layer = null;
		this._map = null;
	}


	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {
		if (this._layer === null) {
			const source = new VectorSource({ wrapX: false, features: [this._positionFeature] });
			this._layer = new VectorLayer({
				source: source
			});
		}
		this._map = olMap;

		this._unregister = this._register(this._storeService.getStore());

		return this._layer;
	}

	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		this._layer = null;
		this._map = null;
		this._unregister();
	}

	_register(store) {
		const extract = (state) => {
			return state.contribute.position;
		};

		const onChange = (changedState) => {
			this._positionFeature.setStyle(geolocationStyleFunction);
			this._positionFeature.setGeometry(new Point(changedState));
			this._map.renderSync();
		};

		return observe(store, extract, onChange);
	}
}
