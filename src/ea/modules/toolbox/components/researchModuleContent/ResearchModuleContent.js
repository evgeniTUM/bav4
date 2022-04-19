import { html } from 'lit-html';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';
import css from './researchModuleContent.css';


export class ResearchModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myResearchIFrame',
			site: 'recherche',
			frame_id: 'research_iframe',
			header_title: translate('toolbox_recherche_header')

		};
	}


	static get tag() {
		return 'ea-module-research-content';
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
