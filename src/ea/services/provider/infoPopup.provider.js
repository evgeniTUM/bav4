import { $injector } from '../../../injection';
import { InfoPopupResult } from '../EaInfoPopupService';

/**
 * Uses the EAB endpoint to load GeoResourceInfoResult for DetailInfo.
 * @function
 * @returns {Promise<GeoResourceInfoResult>}
 */
export const loadInfoPopup = async () => {
	const { HttpService: httpService,
		ConfigService: configService } = $injector.inject('HttpService', 'ConfigService');

	const loadInternal = async () => {
		const url = `${configService.getValueAsPath('BACKEND_URL')}infoiframe`;
		return httpService.get(url);
	};

	const result = await loadInternal();
	switch (result.status) {
		case 200: {
			if (result.ok) {
				const payload = await result.json();
				const title = payload.title;
				const key = payload.key;
				const info_url = payload.url;
				return new InfoPopupResult(key, title, info_url);
			}
			break;
		}
		case 204: {
			return null;
		}
	}
	throw new Error('an InfoPop seems not to be configured');
};
