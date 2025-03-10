/**
 * @module services/provider/featureInfo_provider
 */
import { $injector } from '../../injection';
import { GeoResourceAuthenticationType } from '../../domain/geoResources';
import { FeatureInfoResult } from '../FeatureInfoService';
import { MediaType } from '../../domain/mediaTypes';
import { isHttpUrl } from '../../utils/checks';

/**
 * A function that takes a coordinate and returns a promise with a FeatureInfoResult.
 *
 * @typedef {function(coordinate) : (Promise<FeatureInfoResult>)} featureInfoProvider
 */

/**
 * Uses the BVV service to load a FeatureInfo.
 * @function
 * @param {string} geoResourceId ID of the Georesource
 * @param {Coordinate} coordinate3857 coordinate in 3857
 * @param {number} mapResolution current resolution of the map in meters
 * @returns {FeatureInfoResult} FeatureInfoResult
 */
export const loadBvvFeatureInfo = async (geoResourceId, coordinate3857, mapResolution) => {
	const {
		HttpService: httpService,
		ConfigService: configService,
		GeoResourceService: geoResourceService,
		BaaCredentialService: baaCredentialService
	} = $injector.inject('HttpService', 'ConfigService', 'GeoResourceService', 'BaaCredentialService');

	const geoResource = geoResourceService.byId(geoResourceId);

	const throwError = () => {
		throw new Error('FeatureInfoResult could not be retrieved');
	};

	if (geoResource) {
		const determineCredential = (geoResource) => {
			return geoResource.authenticationType === GeoResourceAuthenticationType.BAA ? baaCredentialService.get(geoResource.url) ?? throwError() : {};
		};

		const requestPayload = {
			...{
				urlOrId: geoResource.id,
				easting: coordinate3857[0],
				northing: coordinate3857[1],
				srid: 3857,
				resolution: mapResolution
			},
			...determineCredential(geoResource)
		};

		const url =
			configService.getValueAsPath('BACKEND_URL') +
			`getFeature/${isHttpUrl(geoResourceId) ? 'url' /**just a placeholder in that case */ : geoResourceId}`;

		const result = await httpService.post(url, JSON.stringify(requestPayload), MediaType.JSON, {
			timeout: 20000
		});

		switch (result.status) {
			case 200: {
				const { title, content } = await result.json();
				return new FeatureInfoResult(content, title);
			}
			case 204: {
				return null;
			}
		}
	}
	throwError();
};
