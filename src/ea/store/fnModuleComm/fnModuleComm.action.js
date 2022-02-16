/**
 * Action creators for communicate between module and frontend.
 * @module fnModuleCommComm/action
 */

import { OPEN_MODULE_REQUESTED,
CHANGE_MODULE_REQUESTED,
MODULE_RESET_REQUESTED,
GEOMETRY_ADDED_REQUESTED,
GEOMETRY_RGEOMETRY_REMOVED,
ZOOM_EXPAND_REQUESTED,
ZOOM_REQUESTED,
ADD_FEATURE_REQUESTED,
REMOVE_FEATURE_BY_ID_REQUESTED,
CLEAR_MAP_REQUESTED,
ADD_LAYER_REQUESTED,
REMOVE_LAYER_REQUESTED,
ZOOM_2_EXTENT_REQUESTED,
ZOOM_N_CENTER_TO_FEATURE_REQUESTED,
CLICK_IN_MAP_SIMULATION_REQUESTED,
ACTIVATE_MAPCLICK_REQUESTED,
CANCEL_MAPCLICK_REQUESTED } from './fnModuleComm.reducer';
import { EventLike } from '../../../utils/storeUtils';
import { $injector } from '../../../injection';


/**
 * Type of a {@link HighlightGeometry}
 * @enum
 */
export const HighlightGeometryTypes = Object.freeze({
	GEOJSON: 0,
	WKT: 1
});


/**
 * Contains information for active fnModuleComm.
 * @typedef {Object} FnModule
 * @property {FnModuleTypes} type  The type of this module.
 * @property {HightlightCoordinate|HightlightGeometry} data The data which can be a coordinate or a geometry
 * @property {string} [label] Optional text
 *
 */


const getStore = () => {
	const { StoreService: storeService } = $injector.inject('StoreService');
	return storeService.getStore();
};

/**
 * Sets the {@link FnModule}.
 * @param {FnModule} module
 * @export const 
 */
export const openFnModuleComm = (fnModuleSite, fnModuleDomain, fnModuleWindow,  ) => {
	console.log( 'openFnModule --> fnModuleSite: ');  console.log( 'fnModuleSite ' + fnModuleSite);
	console.log( 'fnModuleDomain ' + fnModuleDomain);
//	console.log('fnModuleWindow' + fnModuleWindow +  'fnModuleDomain' + fnModuleDomain );
	getStore().dispatch({
		type: OPEN_MODULE_REQUESTED,
		payload: { fnModuleSite: fnModuleSite, fnModuleWindow: fnModuleWindow, fnModuleDomain: fnModuleDomain}
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

export const  addGeometry= (geojson) => {
	getStore().dispatch({
		type: GEOMETRY_ADDED_REQUESTED,
		payload: geojson
	});
}
;

export const  removeGeometry= (geojson) => {
	getStore().dispatch({
		type: GEOMETRY_REMOVE_REQUESTED,
		payload: geojson
	});
}
;

export const  zoomExpandToVectorGroup = (group ) => {
	getStore().dispatch({
		type: ZOOM_EXPAND_REQUESTED,
		payload: group
	});
}
;
export const  zoomToLevel= ( group ) => {
	getStore().dispatch({
		type: ZOOM_REQUESTED,
		payload: group
	});
}
;

export const  addFeature= (feature) => {
	getStore().dispatch({
		type: ADD_FEATURE_REQUESTED,
		payload: feature
	});
}
;

export const  removeFeature= (feature) => {
	getStore().dispatch({
		type: REMOVE_FEATURE_REQUESTED,
		payload: feature
	});
//    sendMessageIntern("removefeature", feature);
}
;

export const  clearMap= (layerId) => {
	getStore().dispatch({
		type: CLEAR_MAP_REQUESTED,
		payload: layerId
	});
}
;

export const  addLayer= (layerId) => {
	getStore().dispatch({
		type: ADD_LAYER_REQUESTED,
		payload: layerId
	});
}
;

export const  clearLayer= (layerId) => {
	getStore().dispatch({
		type: REMOVE_LAYER_REQUESTED,
		payload: layerId
	});
}
;

export const  zoom2Extent= (extent) => {
	getStore().dispatch({
		type: ZOOM_2_EXTENT_REQUESTED,
		payload: extent
	});
}
;

export const  zoomAndCenter= (feature) => {
	getStore().dispatch({
		type: ZOOM_N_CENTER_TO_FEATURE_REQUESTED,
		payload: feature
	});

}
;

export const clickInMap= (geometry) => {
	getStore().dispatch({
		type: CLICK_IN_MAP_SIMULATION_REQUESTED,
		payload: geometry
	});
}
;
export const  activateObserverForMapClick= (id) => {
	getStore().dispatch({
		type: ACTIVATE_MAPCLICK_REQUESTED,
		payload: id
	});
}
;
//cancelation of waiting for mapclick
export const  cancelMapClickObserver = () => {
	getStore().dispatch({
		type: CANCEL_MAPCLICK_REQUESTED,
		payload: new EventLike()
	});
}

