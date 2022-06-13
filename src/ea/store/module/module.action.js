import { $injector } from '../../../injection';
import { Analyse3DModuleContent } from '../../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../modules/toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../modules/toolbox/components/research/ResearchModuleContent';
import { ACTIVATE_GEORESOURCE, DEACTIVATE_ALL_GEORESOURCES, DEACTIVATE_GEORESOURCE, SET_CURRENT_MODULE } from './module.reducer';

/**
 * Available modules.
 * @enum
 */
export const ModuleId = Object.freeze([
	MixerModuleContent.tag,
	ResearchModuleContent.tag,
	RedesignModuleContent.tag,
	EAContribution.tag,
	Analyse3DModuleContent.tag,
	GeothermModuleContent.tag
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

/**
 * Activates a wms geo resource.
 * @param {String} id GeoResource id
 * @function
 */
export const activateGeoResource = (id) => {
	getStore().dispatch({
		type: ACTIVATE_GEORESOURCE,
		payload: id
	});
};

/**
 * Deactivates a wms geo resource.
 * @param {String} id GeoResource id
 * @function
 */
export const deactivateGeoResource = (id) => {
	getStore().dispatch({
		type: DEACTIVATE_GEORESOURCE,
		payload: id
	});
};

/**
 * Deactivates all wms geo resources.
 * @param {String} id GeoResource id
 * @function
 */
export const deactivateAllGeoResources = () => {
	getStore().dispatch({
		type: DEACTIVATE_ALL_GEORESOURCES,
		payload: null
	});
};

