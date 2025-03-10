/**
 * Action creators to handle user contributions of new energy facilities
 * @module ea/contribution/action
 */
import { SET_LOCATION, TAGGING_MODE_CHANGED, SET_TOOLTIP_TEXT } from './locationSelection.reducer';
import { $injector } from '../../../injection';

const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
 * Set the location.
 * @function
 */
export const setLocation = (position) => {
	getStore().dispatch({
		type: SET_LOCATION,
		payload: position
	});
};

/**
 * Set the location.
 * @function
 */
export const setTaggingMode = (enabled) => {
	getStore().dispatch({
		type: TAGGING_MODE_CHANGED,
		payload: enabled
	});
};

/**
 * Set the text for the mouseover tooltip.
 */
export const setTooltipText = (enabled) => {
	getStore().dispatch({
		type: SET_TOOLTIP_TEXT,
		payload: enabled
	});
};
