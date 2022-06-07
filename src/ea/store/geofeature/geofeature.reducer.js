export const ADD_LAYER = 'geofeature/feature/addLayer';
export const REMOVE_LAYER = 'geofeature/feature/removeLayer';
export const ADD_FEATURE = 'geofeature/feature/add';
export const CLEAR_LAYER = 'geofeature/clearLayer';
export const REMOVE_FEATURE = 'geofeature/remove/id';
export const ACTIVATE_GEORESOURCE = 'geofeature/georesource/activate';
export const CLEAR_MAP = 'geofeature/clearMap';

export const initialState = {
	/**
	 * @property {Array<Layer>}
	 */
	layers: [],

	/**
	 * @property {boolean}
	 */
	active: false,
	/**
	 * @property {Array<string>}
	 */
	activeGeoresources: []

};

export const geofeatureReducer = (state = initialState, action) => {

	const { type, payload } = action;
	switch (type) {
		case ADD_LAYER: {
			return {
				...state,
				layers: [...state.layers, {
					draggable: false,
					...payload,
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
		case CLEAR_MAP: {
			return initialState;
		}
		case ACTIVATE_GEORESOURCE: {
			return {
				...state,
				activeGeoresources: [...state.activeGeoresources, payload]
			};
		}
	}

	return state;
};
