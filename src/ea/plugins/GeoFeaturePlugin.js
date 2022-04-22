import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { observe } from '../../utils/storeUtils';
import { BaPlugin } from './../../plugins/BaPlugin';


/**
 * Id of the layer used for any geofeature visualization. Mainly used for independent GeoJson-VectorSources
 */
export const GEO_FEATURE_LAYER_ID = 'geofeature_layer';

/**
 *ID for verwaltungsebene related style features
 */
export const VERWALTUNGS_EBENE_ID = 'verwaltungsEbeneId';
/**
 * @class
 * @author kun
 */
export class GeoFeaturePlugin extends BaPlugin {

	constructor() {
		super();
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {


		const onChange = (active) => {

			if (active) {
				const label = 'Verwaltungseinheiten';
				addLayer(GEO_FEATURE_LAYER_ID, { label: label, constraints: { hidden: true, alwaysTop: true } });
			}
			else {
				removeLayer(GEO_FEATURE_LAYER_ID);
			}
		};

		const onFeatureShow = () => {

			//make dragable
		};

		observe(store, state => state.geofeature.active, onChange);
		observe(store, state => state.geofeature.features, onFeatureShow);
	}
}
