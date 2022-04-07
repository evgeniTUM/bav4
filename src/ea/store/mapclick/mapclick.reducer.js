import { createUniqueId } from '../../../utils/numberUtils';
export const MAPCLICK_EVENT = 'mapclick/coordinate/click';
export const MAPCLICK_ACTIVATE = 'mapclick/activate';
export const MAPCLICK_DEACTIVATE = 'mapclick/deactivate';

export const initialState = {

	/**
	 * @property {Coordinate|null}
	 */
	coordinate: null,
	/**
	 * @property {boolean}
	 */
	active: false
};

export const mapclickReducer = (state = initialState, action) => {

//	const createIdIfMissing = features => features.map(f => {
//		if (!f.id) {
//			f.id = createUniqueId();
//		}
//		return f;
//	});

	const { type, payload } = action;
	switch (type) {
		case MAPCLICK_ACTIVATE: {

			const active = !!state.active;

			return {
				...state,
				coordinate: null,
				active:true
			};
		}
		case MAPCLICK_DEACTIVATE: {

			return {
				...state,
				coordinate: null,
				active:false
			};
		}
		case MAPCLICK_EVENT: {

			const coordinate = state.coordinate;

			return {
				...state,
				coordinate: coordinate,
			};
		}
	}

	return state;
};
