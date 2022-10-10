import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import css from './energyMarket.css';

const Update = 'update';

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
	update(type, data, model) {
		switch (type) {
			case Update:
				return {
					...model,
					...data
				};
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(state => state.contribution, data => this.signal(Update, data));
	}

	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);
		return html`
			<style>${css}</style>		
			<div class="title"> 
				${translate('ea_menu_boerse')}
			</div>
			<ea-feature-contribution mode='market'></ea-feature-contribution>`;
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
