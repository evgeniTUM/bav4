/**
 * Action creators to change/update the properties concerning the zoom level and center of a map.
 * @module position/action
 */
import { $injector } from '../../injection';
import { EventLike } from '../../utils/storeUtils';
import { CENTER_CHANGED, FIT_REQUESTED, LIVE_ROTATION_CHANGED, ROTATION_CHANGED, UPDATE_SIZE, ZOOM_CENTER_CHANGED, ZOOM_CENTER_ROTATION_CHANGED, ZOOM_CHANGED } from './position.reducer';


/**
 * Request for fitting a map to a geographic extent
 * @typedef {Object} FitRequest
 * @property {Extent} extent geographic extent in map projection
 * @property {FitRequestOptions} options options for this FitRequest
 */

/**
 * Options for a FitRequest.
 * @typedef {Object} FitRequestOptions
 * @property {maxZoom} maxZoom max zoom level that is set even if extent would result in a higher zoom level
 */

/**
* A combination of zoom and center.
* @typedef {Object} ZoomCenter
* @property {number} zoom zoom level
* @property {Coordinate} coordinate coordinate in map projection
*/
/**
* A combination of zoom and center.
* @typedef {Object} ZoomCenterRotation
* @property {number} zoom zoom level
* @property {Coordinate} coordinate coordinate in map projection
* @property {number} rotation rotation in radians
*/

const getStore = () => {
	const { StoreService } = $injector.inject('StoreService');
	return StoreService.getStore();
};

/**
 * Changes zoom level and the position.
 * @param {ZoomCenter} zoomCenter zoom and center
 * @function
 */
export const changeZoomAndCenter = (zoomCenter) => {
	getStore().dispatch({
		type: ZOOM_CENTER_CHANGED,
		payload: zoomCenter
	});
};

/**
 * Changes zoom level, position and rotation
 * @param {ZoomCenterRotation} zoomCenterRotation zoom, center and rotation
 * @function
 */
export const changeZoomCenterAndRotation = (zoomCenterRotation) => {
	getStore().dispatch({
		type: ZOOM_CENTER_ROTATION_CHANGED,
		payload: zoomCenterRotation
	});
};

/**
 * Changes zoom level.
 * @param {number} zoom zoom level
 * @function
 */
export const changeZoom = (zoom) => {
	getStore().dispatch({
		type: ZOOM_CHANGED,
		payload: zoom

	});
};

/**
 * Changes the rotation value.
 * @param {number} rotation in radians
 * @function
 */
export const changeRotation = (rotation) => {
	getStore().dispatch({
		type: ROTATION_CHANGED,
		payload: rotation
	});
};

/**
 * Changes the live rotation value.
 * Typically called by a map component. State changes are consumed
 * by non-map components.
 * @param {number} liveRotation in radians
 */
export const changeLiveRotation = (liveRotation) => {
	getStore().dispatch({
		type: LIVE_ROTATION_CHANGED,
		payload: liveRotation
	});
};


/**
 * Increases zoom level by one.
 * @function
 */
export const increaseZoom = () => {

	const { position: { zoom } } = getStore().getState();
	getStore().dispatch({
		type: ZOOM_CHANGED,
		payload: zoom + 1

	});
};

/**
 * Decreases zoom level by one.
 * @function
 */
export const decreaseZoom = () => {

	const { position: { zoom } } = getStore().getState();
	getStore().dispatch({
		type: ZOOM_CHANGED,
		payload: zoom - 1

	});
};

/**
 * Changes the center.
 * @param {coordinate} center coordinate in map projection
 * @function
 */
export const changeCenter = (center) => {
	getStore().dispatch({
		type: CENTER_CHANGED,
		payload: center
	});
};

/**
 * Sets a fit request.
 * The fitRequest object is wrapper by an {@link EventLike} object.
 * @param {extent} extent extent for this fit request
 * @param {FitRequestOptions} options options for this fit request
 * @function
 */
export const setFit = (extent, options = {}) => {
	getStore().dispatch({
		type: FIT_REQUESTED,
		payload: new EventLike({ extent, options })
	});
};

/**
 * Sets an updateSize request.
 * @param {sliderValue} as parameter for payload is needed in order to trigger the event
 * @function
 */
export const updateSize = (sliderValue) => {
	getStore().dispatch({
		type: UPDATE_SIZE,
		payload: sliderValue
	});
};

