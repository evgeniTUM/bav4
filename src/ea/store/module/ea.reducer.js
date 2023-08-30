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
export const DEACTIVATE_WEBANALYTICS = 'ea/webanalytics/deactivate';
export const ACTIVATE_WEBANALYTICS = 'ea/webanalytics/activate';
export const DEACTIVATE_INFO_POPUP = 'ea/infopopup/deactivate';
export const ACTIVATE_INFO_POPUP = 'ea/info_popup/activate';
export const SET_CURSOR_STYLE = 'ea/map_cursor_style/set';

export const initialState = {
	/**
	 * Name of the currently active module.
	 * @property {String|null}
	 */
	currentModule: null,

	/**
	 * The currently activated and managed layers from the active module.
	 * @property {Array<string>}
	 */
	activeGeoResources: [],

	/**
	 * If true the legend is being displayed.
	 * @property {boolean}
	 */
	legendActive: false,

	/**
	 * The georesource id of the layer to preview inside the legend (e.g. mouse over a layer).
	 * @property {String|null}
	 */
	legendGeoresourceId: null,

	/**
	 * The legend items to display.
	 * @property {Array<LegendItem>}
	 */
	legendItems: [],

	/**
	 * The current map resolution.
	 * @property {Double}
	 */
	mapResolution: 0.0,

	/**
	 * If true web analytics is active.
	 * @property {boolean}
	 */
	webAnalyticsActive: false,

	/**
	 * If true the info popup will be displayer on load.
	 * @property {boolean}
	 */
	infoPopupActive: false,

	/**
	 * The id of the info popup to display.
	 * @property {String|null}
	 */
	infoPopupId: null,

	/**
	 * The style of the cursor on the map.
	 * @property {string}
	 */
	mapCursorStyle: 'auto'
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
		case ACTIVATE_WEBANALYTICS: {
			return {
				...state,
				webAnalyticsActive: true
			};
		}
		case DEACTIVATE_WEBANALYTICS: {
			return {
				...state,
				webAnalyticsActive: false
			};
		}
		case ACTIVATE_INFO_POPUP: {
			return {
				...state,
				infoPopupId: payload,
				infoPopupActive: false
			};
		}
		case DEACTIVATE_INFO_POPUP: {
			return {
				...state,
				infoPopupId: payload,
				infoPopupActive: true
			};
		}
		case SET_CURSOR_STYLE: {
			return {
				...state,
				mapCursorStyle: payload
			};
		}
	}

	return state;
};
