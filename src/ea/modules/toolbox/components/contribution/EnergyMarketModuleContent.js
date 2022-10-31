import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { generateJsonCategorySpecFromCSV } from '../../../../utils/eaUtils';
import css from './container.css';


export class EnergyMarketModuleContent extends MvuElement {

	constructor() {
		super({
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
	createView() {
		const translate = (key) => this._translationService.translate(key);

		const csv = require('dsv-loader?delimiter=,!./assets/energyMarketCategories.csv');
		const categories = generateJsonCategorySpecFromCSV(csv);

		return html`
			<style>${css}</style>
			<div class='container'>
				<div class='header'> 
					${translate('ea_menu_boerse')}
				</div>
				<div class='content'>
					${content}
					<ea-feature-contribution mode='market' .categories=${categories}>
						<div slot='introduction'>
							<div class='header'>Abwärmeinformations- und Solarflächenbörse</div>
							<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>
						</div>
					</ea-feature-contribution>

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
