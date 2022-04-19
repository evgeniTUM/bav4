import { html } from 'lit-html';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';
import css from './redesignModuleContent.css';


export class RedesignModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myRedesignIFrame',
			site: 'redesign',
			frame_id: 'redesign_iframe',
			header_title: translate('toolbox_redesign_header')

		};
	}


	static get tag() {
		return 'ea-module-redesign-content';
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
