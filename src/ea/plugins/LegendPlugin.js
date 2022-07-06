import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { bvvCapabilitiesProvider } from '../../services/provider/wmsCapabilities.provider';
import { observe } from '../../utils/storeUtils';
import { setLegendItems } from '../store/module/module.action';

export class LegendPlugin extends BaPlugin {
	constructor(capabilitiesProvider = bvvCapabilitiesProvider) {
		super();

		this._capabilitiesProvider = capabilitiesProvider;
	}

	async _extractWmsLayerItems(geoResourceId) {
		const georesource = this._geoResourceService.byId(geoResourceId);
		if (!georesource || !georesource._layers) {
			return [];
		}

		const result = await this._capabilitiesProvider(georesource._url);

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
			const sortedActiveLayers = activeLayers.sort((a, b) => a.title.localeCompare(b.title));
			setLegendItems([...previewLayers, ...sortedActiveLayers]);
		};

		let activeLayers = [];
		let previewLayers = [];


		// A synchronization object:
		// Make sure that the last action always takes precedence.
		// Do this by capturing the parameters and after an "async await"
		// checking if parameters have changed.
		const syncObject = {
			onActiveLayersChange: null,
			onPreviewIdChange: null
		};

		const onActiveLayersChange = async (layers) => {
			// save current parameters in global state
			syncObject.onActiveLayersChange = layers;

			const wmsLayers = await Promise.all(
				layers
					.filter(l => l.visible)
					.map(l => this._extractWmsLayerItems(l.id)));

			// check if another event was triggered => current run is obsolete => abort
			if (syncObject.onActiveLayersChange !== layers) {
				return;
			}

			activeLayers = wmsLayers.flat(1);

			const activeLayersTitles = activeLayers.map(l => l.title);
			previewLayers = previewLayers.filter(l => !activeLayersTitles.includes(l.title));

			updateLegendItems(activeLayers, previewLayers);
		};

		const onPreviewIdChange = async (geoResourceId) => {
			if (!store.getState().module.legendActive) {
				return;
			}

			// save current parameters in global state
			syncObject.onPreviewIdChange = geoResourceId;

			const layers = geoResourceId ? await this._extractWmsLayerItems(geoResourceId) : [];

			// check if another event was triggered => current run is obsolete => abort
			if (syncObject.onPreviewIdChange !== geoResourceId) {
				return;
			}

			const activeLayerTitles = activeLayers.map(l => l.title);
			previewLayers = layers.filter(l => !activeLayerTitles.includes(l.title));

			updateLegendItems(activeLayers, previewLayers);
		};

		observe(store, state => state.layers.active, onActiveLayersChange);
		observe(store, state => state.module.legendGeoresourceId, onPreviewIdChange);
	}
}
