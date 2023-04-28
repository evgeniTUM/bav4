import { $injector } from '../../../injection';
import { GeoResourceInfoResult } from '../../../modules/geoResourceInfo/services/GeoResourceInfoService';

/**
 * Uses the EAB endpoint to load GeoResourceInfoResult for DetailInfo.
 * @function
 * @returns {Promise<GeoResourceInfoResult>}
 */
export const loadEabGeoResourceDetailInfo = async (geoResourceId) => {
	const {
		HttpService: httpService,
		ConfigService: configService,
		GeoResourceService: geoResourceService,
		SecurityService: securityService
	} = $injector.inject('HttpService', 'ConfigService', 'GeoResourceService', 'SecurityService');

	const loadInternal = async (geoResource) => {
		const url = `${configService.getValueAsPath('BACKEND_URL')}georesource/info/detail/${geoResource.id}`;
		return httpService.get(url);
	};

	const geoResource = geoResourceService.byId(geoResourceId);

	const result = await loadInternal(geoResource);
	switch (result.status) {
		case 200: {
			const htmlContent = await result.text();
			return new GeoResourceInfoResult(securityService.sanitizeHtml(htmlContent));
		}
		case 204: {
			return null;
		}
	}

	throw new Error(`DetailInfo for '${geoResourceId}' could not be loaded`);
};
