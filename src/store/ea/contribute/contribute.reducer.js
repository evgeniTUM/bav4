export const DESCRIPTION_CHANGED = 'ea/contribute/description';
export const SET_LOCATION = 'ea/contribute/set_location';
export const SET_STATE = 'ea/contribute/set_state';
export const TAGGING_MODE_CHANGED = 'ea/contribute/tagging_mode';


export const initialState = {
	/** 
	 * @type {Boolean}
	 */
	active: false,

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

export const contributeReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case SET_STATE: {
			return {
				...state,
				active: payload
			}
		}
		case DESCRIPTION_CHANGED: {

			return {
				...state,
				description: payload
			};
		}
		case SET_LOCATION: {

			return {
				...state,
				position: payload,
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
