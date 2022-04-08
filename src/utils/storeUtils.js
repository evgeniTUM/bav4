import { createUniqueId } from './numberUtils';

/**
 * Registers an observer for state changes of the store.
 * @function
 * @param {object} store The redux store
 * @param {function(state)} extract A function that extract a portion (single value or a object) from the current state which will be observed for comparison
 * @param {function(observedPartOfState, state)} onChange A function that will be called when the observed state has changed
 * @param {boolean|true} ignoreInitialState A boolean which indicate, if the callback should be initially called with the current state immediately after the observer has been registered
 * @returns  A function that unsubscribes the observer
 */
export const observe = (store, extract, onChange, ignoreInitialState = true) => {
	const initialFlag = Object.freeze({});
	let currentState = initialFlag;

	const handleChange = () => {
		const nextState = extract(store.getState());
		if (!equals(nextState, currentState)) {
			const callCallback = (currentState !== initialFlag || !ignoreInitialState);
			currentState = nextState;
			if (callCallback) {
				onChange(currentState, store.getState());
			}
		}
	};

	const unsubscribe = store.subscribe(handleChange);
	handleChange();
	return unsubscribe;
};

/**
 * Returns the result of a comparision between two values. If both values are objects,
 * a deep comparision is done, otherwise a shallow one.
 * @function
 * @param {object|string|number} value0
 * @param {object|string|number} value1
 * @returns {boolean} true if both values are equal
 */
export const equals = (value0, value1) => {
	if (value0 === value1) {
		return true;
	}

	if (
		typeof value0 !== 'object' ||
		typeof value1 !== 'object' ||
		value0 == null ||
		value1 == null
	) {
		return false;
	}

	if (
		(Array.isArray(value0) && !Array.isArray(value1)) ||
		(!Array.isArray(value0) && Array.isArray(value1))
	) {
		return false;
	}

	const keys0 = Object.keys(value0);
	const keys1 = Object.keys(value1);

	if (keys0.length !== keys1.length) {
		return false;
	}

	return keys0.every((key) => {
		if (!keys1.includes(key)) {
			return false;
		}

		if (
			typeof value0[key] === 'function' ||
			typeof value1[key] === 'function'
		) {
			if (value0[key].toString() !== value1[key].toString()) {
				return false;
			}
		}

		if (!equals(value0[key], value1[key])) {
			return false;
		}
		return true;
	});
};

/**
 * Wrapper for payloads of actions which dispatch event-like changes of state.
 */
export class EventLike {

	constructor(payload) {
		this._payload = payload;
		this._id = createUniqueId();
	}

	get payload() {
		return this._payload;
	}

	get id() {
		return this._id;
	}
}
