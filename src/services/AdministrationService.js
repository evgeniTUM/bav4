/**
 * @module services/AdministrationService
 */
import { isOutOfBavaria, loadBvvAdministration } from './provider/administration.provider';
import { isCoordinate } from '../utils/checks';

/**
 *
 * @typedef {Object} Administration
 * @property {string} community The community at the delivered coordinate.
 * @property {string} district The district at the delivered coordinate.
 */

/**
 * @class
 */
export class AdministrationService {
	/**
	 *
	 * @param {administrationProvider} [administrationProvider=loadBvvAdministration]
	 */
	constructor(administrationProvider = loadBvvAdministration, isOutOfBavariaProvider = isOutOfBavaria) {
		this._administrationProvider = administrationProvider;
		this._isOutOfBavariaProvider = isOutOfBavariaProvider;
	}

	/**
	 *
	 * An async function that provides an object
	 * with community and district as string properties.
	 * @param {Coordinate} coordinate3857
	 * @returns {Administration} administration
	 */
	async getAdministration(coordinate3857) {
		if (!isCoordinate(coordinate3857)) {
			throw new TypeError("Parameter 'coordinate3857' must be a coordinate");
		}
		try {
			const administration = await this._administrationProvider(coordinate3857);
			return administration;
		} catch (e) {
			throw new Error('Could not load administration from provider', { cause: e });
		}
	}

	/**
	 *
	 * An async function that checks if coordinates are outside of bavaria.
	 * @param {Coordinate} coordinate3857
	 * @returns {boolean} is outside of bavaria
	 */
	async isOutsideOfBavaria(coordinate3857) {
		if (!isCoordinate(coordinate3857)) {
			throw new TypeError("Parameter 'coordinate3857' must be a coordinate");
		}
		try {
			return await this._isOutOfBavariaProvider(coordinate3857);
		} catch (e) {
			throw new Error('Could not load administration from provider', { cause: e });
		}
	}
}
