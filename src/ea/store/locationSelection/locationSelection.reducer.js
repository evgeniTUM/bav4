export const DESCRIPTION_CHANGED = 'ea/locationSelection/description';
export const SET_LOCATION = 'ea/locationSelection/set_location';
export const SET_STATE = 'ea/locationSelection/set_state';
export const TAGGING_MODE_CHANGED = 'ea/locationSelection/tagging_mode';
export const SET_TOOLTIP_TEXT = 'ea/locationSelection/tooltip/set';

export const initialState = {
	/**
	 * @type {Boolean}
	 */
	tagging: false,

	/**
	 * @type {String}
	 */
	description: null,

	/**
	 * @property {array<number>}
	 */
	position: null,

	/**
	 * @property {String}
	 */
	tooltipText: 'Standort markieren'
};

export const locationSelection = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case DESCRIPTION_CHANGED: {
			return {
				...state,
				description: payload
			};
		}
		case SET_LOCATION: {
			return {
				...state,
				position: payload
			};
		}
		case TAGGING_MODE_CHANGED: {
			return {
				...state,
				tagging: payload
			};
		}
		case SET_TOOLTIP_TEXT: {
			return {
				...state,
				tooltipText: payload
			};
		}
	}

	return state;
};
