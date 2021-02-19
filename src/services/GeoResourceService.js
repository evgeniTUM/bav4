
/**
 * An async function that that provice an array of
 * {@link GeoResource}s.
 *
 * @async
 * @typedef {function():(Array<geoResource>)} georesourceProvider
 */


/**
 * Service for managing {@link GeoResource}s.
 * 
 * @class
 * @author aul
 */
export class GeoResourceService {

	/**
	 * 
	 * @param {georesourceProvider} provider 
	 */
	constructor(provider) {
		this._provider = provider;
		this._georesources = null;
	}

	/**
	 * Initializes this service, which means all available GeoResources are loaded and can be served in the future from the internal cache.
	 * @public
	 * @async
	 * @returns {Promise<Array.<GeoResource>> | Promise.reject}
	 */
	async init() {
		if (!this._georesources) {
			try {
				this._georesources = await this._provider();
				return this._georesources;
			}
			catch (e) {
				return Promise.reject('GeoResourceService could not be initialized: ' + e.message);
			}
		}
		return this._georesources;
	}


	/**
	 * Returns all available {@link GeoResource}.
	 * @public
	 * @returns  {Array.<GeoResource>}
	 */
	all() {
		if (!this._georesources) {
			console.warn('GeoResourceService not yet initialized');
			return [];
		}
		return this._georesources;
	}

	/**
	 * Returns the corresponding  {@link GeoResource} for an id.
	 * @public
	 * @param {string} id Id of the desired {@link GeoResource}
	 * @returns {GeoResource | null}
	 */
	byId(id) {
		if (!this._georesources) {
			console.warn('GeoResourceService not yet initialized');
			return null;
		}
		const geoResource = this._georesources.find(georesource => georesource.id === id);
		return geoResource || null;
	}

	/**
	 * Adds a GeoResoure to the internal cache.
	 * @param {GeoResource} georesource 
	 * @returns {boolean} true, when succesfully added
	 */
	add(georesource) {
		if (!this._georesources.find(_georesource => _georesource.id === georesource.id)) {
			this._georesources.push(georesource);
			return true;
		}
		return false;
	}
}
