/**
 * Action creators for communicate between module and frontend.
 * @module fnModuleCommComm/action
 */

import { OPEN_MODULE_REQUESTED,
	CHANGE_MODULE_REQUESTED,
	MODULE_RESET_REQUESTED } from './fnModuleComm.reducer';
import { EventLike } from '../../../utils/storeUtils';
import { $injector } from '../../../injection';


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
 * Sets the {@link FnModule}.
 * @param {FnModule} module
 * @export const
 */
export const openFnModuleComm = (module, domain, window) => {
	getStore().dispatch({
		type: OPEN_MODULE_REQUESTED,
		payload: { module, window, domain }
	});
};
/**
 * Removes the {@link FnModule}
 * @export const
 */
export const removeFnModule = () => {
	getStore().dispatch({
		type: CHANGE_MODULE_REQUESTED,
		payload: null
	});
};

/**
 * Removes active fnModuleComm  {@link FnModule}
 * @export const
 */
export const closeFnModules = () => {
	getStore().dispatch({
		type: MODULE_RESET_REQUESTED,
		payload: new EventLike()

	});
};
