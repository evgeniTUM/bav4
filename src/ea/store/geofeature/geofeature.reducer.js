export const ADD_LAYER = 'geofeature/feature/addLayer';
export const REMOVE_LAYER = 'geofeature/feature/removeLayer';
export const ADD_FEATURE = 'geofeature/feature/add';
export const CLEAR_FEATURES = 'geofeature/clear';
export const REMOVE_FEATURE_BY_ID = 'geofeature/remove/id';

export const initialState = {
	/**
	 * @property {Layer|null}
	 */
	layers: [],

	/**
	 * @property {GeoFeature|null}
	 */
	features: [],
	/**
	 * @property {boolean}
	 */
	active: false
};

export const geofeatureReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case ADD_LAYER: {
			return {
				...state,
				layers: [...state.layers, { id: payload }],
				active: true
			};
		}
		case REMOVE_LAYER: {
			const layers = state.layers.filter(l => l.id !== payload);
			console.log(layers);
			const active = !!layers.length;
			return {
				...state,
				layers: layers,
				active: active
			};
		}
		case ADD_FEATURE: {
			return {
				...state,
				features: [...state.features, ...payload],
				active: true
			};
		}
		case CLEAR_FEATURES: {
			return {
				...state,
				features: [],
				active: false
			};
		}
		case REMOVE_FEATURE_BY_ID: {
			const features = state.features.filter(f => !payload.includes(f.id));

			return {
				...state,
				features: features
			};
		}
	}

	return state;
};
