export const DESCRIPTION_CHANGED = 'ea/contribute/description';
export const FINISH_REQUESTED = 'ea/contribute/finish';
export const REMOVE_REQUESTED = 'ea/contribute/remove';


export const initialState = {
	/**
	 * @type {String}
	 */
	description: null,
	/**
	 * @type EventLike
	 */
	finish: null,
	/**
	 * @type EventLike
	 */
	remove: null
};

export const contributeReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case DESCRIPTION_CHANGED: {

			return {
				...state,
				description: payload

			};
		}
		case FINISH_REQUESTED: {

			return {
				...state,
				finish: payload

			};
		}
		case REMOVE_REQUESTED: {

			return {
				...state,
				remove: payload

			};
		}
	}

	return state;
};
