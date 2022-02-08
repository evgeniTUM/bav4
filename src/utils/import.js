import { $injector } from '../injection';
import { GeoResourceFuture, observable, VectorGeoResource, VectorSourceType } from '../services/domain/geoResources';
import { MediaType } from '../services/HttpService';
import { modifyLayer } from '../store/layers/layers.action';
import { createUniqueId } from './numberUtils';

/**
 * A function that tries to detect the source type for currently loaded vector data.
 * @param {string} data
 * @param {string} [mediaType]
 * @returns VectorSourceType or `null`
 */
export const detectVectorSourceType = (data, mediaType = null) => {

	switch (mediaType) {
		case MediaType.KML:
			return VectorSourceType.KML;
		case MediaType.GPX:
			return VectorSourceType.GPX;
		case MediaType.GeoJSON:
			return VectorSourceType.GEOJSON;
	}
	// alternatively, we check the content in a naive manner
	if (data.includes('<kml') && data.includes('</kml>')) {
		return VectorSourceType.KML;
	}
	if (data.includes('<gpx') && data.includes('</gpx>')) {
		return VectorSourceType.GPX;
	}
	try {
		if (JSON.parse(data).type) {
			return VectorSourceType.GEOJSON;
		}
	}
	catch {
		return null;
	}
	return null;
};

/**
  * Options for importing vector data.
  * @typedef {Object} VectorDataImportOptions
  * @param {string} [id] id, will be autogenerated if not set
  * @param {string} [label] label, will be autogenerated if not set
  * @param {VectorSourceType} [sourceType] label, will be automatically detected if not set
  * @param {function} [detectVectorSourceTypeFunction=detectVectorSourceType] function that detemines the source type. Defaults to {@link detectVectorSourceType}.
  */

/**
 * Returns default vector data import options
 * @returns VectorDataImportOptions
 */
export const defaultImportVectorDataOptions = () => ({
	id: createUniqueId().toString(),
	label: null,
	sourceType: null,
	detectVectorSourceTypeFunction: detectVectorSourceType
});

/**
 * Imports vector data from an URL and returns a {@link GeoResourceFuture}.
 * The GeoResourceFuture is registered on the {@link GeoResourceService}.
 * @param {string} url
 * @param {VectorDataImportOptions} [options]
 * @returns VectorGeoresouce
 */
export const importVectorDataFromUrl = (url, options = {}) => {
	const { id, label, sourceType, detectVectorSourceTypeFunction } = { ...defaultImportVectorDataOptions(), ...options };
	const { HttpService: httpService, GeoResourceService: geoResourceService, UrlService: urlService, TranslationService: translationService }
		= $injector.inject('HttpService', 'GeoResourceService', 'UrlService', 'TranslationService');

	const loader = async id => {

		const proxyfiedUrl = urlService.proxifyInstant(url);

		const result = await httpService.get(proxyfiedUrl);

		if (result.ok) {
			const data = await result.text();
			const resultingSourceType = sourceType ?? detectVectorSourceTypeFunction(data, result.headers.get('Content-Type'));
			if (resultingSourceType) {
				const vgr = observable(new VectorGeoResource(id, label ?? translationService.translate('layersPlugin_store_layer_default_layer_name_vector'), resultingSourceType),
					(prop, value) => {
						if (prop === '_label') {
							modifyLayer(id, { label: value });
						}
					});
				vgr.setSource(data, 4326 /**valid for kml, gpx an geoJson**/);
				return vgr;
			}
			throw new Error(`GeoResource for '${url}' could not be loaded: SourceType could not be detected`);
		}
		throw new Error(`GeoResource for '${url}' could not be loaded: Http-Status ${result.status}`);
	};

	const geoResource = new GeoResourceFuture(id, loader, label ?? translationService.translate('layersPlugin_store_layer_default_layer_name_future'));
	geoResourceService.addOrReplace(geoResource);
	return geoResource;
};

/**
 * Creates a {@link VectorGeoresouce} containing the given data.
 * The VectorGeoresouce is registered on the {@link GeoResourceService}.
 * @param {string} data
 * @param {VectorDataImportOptions} [options]
 * @returns VectorGeoresouce or `null` when no VectorGeoresouce could be created
 */
export const importVectorData = (data, options) => {
	const { id, label, sourceType, detectVectorSourceTypeFunction } = { ...defaultImportVectorDataOptions(), ...options };
	const { GeoResourceService: geoResourceService, TranslationService: translationService }
		= $injector.inject('GeoResourceService', 'TranslationService');

	const resultingSourceType = sourceType ?? detectVectorSourceTypeFunction(data);
	if (resultingSourceType) {
		const vgr = observable(new VectorGeoResource(id, label ?? translationService.translate('layersPlugin_store_layer_default_layer_name_vector'), resultingSourceType), (prop, value) => {
			if (prop === '_label') {
				modifyLayer(id, { label: value });
			}
		});
		vgr.setSource(data, 4326 /**valid for kml, gpx an geoJson**/);
		geoResourceService.addOrReplace(vgr);
		return vgr;
	}
	console.warn(`SourceType for '${id}' could not be detected`);
	return null;
};
