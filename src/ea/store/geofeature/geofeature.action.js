/**
 * Action creators for adding external feature vectors.
 * @module highlight/action
 */
import { EventLike } from '../../../utils/storeUtils';
import { CLEAR_FEATURES, FEATURE_ADD, REMOVE_FEATURE_BY_ID, FEATURE_ADD_LAYER } from './geofeature.reducer';
import { $injector } from '../../../injection';


/**
 * Contains information for highlighting a position or an area in a map.
 * @typedef {Object} GeoFeature
 * @property {GeoFeatureTypes} type  The type of this feature.
 * @property {HighlightCoordinate|HighlightGeometry} data The data which can be a coordinate or a geometry
 * @property {string} [id] Optional id. If not present, the reducer will create one.
 * @property {string} [label] Optional text
 */

/**
 * Coordinate data for a {@link GeoFeature}
 * @typedef {Object} HighlightCoordinate
 * @property {Coordinate} coordinate
 */

/**
 * Geometry data for a {@link GeoFeature}
 * @typedef {Object} HighlightGeometry
 * @property {object|string} geometry Geometry (e.g. geoJson, WKT)
 * @property {GeoFeatureGeometryTypes} geometryType the type of the geometry
 */

export const GeoFeatureTypes = Object.freeze({
	DEFAULT: 0,
	TEMPORARY: 1,
	ANIMATED: 2
});

/**
 * Type of a {@link HighlightGeometry}
 * @enum
 */
export const GeoFeatureGeometryTypes = Object.freeze({
	GEOJSON: 0,
	WKT: 1
});

const defaultProperties = { features: null, active:false};


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
* Adds (appends) a single or an array of {@link GeoFeature}.
* @param {Array.<GeoFeature>|GeoFeature} features
* @function
*/
export const addGeoFeatureLayer = (id, feature) => {
	const featureAsArray = Array.isArray(feature) ? [...feature] : [feature];
	getStore().dispatch({
		type: FEATURE_ADD_LAYER,
		payload: { id: id, features: featureAsArray }
	});
};
/**
* Adds (appends) a single or an array of {@link GeoFeature}.
* @param {Array.<GeoFeature>|GeoFeature} features
* @function
*/
export const addGeoFeatures = (geojsonFeatures)=> {
	const featureAsArray = Array.isArray(geojsonFeatures) ? [...geojsonFeatures] : [geojsonFeatures];
		
	getStore().dispatch({
		type: FEATURE_ADD,
		payload: featureAsArray
	});
};

/**
 * Removes all {@link GeoFeature}s.
 * @function
 */
export const clearGeoFeatures = () => {
	getStore().dispatch({
		type: CLEAR_FEATURES
	});
};

/**
 * Removes a (permanent or temporary) feature by its id.
 * If two or more feature have the same id, all of them are removed.
 * @param {Array.<String>|String} id GeoFeature id
 * @function
 */
export const removeGeoFeaturesById = (id) => {
	const idsAsArray = Array.isArray(id) ? [...id] : [id];
	getStore().dispatch({
		type: REMOVE_FEATURE_BY_ID,
		payload: idsAsArray
	});
};

