import { OlLayerHandler } from '../OlLayerHandler';
import { $injector } from '../../../../../../injection';
import { observe } from '../../../../../../utils/storeUtils';
import { HIGHLIGHT_LAYER_ID } from '../../../../../../plugins/HighlightPlugin';
import Feature from 'ol/Feature';
import { highlightFeatureStyleFunction, highlightTemporaryFeatureStyleFunction } from './StyleUtils';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Point } from 'ol/geom';
import { nullStyleFunction } from '../highlight/StyleUtils';


/**
 * Handler for displaying highlighted features
 * @author thiloSchlemmer
 * @author taulinger
 */
export class OlHighlightLayerHandler extends OlLayerHandler {

	constructor() {
		super(HIGHLIGHT_LAYER_ID);
		const { StoreService } = $injector.inject('StoreService');
		this._storeService = StoreService;
		this._highlightLayer = null;
		this._feature = new Feature();
		this._temporaryFeature = new Feature();
		this._map = null;
		this._unregister = () => { };
	}


	/**
		 * Activates the Handler.
		 * @override
		 */
	onActivate(olMap) {
		this._highlightLayer = this._createLayer();
		this._map = olMap;
		this._unregister = this._register(this._storeService.getStore());
		return this._highlightLayer;
	}

	/**
		 *  @override
		 *  @param {Map} olMap
		 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		this._map = null;
		this._highlightLayer = null;
		this._unregister();
	}

	_createLayer() {
		const source = new VectorSource({ wrapX: false, features: [this._feature, this._temporaryFeature] });
		return new VectorLayer({
			source: source
		});
	}

	_register(store) {

		const onChange = (highlight) => {

			const { features, temporaryFeatures } = highlight;

			if (features.length) {
				const coord = features[0].data.coordinate;
				this._feature.setStyle(highlightFeatureStyleFunction);
				this._feature.setGeometry(new Point(coord));
			}
			else {
				this._feature.setStyle(nullStyleFunction);
			}
			if (temporaryFeatures.length) {
				const coord = temporaryFeatures[0].data.coordinate;
				this._temporaryFeature.setStyle(highlightTemporaryFeatureStyleFunction);
				this._temporaryFeature.setGeometry(new Point(coord));
			}
			else {
				this._temporaryFeature.setStyle(nullStyleFunction);
			}
		};

		return observe(store, state => state.highlight, onChange, false);
	}
}
