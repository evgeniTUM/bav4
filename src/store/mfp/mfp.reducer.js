export const ACTIVE_CHANGED = 'mfp/active';
export const SCALE_CHANGED = 'mfp/current/scale';
export const ID_CHANGED = 'mfp/current/id';
export const CURRENT_CHANGED = 'mfp/current';
export const SHOW_GRID_CHANGED = 'mfp/showGrid';
export const JOB_REQUEST_CHANGED = 'mfp/job/request';
export const JOB_SPEC_CHANGED = 'mfp/job/spec';
export const PRINT_LEGEND_CHANGED = 'mfp/printLegend';

export const initialState = {
	/**
	 * @property {boolean}
	 */
	active: false,
	/**
	 * @property {MfpConstraint}
	 */
	current: {
		id: null,
		scale: null,
		dpi: null
	},
	/**
	 * @property {boolean}
	 */
	showGrid: false,
	/**
	 *@property {EvenLike | null}
	 */
	jobRequest: null,
	/**
	 *@property {EvenLike | null}
	 */
	jobSpec: null,
	/**
	 * @property {boolean}
	 */
	printLegend: false
};

export const mfpReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTIVE_CHANGED: {
			return {
				...state,
				active: payload
			};
		}
		case SCALE_CHANGED: {
			const { current } = state;
			return {
				...state,
				current: { ...current, scale: payload }
			};
		}
		case ID_CHANGED: {
			const { current } = state;
			return {
				...state,
				current: { ...current, id: payload }
			};
		}
		case CURRENT_CHANGED: {
			return {
				...state,
				current: payload
			};
		}
		case SHOW_GRID_CHANGED: {
			return {
				...state,
				showGrid: payload
			};
		}
		case JOB_REQUEST_CHANGED: {
			return {
				...state,
				jobRequest: payload
			};
		}
		case JOB_SPEC_CHANGED: {
			return {
				...state,
				jobSpec: payload
			};
		}
		case PRINT_LEGEND_CHANGED: {
			return {
				...state,
				printLegend: payload
			};
		}
	}

	return state;
};
