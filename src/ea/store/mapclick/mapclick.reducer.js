export const MAPCLICK_ACTIVATE = 'mapclick/activate';
export const MAPCLICK_DEACTIVATE = 'mapclick/deactivate';
export const MAPCLICK_REQUEST = 'mapclick/request';
export const SET_CURSOR_STYLE = 'mapclick/setCursorStyle';

export const initialState = {

	/**
	 * @property {String|null}
	 */
	listener_id: null,
	/**
	 * @property {Coordinate|null}
	 */
	coordinate: null,
	/**
	 * @property {boolean}
	 */
	active: false,
	/**
	 * The style of the cursor on the map.
	 * @property {string}
	 */
	mapCursorStyle: 'auto'
};

export const mapclickReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case MAPCLICK_ACTIVATE: {

			return {
				...state,
				listener_id: payload,
				active: true
			};
		}
		case MAPCLICK_DEACTIVATE: {

			return {
				...state,
				coordinate: null,
				active: false
			};
		}
		case MAPCLICK_REQUEST: {
			return {
				...state,
				coordinate: payload
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
