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
			layers: [],
			zoom: 0,
			previewLayer: null
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
				return { ...model, layers: data };

			case Update_preview_layer:
				return { ...model, previewLayer: data };

			case Update_zoom:
				return { ...model, zoom: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.module.legendActive, active => this.signal(Update_legend_active, active));
		this.observe(state => state.position.zoom, zoom => this.signal(Update_zoom, zoom));

		const updateLayers = async (layers) => {
			if (layers.length === 0) {
				this.signal(Update_layers, []);
				return;
			}

			const georesource = this._geoResourceService.byId(layers[0]);
			const layerFilter = georesource._layers.split(',');

			const result = await bvvCapabilitiesProvider(georesource._url);
			const wmsLayers = result.layers.filter(l => layerFilter.includes(l.name));

			this.signal(Update_layers, wmsLayers);
		};

		this.observe(state => state.module.legendGeoresourceIds, updateLayers);
	}

	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const center = this._storeService.getStore().getState().position.center;
		const resolution = this._mapService.calcResolution(model.zoom, center);

		const activeLayers = model.layers
			.filter(l => resolution > l.maxResolution && resolution < l.minResolution);

		const content = activeLayers.map(l => html`
			<div>${l.title}</div>
			<img src="${l.legendUrl}"></img>
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
