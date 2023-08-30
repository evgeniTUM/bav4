import { $injector } from '../../../injection';
import { Analyse3DModuleContent } from '../../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../modules/toolbox/components/research/ResearchModuleContent';
import {
	ACTIVATE_GEORESOURCE,
	ACTIVATE_LEGEND,
	ACTIVATE_WEBANALYTICS,
	CLEAR_PREVIEW_GEORESOURCE_ID,
	DEACTIVATE_ALL_GEORESOURCES,
	DEACTIVATE_GEORESOURCE,
	DEACTIVATE_LEGEND,
	DEACTIVATE_WEBANALYTICS,
	SET_CURRENT_MODULE,
	SET_LEGEND_ITEMS,
	SET_MAP_RESOLUTION,
	SET_PREVIEW_GEORESOURCE_ID,
	ACTIVATE_INFO_POPUP,
	DEACTIVATE_INFO_POPUP,
	SET_CURSOR_STYLE
} from './ea.reducer';

/**
 * Available modules.
 * @enum
 */
export const EaModules = Object.freeze([
	MixerModuleContent,
	RedesignModuleContent,
	EnergyMarketModuleContent,
	EnergyReportingModuleContent,
	ResearchModuleContent,
	Analyse3DModuleContent,
	GeothermModuleContent
]);

/**
 * Mappings for query parameter "COMP".
 * @enum
 */
export const EaModulesQueryParameters = Object.freeze([
	{ name: MixerModuleContent.name, parameter: 'mischpult' },
	{ name: RedesignModuleContent.name, parameter: 'mischpult-redesign' },
	{ name: EnergyMarketModuleContent.name, parameter: 'boerse' },
	{ name: EnergyReportingModuleContent.name, parameter: 'melden' },
	{ name: ResearchModuleContent.name, parameter: 'recherche' },
	{ name: Analyse3DModuleContent.name, parameter: '3d-analyse' },
	{ name: Analyse3DModuleContent.name, parameter: 'windanalyse' },
	{ name: GeothermModuleContent.name, parameter: 'standort' }
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

/**
 * Sets the items for the legend.
 */
export const setLegendItems = (items) => {
	getStore().dispatch({
		type: SET_LEGEND_ITEMS,
		payload: items
	});
};

/**
 * Sets the map resolution.
 */
export const setMapResolution = (resolution) => {
	getStore().dispatch({
		type: SET_MAP_RESOLUTION,
		payload: resolution
	});
};

/**
 * Activates the web analytic.
 */
export const activateWebAnalytics = () => {
	getStore().dispatch({
		type: ACTIVATE_WEBANALYTICS,
		payload: null
	});
};

/**
 * Deactivates the web analytics.
 */
export const deactivateWebAnalytics = () => {
	getStore().dispatch({
		type: DEACTIVATE_WEBANALYTICS,
		payload: null
	});
};

/**
 * Activates the display of InfoPopup after starting the App.
 */
export const activateInfoPopup = (msgId) => {
	getStore().dispatch({
		type: ACTIVATE_INFO_POPUP,
		payload: msgId
	});
};

/**
 * Deactivates the showing InfoPopup next time.
 */
export const deactivateInfoPopup = (msgId) => {
	getStore().dispatch({
		type: DEACTIVATE_INFO_POPUP,
		payload: msgId
	});
};

/**
 * Sets the cursor style over the map.
 */
export const setMapCursorStyle = (style) => {
	getStore().dispatch({
		type: SET_CURSOR_STYLE,
		payload: style
	});
};
