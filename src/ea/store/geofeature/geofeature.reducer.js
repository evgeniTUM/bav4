export const ADD_LAYER = 'geofeature/feature/addLayer';
export const REMOVE_LAYER = 'geofeature/feature/removeLayer';
export const ADD_FEATURE = 'geofeature/feature/add';
export const CLEAR_LAYER = 'geofeature/clearLayer';
export const REMOVE_FEATURE = 'geofeature/remove/id';

export const initialState = {
	/**
	 * @property {Layer|null}
	 */
	layers: [],

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
				layers: [...state.layers, {
					id: payload,
					features: [] }
				],
				active: true
			};
		}
		case REMOVE_LAYER: {
			const layers = state.layers.filter(l => l.id !== payload);
			const active = !!layers.length;
			return {
				...state,
				layers,
				active
			};
		}
		case ADD_FEATURE: {
			const layers = state.layers.map(l => l.id === payload.layerId ?
				{ ...l, features: [...l.features, ...payload.features] } :
				l
			);

			return {
				...state,
				layers,
				active: true
			};
		}
		case REMOVE_FEATURE: {
			const layers = state.layers.map(l => l.id === payload.layerId ?
				{ ...l, features: l.features.filter(f => !payload.ids.includes(f.id)) } :
				l
			);

			return {
				...state,
				layers
			};
		}
		case CLEAR_LAYER: {
			const layers = state.layers.map(l => l.id === payload ?
				{ ...l, features: [] } :
				l);

			return {
				...state,
				layers,
				active: false
			};
		}
	}

	return state;
};
