import { createUniqueId } from '../../../utils/numberUtils';
export const FEATURE_ADD_LAYER = 'geofeature/feature/addLayer';
export const FEATURE_REMOVE_LAYER = 'geofeature/feature/removeLayer';
export const FEATURE_ADD = 'geofeature/feature/add';
export const CLEAR_FEATURES = 'geofeature/clear';
export const REMOVE_FEATURE_BY_ID = 'geofeature/remove/id';

export const initialState = {
	/**
	 * @property {integer|null}
	 */
	id: null,

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

	const createIdIfMissing = features => features.map(f => {
		if (!f.id) {
			f.id = createUniqueId();
		}
		return f;
	});

	const { type, payload } = action;
	switch (type) {
		case FEATURE_ADD_LAYER: {

			return {
				...state,
				id: payload.id,
				features: [],
				active:true
			};
		}
		case FEATURE_ADD: {

			const features = [...state.features, ...createIdIfMissing(payload)];

			return {
				...state,
				features: features,
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
			const active = !!features.length;

			return {
				...state,
				features: features,
				active: active
			};
		}
	}

	return state;
};
