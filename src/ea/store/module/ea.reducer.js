export const SET_CURRENT_MODULE = 'ea/set_current';
export const ACTIVATE_GEORESOURCE = 'ea/georesource/activate';
export const DEACTIVATE_GEORESOURCE = 'ea/georesource/deactivate';
export const DEACTIVATE_ALL_GEORESOURCES = 'ea/georesource/deactivate_all';
export const DEACTIVATE_LEGEND = 'ea/legend/deactivate';
export const ACTIVATE_LEGEND = 'ea/legend/activate';
export const SET_LEGEND_ITEMS = 'ea/legend/set';
export const SET_PREVIEW_GEORESOURCE_ID = 'ea/legend/preview/add';
export const CLEAR_PREVIEW_GEORESOURCE_ID = 'ea/legend/preview/clear';
export const SET_MAP_RESOLUTION = 'ea/mapResolution/set';
export const DEACTIVATE_TRACKING = 'ea/tracking/deactivate';
export const ACTIVATE_TRACKING = 'ea/tracking/activate';


export const initialState = {

	/**
	 * @property {String|null}
	 */
	currentModule: null,

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
	mapResolution: 0.0,

	/**
	 * @property {boolean}
	 */
	trackingActive: false

};

export const eaReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case SET_CURRENT_MODULE: {

			return {
				...state,
				currentModule: payload
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
		case ACTIVATE_TRACKING: {
			return {
				...state,
				trackingActive: true
			};
		}
		case DEACTIVATE_TRACKING: {
			return {
				...state,
				trackingActive: false
			};
		}
	}

	return state;
};
