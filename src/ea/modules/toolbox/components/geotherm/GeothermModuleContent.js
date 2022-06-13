import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


export class GeothermModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myGeothermIFrame',
			module: 'geotherm',
			frame_id: 'geotherm_iframe',
			header_title: translate('toolbox_geotherm')

		};
	}


	static get tag() {
		return 'ea-module-geotherm-content';
	}

}
