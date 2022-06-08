export const SET_CURRENT_MODULE = 'module/set_current';
export const ACTIVATE_GEORESOURCE = 'module/georesource/activate';
export const DEACTIVATE_GEORESOURCE = 'module/georesource/deactivate';
export const DEACTIVATE_ALL_GEORESOURCES = 'module/georesource/deactivate_all';

export const initialState = {

	/**
	 * @property {String|null}
	 */
	current: null,

	/**
	 * @property {Array<string>}
	 */
	activeGeoResources: []
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
	}

	return state;
};
