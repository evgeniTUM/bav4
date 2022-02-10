/**
 * Action creators to handle user contributions of new energy facilities
 * @module ea/contribute/action
 */
import { FINISH_REQUESTED, DESCRIPTION_CHANGED, REMOVE_REQUESTED } from './contribute.reducer';
import { $injector } from '../../../injection';
import { EventLike } from '../../../utils/storeUtils';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};


/**
 * Set the finish request.
 * @function
 */
export const finish = () => {
	getStore().dispatch({
		type: FINISH_REQUESTED,
		payload: new EventLike('finish')
	});
};

/**
 * Set the description of a drawing.
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
 * Set the delete request.
 * @function
 */
export const remove = () => {
	getStore().dispatch({
		type: REMOVE_REQUESTED,
		payload: new EventLike('remove')
	});
};
