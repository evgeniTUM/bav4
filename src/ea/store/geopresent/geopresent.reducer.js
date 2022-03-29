

export const IMPORT_ADDED = 'geopresent/added';

export const initialState = {

	/**
	 * @property {EventLike<ImportProperties>|null}
	 */
	features: null
};

export const geopresentReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case IMPORT_ADDED: {
			return {
				...state,
				features: payload
			};
		}
	}

	return state;
};
