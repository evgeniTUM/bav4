import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { $injector } from '../../../../../injection';
import { BaElement } from '../../../../../modules/BaElement';
import { activateLegend, deactivateLegend } from '../../../../store/module/ea.action';
import css from './eaLegendButton.css';

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
				deactivateLegend();
			}
			else {
				activateLegend();
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
		const { ea: { legendActive } } = globalState;
		return { active: legendActive };
	}


	static get tag() {
		return 'ea-legend-button';
	}
}
