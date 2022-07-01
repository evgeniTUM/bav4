import { $injector } from '../../../injection';
import { Analyse3DModuleContent } from '../../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../modules/toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../modules/toolbox/components/research/ResearchModuleContent';
import { ACTIVATE_GEORESOURCE, ACTIVATE_LEGEND, CLEAR_PREVIEW_GEORESOURCE_ID, DEACTIVATE_ALL_GEORESOURCES, DEACTIVATE_GEORESOURCE, DEACTIVATE_LEGEND, SET_CURRENT_MODULE, SET_PREVIEW_GEORESOURCE_ID } from './module.reducer';

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
 */
export const deactivateAllGeoResources = () => {
	getStore().dispatch({
		type: DEACTIVATE_ALL_GEORESOURCES,
		payload: null
	});
};


/**
 * Activates the legend.
 */
export const activateLegend = () => {
	getStore().dispatch({
		type: ACTIVATE_LEGEND,
		payload: null
	});
};

/**
 * Deactivates the legend.
 */
export const deactivateLegend = () => {
	getStore().dispatch({
		type: DEACTIVATE_LEGEND,
		payload: null
	});
};

/**
 * Adds a georesource id to the legend.
 */
export const setPreviewGeoresourceId = (id) => {
	getStore().dispatch({
		type: SET_PREVIEW_GEORESOURCE_ID,
		payload: id
	});
};

/**
 * Clears the georesource ids for the legend.
 */
export const clearPreviewGeoresourceId = () => {
	getStore().dispatch({
		type: CLEAR_PREVIEW_GEORESOURCE_ID,
		payload: null
	});
};
