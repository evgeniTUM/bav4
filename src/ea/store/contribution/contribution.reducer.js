export const DESCRIPTION_CHANGED = 'ea/contribution/description';
export const SET_LOCATION = 'ea/contribution/set_location';
export const SET_STATE = 'ea/contribution/set_state';
export const TAGGING_MODE_CHANGED = 'ea/contribution/tagging_mode';

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
	position: null
};

export const contributionReducer = (state = initialState, action) => {
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
	}

	return state;
};
