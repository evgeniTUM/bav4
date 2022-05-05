import { $injector } from '../../../injection';
import { EAContribution } from '../../modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../../modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../../modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { SET_CURRENT_MODULE } from './module.reducer';

/**
 * Available modules.
 * @enum
 */
export const ModuleId = Object.freeze([
	MixerModuleContent.tag,
	ResearchModuleContent.tag,
	RedesignModuleContent.tag,
	EAContribution.tag
]);


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

