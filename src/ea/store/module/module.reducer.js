export const SET_CURRENT_MODULE = 'module/set_current';
export const ACTIVATE_GEORESOURCE = 'module/georesource/activate';
export const DEACTIVATE_GEORESOURCE = 'module/georesource/deactivate';
export const DEACTIVATE_ALL_GEORESOURCES = 'module/georesource/deactivate_all';
export const DEACTIVATE_LEGEND = 'module/legend/deactivate';
export const ACTIVATE_LEGEND = 'module/legend/activate';
export const ADD_LEGEND_GEORESOURCE_ID = 'module/legend/add';
export const REMOVE_LEGEND_GEORESOURCE_ID = 'module/legend/remove';
export const CLEAR_LEGEND_GEORESOURCE_ID = 'module/legend/clear';

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
	legendGeoresourceIds: []

};

export const moduleReducer = (state = initialState, action) => {

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
		case ADD_LEGEND_GEORESOURCE_ID: {
			return {
				...state,
				legendGeoresourceIds: [...state.legendGeoresourceIds, payload]
			};
		}
		case REMOVE_LEGEND_GEORESOURCE_ID: {
			return {
				...state,
				legendGeoresourceIds: state.legendGeoresourceIds.filter(id => id !== payload)
			};
		}
		case CLEAR_LEGEND_GEORESOURCE_ID: {
			return {
				...state,
				legendGeoresourceIds: []
			};
		}
	}

	return state;
};
