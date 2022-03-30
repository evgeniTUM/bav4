import { $injector } from '../../injection';
import { addLayer } from '../../store/layers/layers.action';
import { emitNotification, LevelTypes } from '../../store/notifications/notifications.action';
import { VectorSourceType } from '../../services/domain/geoResources';
import { observe } from '../../utils/storeUtils';
//import { provide as provider } from './i18n/geopresent.provider';
import { BaPlugin } from '../../plugins/BaPlugin';
import { SourceTypeName } from '../../services/domain/sourceType';


/**
 * @class
 * @author thiloSchlemmer
 * @author taulinger
 */
export class GeoPresentPlugin extends BaPlugin {
	constructor() {
		super();
		const { ImportVectorDataService: importVectorDataService, TranslationService: translationService } = $injector.inject('ImportVectorDataService', 'TranslationService');
		this._importVectorDataService = importVectorDataService;
		this._translationService = translationService;
//		translationService.register('importPluginProvider', provider);
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const onChange = async (featurePresent) => {
			const { payload: { url, data, sourceType } } = featurePresent;
			console.log('featurePresent');
			console.log(featurePresent);

			const geoResource = url ? await this._importByUrl(url, sourceType) : this._importByData(data, sourceType);
			if (geoResource) {
				const { id, label } = geoResource;
				addLayer(id, { label: label });
			}
		};

//		observe(store, state => state.geopresent.features, onChange);
	}

	/**
	 * Imports the data as remote {@link GeoResource}
	 * @param {string} url the url to the data
	 * @returns {Promise<GeoResource>} the imported GeoResource
	 */
	async _importByUrl(url, sourceType) {
		const createGeoResource = (url, sourceType) => {
			if (sourceType) {
				switch (sourceType.name) {
					case SourceTypeName.KML:
					case SourceTypeName.GPX:
					case SourceTypeName.GEOJSON:
						return this._importVectorDataService.forUrl(url, { sourceType: this._mapSourceTypeToVectorSourceType(sourceType) });
				}
			}
			emitNotification(`${this._translationService.translate('importPlugin_unsupported_sourceType')}`, LevelTypes.WARN);
			return null;
		};


		const geoResource = createGeoResource(url, sourceType);
		if (geoResource) {
			geoResource.onReject(() => {
				emitNotification(this._translationService.translate('importPlugin_url_failed'), LevelTypes.ERROR);
			});
			return geoResource;
		}

		return null;
	}

	/**
	  * Imports the data as local {@link GeoResource}
	  * @param {string} data the local data
	  * @param {string} mimeType the mimeType of the data
	  * @returns {GeoResource|null} the imported GeoResource or null on failure
	  */
	_importByData(data, sourceType) {
		console.log('sourceType ' + sourceType);
		const vectorGeoResource = this._importVectorDataService.forData(data, { sourceType: this._mapSourceTypeToVectorSourceType(sourceType) });
		if (vectorGeoResource) {
			return vectorGeoResource;
		}
		emitNotification(this._translationService.translate('importPlugin_data_failed'), LevelTypes.ERROR);
		return null;
	}

	/**
	  * Maps a {@link SourceType} to a {@link VectorSourceType}
	*/
	_mapSourceTypeToVectorSourceType(sourceType) {
		if (sourceType) {
			switch (sourceType.name) {
				case SourceTypeName.GEOJSON:
					return VectorSourceType.GEOJSON;
				case SourceTypeName.GPX:
					return VectorSourceType.GPX;
				case SourceTypeName.KML:
					return VectorSourceType.KML;
			}
		}
		return null;
	}
}
