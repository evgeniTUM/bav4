/**
 * Action creators for adding external feature vectors.
 * @module highlight/action
 */
import { EventLike } from '../../../utils/storeUtils';
import { MAPCLICK_EVENT, MAPCLICK_ACTIVATE, MAPCLICK_DEACTIVATE } from './mapclick.reducer';
import { $injector } from '../../../injection';


/**
 * Contains coordinate for clickEvent within the map.
 * @typedef {Object} GeoFeature
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


const defaultProperties = { coordinate: null, active:false};


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
* Activate map for click events to get geo coordinate of the position {@link Coordinate}.
* @param {Array.<GeoFeature>|GeoFeature} features
* @function
*/
export const activateMapClick = () => {
	getStore().dispatch({
		type: MAPCLICK_ACTIVATE,
		activate: true
	});
};


export const deactivateMapClick = () => {
	getStore().dispatch({
		type: MAPCLICK_DEACTIVATE,
		activate: false
	});
};
