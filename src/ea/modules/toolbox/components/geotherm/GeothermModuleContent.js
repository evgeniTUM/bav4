import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


export class GeothermModuleContent extends AbstractModuleContent {

	/**
	* @override
	*/
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myGeothermIFrame',
			module: GeothermModuleContent.name,
			frame_id: 'geotherm_iframe',
			header_title: translate('toolbox_geotherm')

		};
	}

	static get name() {
		return 'geotherm';
	}

	static get tag() {
		return 'ea-module-geotherm-content';
	}

	static get minWidth() {
		return 34;
	}

	static get maxWidth() {
		return 100;
	}

	static get initialWidth() {
		return 40;
	}
}
