import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { bvvCapabilitiesProvider } from '../../../../../services/provider/wmsCapabilities.provider';
import css from './legendContent.css';

const Update_legend_active = 'update_legend_active';
const Update_zoom = 'update_zoom';
const Update_layers = 'update_layers';
const Update_preview_layer = 'update_preview';

export class LegendContent extends MvuElement {

	constructor() {
		super({
			legendActive: true,
			activeLayers: [],
			previewLayers: [],
			zoom: 0
		});

		const { StoreService, TranslationService, MapService, GeoResourceService } = $injector
			.inject('StoreService', 'TranslationService', 'MapService', 'GeoResourceService');
		this._storeService = StoreService;
		this._translationService = TranslationService;
		this._mapService = MapService;
		this._geoResourceService = GeoResourceService;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_legend_active:
				return { ...model, legendActive: data };

			case Update_layers:
				return { ...model, activeLayers: data };

			case Update_preview_layer:
				return { ...model, previewLayers: data };

			case Update_zoom:
				return { ...model, zoom: data };
		}
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
		return result.layers
			.filter(l => layerFilter.includes(l.name))
			.map(l => ({
				title: l.title,
				legendUrl: l.legendUrl,
				minResolution: l.minResolution,
				maxResolution: l.maxResolution
			}));
	}


	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.module.legendActive, active => this.signal(Update_legend_active, active));
		this.observe(state => state.position.zoom, zoom => this.signal(Update_zoom, zoom));

		const updateActiveLayers = async (layers) => {
			if (layers.length === 0) {
				this.signal(Update_layers, []);
				return;
			}

			const wmsLayers = await Promise.all(layers.map(l => this._extractWmsLayerItems(l.id)));

			this.signal(Update_layers, wmsLayers.flat(1));
		};

		const updatePreviewLayer = async (geoResourceId) => {
			this.signal(Update_preview_layer, await this._extractWmsLayerItems(geoResourceId));
		};

		this.observe(state => state.module.legendGeoresourceId, updatePreviewLayer);
		this.observe(state => state.layers.active, updateActiveLayers);
	}

	createView(model) {
		if (!model.legendActive) {
			return null;
		}

		const translate = (key) => this._translationService.translate(key);

		const center = this._storeService.getStore().getState().position.center;
		const resolution = this._mapService.calcResolution(model.zoom, center);

		const layers = [...model.previewLayers, ...model.activeLayers];
		const uniqueLayers = Array.from(new Set(layers.map(l => l.title)))
			.map(title => {
				return layers.find(a => a.title === title);
			});

		const visibleLayers = uniqueLayers
			.filter(l => resolution > l.maxResolution && resolution < l.minResolution);

		const content = visibleLayers.map(l => html`
			<div>${l.title}</div>
			<img src="${l.legendUrl}" @dragstart=${(e) => e.preventDefault()}></img>
		`);

		return html`
        <style>${css}</style>
            <div class="ea-legend">
				<div class="ea-legend__title">
					${translate('ea_legend_title')}
				</div>
				${content}
			</div>
        `;
	}

	static get tag() {
		return 'ea-legend';
	}
}
