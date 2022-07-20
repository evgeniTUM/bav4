import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import css from './legendContent.css';

const Update_legend_active = 'update_legend_active';
const Update_resolution = 'update_resolution';
const Update_legend_items = 'update_legend_items';

export class LegendContent extends MvuElement {

	constructor() {
		super({
			legendActive: true,
			legendItems: [],
			resolution: 0
		});

		const { StoreService, TranslationService } = $injector
			.inject('StoreService', 'TranslationService');
		this._storeService = StoreService;
		this._translationService = TranslationService;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_legend_active:
				return { ...model, legendActive: data };

			case Update_legend_items:
				return { ...model, legendItems: data };

			case Update_resolution:
				return { ...model, resolution: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.module.legendActive, active => this.signal(Update_legend_active, active));
		this.observe(state => state.module.legendItems, items => this.signal(Update_legend_items, items));
		this.observe(state => state.module.mapResolution, resolution => this.signal(Update_resolution, resolution));
	}

	createView(model) {
		if (!model.legendActive) {
			return nothing;
		}

		const translate = (key) => this._translationService.translate(key);

		const resolution = model.resolution;
		const visibleLayers = model.legendItems
			.filter(l => resolution > l.maxResolution && resolution < l.minResolution);

		const uniqueVisibleLayers = [...new Map(visibleLayers.map(item =>
			[item.title, item])).values()];

		const content = uniqueVisibleLayers.map(l => html`
			<div class="ea-legend-item__title">${l.title}</div>
			<img src="${l.legendUrl}" @dragstart=${(e) => e.preventDefault()}></img>
		`);

		return html`
        <style>${css}</style>
            <div class="ea-legend-container">
				<div class="ea-legend-filler"></div>
				<div class="ea-legend-content">
					<div class="ea-legend__title">
						${translate('ea_legend_title')}
					</div>
					${content}
				</div>
			</div>
        `;
	}

	static get tag() {
		return 'ea-legend';
	}
}
