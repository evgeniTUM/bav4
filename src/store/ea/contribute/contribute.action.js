/**
 * Action creators to handle user contributions of new energy facilities
 * @module ea/contribute/action
 */
import { SET_LOCATION, DESCRIPTION_CHANGED, TAGGING_MODE_CHANGED } from './contribute.reducer';
import { $injector } from '../../../injection';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};



/**
 * Set the description 
 * @function
 * @param {string} description the description of a drawing
 */
export const setDescription = (description) => {
	getStore().dispatch({
		type: DESCRIPTION_CHANGED,
		payload: description
	});
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