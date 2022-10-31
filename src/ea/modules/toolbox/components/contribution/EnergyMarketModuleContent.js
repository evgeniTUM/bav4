import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { generateJsonCategorySpecFromCSV } from '../../../../utils/eaUtils';
import css from './energyMarket.css';

const Update_Categories = 'update_categories';
export class EnergyMarketModuleContent extends MvuElement {

	constructor() {
		super({
			categories: null,
			isPortrait: false,
			hasMinWidth: false
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService
		}
			= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_Categories:
				return { ...model, categories: data };

		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);


		setTimeout(async () => {

			const text = await (await fetch('/assets/energyMarketCategories.csv')).text();

			const categoriesSpecification = generateJsonCategorySpecFromCSV(text);
			this.signal(Update_Categories, categoriesSpecification);
		});

		const content = model.categories ?
			html`<ea-feature-contribution mode='market' .categories=${model.categories}></ea-feature-contribution>`
			: nothing;


		return html`
			<style>${css}</style>
			<div class='container'>
				<div class='header'> 
					${translate('ea_menu_boerse')}
				</div>
				<div class='content'>
					${content}
				</div>
			</div>
			`;

	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get name() {
		return 'energy-market';
	}

	static get tag() {
		return 'ea-module-energy-market';
	}
}
