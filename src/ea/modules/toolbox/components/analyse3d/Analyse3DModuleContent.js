import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


export class Analyse3DModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myAnalyse3DIFrame',
			module: 'analyse3d',
			frame_id: 'analyse3d_iframe',
			header_title: translate('toolbox_recherche_header')

		};
	}


	static get tag() {
		return 'ea-module-analyse3d-content';
	}

}
