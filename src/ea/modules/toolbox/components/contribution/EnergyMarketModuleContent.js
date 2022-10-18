import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import css from './energyMarket.css';

export class EnergyMarketModuleContent extends MvuElement {

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
		return html`
			<style>${css}</style>
			<div class='container'>
				<div class='header'> 
					${translate('ea_menu_boerse')}
				</div>
				<div class='content'>
					<ea-feature-contribution mode='market'></ea-feature-contribution>
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
