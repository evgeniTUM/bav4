export const SET_CURRENT_MODULE = 'module/set_current';

export const initialState = {

	/**
	 * @property {String|null}
	 */
	current: null
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
	}

	return state;
};
