import { html } from 'lit-html';
import css from './eaLegendButton.css';
import { classMap } from 'lit-html/directives/class-map.js';
import { BaElement } from '../../../../../modules/BaElement';
import { $injector } from '../../../../../injection';
import { activate, deactivate } from '../../../../../store/geolocation/geolocation.action';

export class EaLegendButton extends BaElement {

	constructor() {
		super();
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
	}

	/**
	 *@override
	 */
	createView(state) {
		const { active } = state;
		const translate = (key) => this._translationService.translate(key);
		const onClick = () => {
			if (active) {
				deactivate();
			}
			else {
				activate();
			}
		};

		let title = translate('map_legendButton_title_activate');
		if (active) {
			title = translate('map_legendButton_title_deactivate');
		}

		const classes = {
			inactive: !active,
			active: active
		};
		return html`
		<style>${css}</style> 
		<div class='legend'>
			<button class='legend-button ${classMap(classes)}' @click=${onClick} title=${title} >
			<i class="icon legend-icon"></i></button>
		</div>
		`;
	}

	extractState(globalState) {
		const { geolocation: { active } } = globalState;
		return { active };
	}


	static get tag() {
		return 'ea-legend-button';
	}
}
