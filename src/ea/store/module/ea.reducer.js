export const SET_CURRENT_MODULE = 'module/set_current';
export const ACTIVATE_GEORESOURCE = 'module/georesource/activate';
export const DEACTIVATE_GEORESOURCE = 'module/georesource/deactivate';
export const DEACTIVATE_ALL_GEORESOURCES = 'module/georesource/deactivate_all';
export const DEACTIVATE_LEGEND = 'module/legend/deactivate';
export const ACTIVATE_LEGEND = 'module/legend/activate';
export const SET_LEGEND_ITEMS = 'module/legend/set';
export const SET_PREVIEW_GEORESOURCE_ID = 'module/legend/preview/add';
export const CLEAR_PREVIEW_GEORESOURCE_ID = 'module/legend/preview/clear';
export const SET_MAP_RESOLUTION = 'module/mapResolution/set';


export const initialState = {

	/**
	 * @property {String|null}
	 */
	current: null,

	/**
	 * @property {Array<string>}
	 */
	activeGeoResources: [],

	/**
	 * @property {boolean}
	 */
	legendActive: false,

	/**
	 * @property {String|null}
	 */
	legendGeoresourceId: null,

	/**
	 * @property {Array<LegendItem>}
	 */
	legendItems: [],

	/**
	 * @property {Double}
	 */
	mapResolution: 0.0

};

export const eaReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case SET_CURRENT_MODULE: {

			return {
				...state,
				current: payload
			};
		}
		case ACTIVATE_GEORESOURCE: {
			const ids = new Set(state.activeGeoResources);
			ids.add(payload);

			return {
				...state,
				activeGeoResources: Array.from(ids)
			};
		}
		case DEACTIVATE_GEORESOURCE: {
			const ids = new Set(state.activeGeoResources);
			ids.delete(payload);

			return {
				...state,
				activeGeoResources: Array.from(ids)
			};
		}
		case DEACTIVATE_ALL_GEORESOURCES: {
			return {
				...state,
				activeGeoResources: []
			};
		}
		case ACTIVATE_LEGEND: {
			return {
				...state,
				legendActive: true
			};
		}
		case DEACTIVATE_LEGEND: {
			return {
				...state,
				legendActive: false
			};
		}
		case SET_PREVIEW_GEORESOURCE_ID: {
			return {
				...state,
				legendGeoresourceId: payload
			};
		}
		case CLEAR_PREVIEW_GEORESOURCE_ID: {
			return {
				...state,
				legendGeoresourceId: null
			};
		}
		case SET_LEGEND_ITEMS: {
			return {
				...state,
				legendItems: payload
			};
		}
		case SET_MAP_RESOLUTION: {
			return {
				...state,
				mapResolution: payload
			};
		}
	}

	return state;
};
