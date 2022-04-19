import { html } from 'lit-html';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';
import css from './mixerModuleContent.css';



/**
 * @class
 * @author kunze_ge
 */
export class MixerModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myMixerIFrame',
			site: 'mixer',
			frame_id: 'mixer_iframe',
			header_title: translate('toolbox_mixer_header')

		};
	}


	static get tag() {
		return 'ea-module-mixer-content';
	}

	/**
	* @override
	*/
	defaultCss() {
		return html`
		${super.defaultCss()}
		<style>
		    ${css}
		</style>
		`;
	}
}
