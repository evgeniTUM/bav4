import { $injector } from '../../injection';
import { observe } from '../../utils/storeUtils';
import { BaPlugin } from './../../plugins/BaPlugin';
import { addLayer, removeLayer } from '../../store/layers/layers.action';
import { addGeoFeatures, GeoFeatureTypes, removeGeoFeaturesById } from '../store/geofeature/geofeature.action';
import { TabId } from '../../store/mainMenu/mainMenu.action';
import { createUniqueId } from '../../utils/numberUtils';
import { VectorGeoResource, VectorSourceType } from '../../services/domain/geoResources';
import { GeoResourceService } from '../../services/GeoResourceService';


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

		const geoFeatureId = createUniqueId();

		const onChange = (active, state) => {

			if (active) {
				console.log('check draggable for Features');
				console.log(state);
				const label = 'Verwaltungseinheiten';
				addLayer(GEO_FEATURE_LAYER_ID, { label: label, constraints: { alwaysTop: true } });
			}
			else {
				removeLayer(GEO_FEATURE_LAYER_ID);
			}
		};

		const onFeatureShow = (features) => {
			console.log('show Features or make it draggable');
			console.log(features);

			//make dragable
		};

		const onTabChanged = (tab) => {
			if (tab !== TabId.EXTENSION) {
				console.log('hide Features');
				//removeHighlightFeaturesById(FEATURE_INFO_HIGHLIGHT_FEATURE_ID);
			}
		};

		observe(store, state => state.geofeature.active, onChange);
		observe(store, state => state.geofeature.features, onFeatureShow);
		//		observe(store, store => store.mainMenu.tab, onTabChanged, false);
	}
}
