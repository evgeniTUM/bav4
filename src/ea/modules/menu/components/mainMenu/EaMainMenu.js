import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { EaTopicsContentPanel } from '../../../../../ea/modules/topics/components/menu/EaTopicsContentPanel';
import { $injector } from '../../../../../injection';
import { MainMenu } from '../../../../../modules/menu/components/mainMenu/MainMenu';
import { TabId } from '../../../../../store/mainMenu/mainMenu.action';
import { AdditionalMenu } from '../additionalMenu/AdditionalMenu';


/**
 *
 * @class
 * @author kunze_ge
 */
export class EaMainMenu extends MainMenu {

	constructor() {
		super();
		window.console.log('EaMainMenu.constructor');
		const { TranslationService: translationService } = $injector.inject('TranslationService');
		this._translationService = translationService;
	}


	_getContentPanel(definition) {
		switch (definition) {
			case TabId.EXTENSION:
				return html`${unsafeHTML(`<${AdditionalMenu.tag}/>`)}`;
			case TabId.TOPICS:
				window.console.log('Topics EaTopicsContentPanel ');
				return html`${unsafeHTML(`<${EaTopicsContentPanel.tag}/>`)}`;
			default:
				return super._getContentPanel(definition);
		}
	}

	static get tag() {
		return 'ea-main-menu';
	}
}
