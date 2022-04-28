/**
 * Action creators for adding external feature vectors.
 * @module highlight/action
 */
import { CLEAR_FEATURES, ADD_FEATURE, REMOVE_FEATURE_BY_ID, ADD_LAYER, REMOVE_LAYER } from './geofeature.reducer';
import { $injector } from '../../../injection';


/**
 * Contains information for an GeoFeature for displaying in a map.
 * @typedef {Object} GeoFeature
 * @property {string} [id] Layer Id
 * @property {string} [label] Optional text
 */

/**
 * Coordinate data for a {@link GeoFeature}
 * @typedef {Object} HighlightCoordinate
 * @property {Coordinate} coordinate
 * @typedef {GeoJson} features
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


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
* Adds (appends) a single layer.
* @param {integer} id the id of the layer
* @function
*/
export const addGeoFeatureLayer = (id) => {
	getStore().dispatch({
		type: ADD_LAYER,
		payload: id
	});
};

/**
* Removes a single layer.
* @param {integer} id the id of the layer
* @function
*/
export const removeGeoFeatureLayer = (id) => {
	getStore().dispatch({
		type: REMOVE_LAYER,
		payload: id
	});
};

/**
* Adds (appends) a single or an array of {@link GeoFeature}.
* @param {Array.<GeoFeature>|GeoFeature} features
* @function
*/
export const addGeoFeatures = (geojsonFeatures) => {
	const featureAsArray = Array.isArray(geojsonFeatures) ? [...geojsonFeatures] : [geojsonFeatures];

	getStore().dispatch({
		type: ADD_FEATURE,
		payload: featureAsArray
	});
};

/**
 * Removes all {@link GeoFeature}s.
 * @function
 */
export const clearGeoFeatures = () => {
	getStore().dispatch({
		type: CLEAR_FEATURES,
		payload: null
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

