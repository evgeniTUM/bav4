import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { generateJsonCategorySpecFromCSV } from '../../../../utils/eaUtils';
import css from './container.css';
import { MODUS } from './EAContribution';

export class EnergyReportingModuleContent extends MvuElement {

	constructor() {
		super({
			description: '',
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
					${translate('ea_menu_energy_reporting')}
				</div>
				<div class='content'>
					<ea-feature-contribution .mode=${MODUS.reporting} .categories=${categories}></ea-feature-contribution>
				</div>
			</div>
			`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get name() {
		return 'energy-reporting';
	}

	static get tag() {
		return 'ea-module-energy-reporting';
	}

	static get initialWidth() {
		return 40;
	}
}
