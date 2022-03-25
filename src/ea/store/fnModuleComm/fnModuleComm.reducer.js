export const OPEN_MODULE_REQUESTED = 'fnModuleComm/open';
export const CHANGE_MODULE_REQUESTED = 'fnModuleComm/change';
export const MODULE_RESET_REQUESTED = 'fnModuleComm/reset';
export const GEOMETRY_ADDED_REQUESTED = 'fnModuleComm/geometry/add';
export const GEOMETRY_REMOVE_REQUESTED = 'fnModuleComm/geometry/remove';
export const ADD_FEATURE_REQUESTED = 'fnModuleComm/feature/add';
export const REMOVE_FEATURE_BY_ID_REQUESTED = 'fnModuleComm/feature/remove/id';
export const CLEAR_MAP_REQUESTED = 'fnModuleComm/map/clear';
export const ADD_LAYER_REQUESTED = 'fnModuleComm/layer/add';
export const REMOVE_LAYER_REQUESTED = 'fnModuleComm/layer/remove';
export const CLEAR_LAYER_REQUESTED = 'fnModuleComm/layer/clear';
export const ZOOM_REQUESTED = 'fnModuleComm/zoom';
export const ZOOM_2_EXTENT_REQUESTED = 'fnModuleComm/zoomTo/extent';
export const ZOOM_N_CENTER_TO_FEATURE_REQUESTED = 'fnModuleComm/zoomTo/center';
export const ZOOM_EXPAND_REQUESTED = 'fnModuleComm/zoomTo/expand';
export const CLICK_IN_MAP_SIMULATION_REQUESTED = 'fnModuleComm/change';
export const ACTIVATE_MAPCLICK_REQUESTED = 'fnModuleComm/mapclick/activate';
export const CANCEL_MAPCLICK_REQUESTED = 'fnModuleComm/mapclick/cancel';



export const initialState = {

	/**
	 * @property {HighlightFeature|null}
	 */
	features: [],
	/**
	 * @property {Some layers|null}
	 */
	layers: [],

	/**
	 * @property {FnModule|null}
	 */
	fnModuleSite: null,
	
	/**
	 * @property {FnModuleWindow|null}
	 */
	fnModuleWindow: null,

	/**
	 * @property {FnModuleDomain|null}
	 */
	fnModuleDomain: null,

	active: false
};

const openModule = (state, payload) => {
	const {fnModuleSite, fnModuleWindow, fnModuleDomain } = payload;
	console.log( 'openModule --> reducer: ');  console.log( 'fnModuleSite ' + fnModuleSite);
			return {
			...state,
			fnModuleSite,
			fnModuleWindow,
			fnModuleDomain,
			active: true
		};

}
const closeModule = (state, payload) => {
//	const {fnModuleSite, fnModuleWindow, fnModuleDomain } = payload;
	
			return {
			...state,
//			fnModuleSite,
//			fnModuleWindow,
//			fnModuleDomain,
			active: false
		};

}

export const fnModuleCommReducer = (state = initialState, action) => {
	
	const createIdIfMissing = features => features.map(f => {
		if (!f.id) {
			f.id = createUniqueId();
		}
		return f;
	});


	const {type, payload} = action;
	switch (type) {

		case OPEN_MODULE_REQUESTED:
		{
			return openModule(state, payload);
		}
		case MODULE_RESET_REQUESTED:
		{
			return closeModule(state, payload);
		}
		case CHANGE_MODULE_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case GEOMETRY_ADDED_REQUESTED:
		{
			const geometry = [...state.geometry, ...createIdIfMissing(payload)];
			const active = !!features.length;
			return {
				...state,
				geometry: geometry,
				active: active
			};
		}
		case GEOMETRY_REMOVE_REQUESTED:
		{
			const geometry = [...state.geometry, ...createIdIfMissing(payload)];
			const active = !!geometry.length;
			return {
				...state,
				geometry: geometry,
				active: active
			};
		}
		case ADD_FEATURE_REQUESTED:
		{
			const features = [...state.features, ...createIdIfMissing(payload)];
			const active = !!features.length;
			return {state, fnModuleComm: payload, active: active};
		}
		case REMOVE_FEATURE_BY_ID_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case CLEAR_MAP_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ADD_LAYER_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case REMOVE_LAYER_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case CLEAR_LAYER_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ZOOM_EXPAND_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ZOOM_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ZOOM_2_EXTENT_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ZOOM_N_CENTER_TO_FEATURE_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case CLICK_IN_MAP_SIMULATION_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case ACTIVATE_MAPCLICK_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}
		case CANCEL_MAPCLICK_REQUESTED:
		{
			const active = !!payload;
			return {state, fnModuleComm: payload, active: active};
		}

		case CHANGE_MODULE_REQUESTED:
		{

			const active = !!payload;

			return {
				state,
				fnModuleComm: payload,
				active: active
			};
		}
	}

	return state;
};
