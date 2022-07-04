import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { bvvCapabilitiesProvider } from '../../services/provider/wmsCapabilities.provider';
import { observe } from '../../utils/storeUtils';
import { setLegendItems } from '../store/module/module.action';

export class LegendPlugin extends BaPlugin {
	constructor() {
		super();

		this._previewLayers = [];
		this._activeLayers = [];
	}

	async _extractWmsLayerItems(geoResourceId) {
		if (!geoResourceId) {
			return [];
		}

		const georesource = this._geoResourceService.byId(geoResourceId);
		if (!georesource._layers) {
			return [];
		}

		const result = await bvvCapabilitiesProvider(georesource._url);

		const layerFilter = georesource._layers.split(',');
		return result
			.filter(l => layerFilter.includes(l._layers))
			.map(l => ({
				title: l._label,
				legendUrl: l._extraParams.legendUrl,
				minResolution: l._extraParams.minResolution,
				maxResolution: l._extraParams.maxResolution
			}));
	}

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const { GeoResourceService } = $injector.inject('GeoResourceService');
		this._geoResourceService = GeoResourceService;

		const updateLegendItems = (activeLayers, previewLayers) => {
			setLegendItems([...previewLayers, ...activeLayers]);
		};

		let activeLayers = [];
		let previewLayers = [];

		const onActiveLayersChange = async (layers) => {
			if (layers.length === 0) {
				setLegendItems([]);
				return;
			}
			const wmsLayers = await Promise.all(layers.map(l => this._extractWmsLayerItems(l.id)));

			activeLayers = wmsLayers.flat(1).sort((a, b) => a.title.localeCompare(b.title));

			const activeLayersTitles = activeLayers.map(l => l.title);
			previewLayers = previewLayers.filter(l => !activeLayersTitles.includes(l.title));

			updateLegendItems(activeLayers, previewLayers);
		};

		const onPreviewIdChange = async (geoResourceId) => {
			const layers = geoResourceId ? await this._extractWmsLayerItems(geoResourceId) : [];

			const activeLayerTitles = activeLayers.map(l => l.title);
			previewLayers = layers.filter(l => !activeLayerTitles.includes(l.title));

			updateLegendItems(activeLayers, previewLayers);
		};

		observe(store, state => state.layers.active, onActiveLayersChange);
		observe(store, state => state.module.legendGeoresourceId, onPreviewIdChange);
	}
}
