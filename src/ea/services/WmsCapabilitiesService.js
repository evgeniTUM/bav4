import { $injector } from '../../injection';
import { SourceType, SourceTypeName } from '../../services/domain/sourceType';

import { bvvCapabilitiesProvider } from '../../services/provider/wmsCapabilities.provider';

export class WmsCapabilitiesService {

	/**
	 * @param {wmsCapabilitiesProvider} [wmsCapabilitiesProvider = bvvCapabilitiesProvider]
	 */
	constructor(wmsCapabilitiesProvider = bvvCapabilitiesProvider) {
		this._wmsCapabilitiesProvider = wmsCapabilitiesProvider;
		this._cache = {};
	}

	async getWmsLayers(geoResourceId, isAuthenticated = false) {
		const { GeoResourceService } = $injector.inject('GeoResourceService');

		const sourceType = new SourceType(SourceTypeName.WMS, '1.1.1');
		const georesource = GeoResourceService.byId(geoResourceId);
		if (!georesource || !georesource._layers) {
			return [];
		}

		const capabilities = georesource._url in this._cache ?
			this._cache[georesource._url]
			: await this._wmsCapabilitiesProvider(georesource._url, sourceType, isAuthenticated);

		this._cache[georesource._url] = capabilities;

		const layerFilter = georesource._layers.split(',');
		const result = capabilities
			.filter(l => layerFilter.includes(l._layers))
			.map(l => ({
				title: l._label,
				legendUrl: l._extraParams.legendUrl,
				minResolution: l._extraParams.minResolution,
				maxResolution: l._extraParams.maxResolution
			}));

		return result;
	}
}
