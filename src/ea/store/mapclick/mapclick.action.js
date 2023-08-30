/**
 * Action creators for adding external feature vectors.
 * @module highlight/action
 */
import { $injector } from '../../../injection';
import { EventLike } from '../../../utils/storeUtils';
import { MAPCLICK_ACTIVATE, MAPCLICK_DEACTIVATE, MAPCLICK_REQUEST } from './mapclick.reducer';

/**
 * Contains value for activation litening at map click
 * @typedef {boolean} active
 * @property {active}
 */

/**
 * Contains coordinate for clickEvent within the map.
 * @typedef {Object} Coordinate
 * @property {Coordinate}
 */

const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
 * Activate map for click events to get geo coordinate of the position {@link Coordinate}.
 * @param {Array.<GeoFeature>|GeoFeature} features
 * @function
 */
export const activateMapClick = (id) => {
	getStore().dispatch({
		type: MAPCLICK_ACTIVATE,
		payload: id
	});
};

export const deactivateMapClick = () => {
	getStore().dispatch({
		type: MAPCLICK_DEACTIVATE,
		payload: null
	});
};

export const requestMapClick = (coordinate) => {
	getStore().dispatch({
		type: MAPCLICK_REQUEST,
		payload: new EventLike(coordinate)
	});
};
