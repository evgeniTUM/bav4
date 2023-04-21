import { loadInfoPopup } from './provider/infoPopup.provider';
import { $injector } from '../../injection/';

/**
 * Service for managing {@link InfoPopupResult}s.
 *
 * @class
 * @author kun
 */
export class EaInfoPopupService {
	constructor(provider = loadInfoPopup) {
		this._provider = provider;
		this._infoPopupResult = null;
		const { EnvironmentService: environmentService } = $injector.inject('EnvironmentService');
		this._environmentService = environmentService;
	}

	/**
	 * Returns the corresponding  {@link InfoPopupResult} if present in the internal cache, otherwise retrieved from backend.
	 * @public
	 * @returns {InfoPopupResult | null }
	 * @throws Will throw an error if the provider result is wrong and pass it to the view.
	 */
	async loadInfoPopupResult() {
		if (!this._infoPopupResult) {
			try {
				this._infoPopupResult = await this._provider();
			} catch (e) {
				if (this._environmentService.isStandalone()) {
					console.warn('infoPopup could not be fetched from backend. Using fallback');
					this._infoPopupResult = this._infoPopupResult = this._newFallbackGeoResourceInfo();
				} else {
					throw new Error('Could not load infoPopupResult from provider: ' + e.message);
				}
			}
		}
		return this._infoPopupResult;
	}

	/**
	 * @private
	 */
	_newFallbackGeoResourceInfo() {
		if (this._infoPopupResult) {
			return this._infoPopupResult;
		}
	}
}

/**
 * @class
 * @author kun
 */
export class InfoPopupResult {
	/**
	 *
	 * @param {string} url of this InfoPopupResult
	 * @param {string} [title=null] optional title of this InfoPopupResult
	 */
	constructor(key = null, title, url) {
		this._key = key;
		this._title = title;
		this._url = url;
	}

	get key() {
		return this._key;
	}

	get url() {
		return this._url;
	}

	get title() {
		return this._title;
	}
}
