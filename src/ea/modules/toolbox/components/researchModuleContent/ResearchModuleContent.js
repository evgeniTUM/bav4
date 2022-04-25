import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


export class ResearchModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myResearchIFrame',
			module: 'recherche',
			frame_id: 'research_iframe',
			header_title: translate('toolbox_recherche_header')

		};
	}


	static get tag() {
		return 'ea-module-research-content';
	}

}
