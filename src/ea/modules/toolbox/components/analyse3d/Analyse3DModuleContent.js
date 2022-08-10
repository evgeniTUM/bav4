import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


export class Analyse3DModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myAnalyse3DIFrame',
			module: Analyse3DModuleContent.name,
			frame_id: 'analyse3d_iframe',
			header_title: translate('toolbox_analyse3d')

		};
	}

	static get name() {
		return 'analyse3d';
	}

	static get tag() {
		return 'ea-module-analyse3d-content';
	}

}
