export const OPEN_MODULE_REQUESTED = 'fnModuleComm/open';
export const CHANGE_MODULE_REQUESTED = 'fnModuleComm/change';
export const MODULE_RESET_REQUESTED = 'fnModuleComm/reset';


export const initialState = {

	/**
	 * @property {module|null}
	 */
	module: null,

	/**
	 * @property {domain|null}
	 */
	domain: null,

	active: false
};

export const fnModuleCommReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {

		case OPEN_MODULE_REQUESTED:
			return {
				...state,
				...payload,
				active: true
			};
		case MODULE_RESET_REQUESTED:
			return {
				...state,
				active: false
			};
		case CHANGE_MODULE_REQUESTED:
		{
			const active = !!payload;
			return { state, fnModuleComm: payload, active: active };
		}
	}

	return state;
};
