import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';

export class RedesignModuleContent extends AbstractModuleContent {
	/**
	 * @override
	 */
	getConfig() {
		const translate = (key) => this._translationService.translate(key);

		return {
			iframe: 'myRedesignIFrame',
			module: RedesignModuleContent.name,
			frame_id: 'redesign_iframe',
			header_title: translate('toolbox_redesign_header')
		};
	}

	static get name() {
		return 'redesign';
	}

	static get tag() {
		return 'ea-module-redesign-content';
	}

	static get initialWidth() {
		return 40;
	}
}
