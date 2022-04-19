import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';


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
}
