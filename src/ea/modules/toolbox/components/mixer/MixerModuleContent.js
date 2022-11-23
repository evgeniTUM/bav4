import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';



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
			module: MixerModuleContent.name,
			frame_id: 'mixer_iframe',
			header_title: translate('toolbox_mixer_header')

		};
	}

	static get name() {
		return 'mixer';
	}

	static get tag() {
		return 'ea-module-mixer-content';
	}

	static get initialWidth() {
		return 46;
	}
}
