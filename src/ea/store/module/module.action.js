/**
 * Action creators for adding external feature vectors.
 * @module highlight/action
 */
import { $injector } from '../../../injection';
import { SET_CURRENT_MODULE } from './module.reducer';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
* Sets the tag of the currently active module.
* @param {initeger} features
* @function
*/
export const setCurrentModule = (id) => {
	getStore().dispatch({
		type: SET_CURRENT_MODULE,
		payload: id
	});
};

