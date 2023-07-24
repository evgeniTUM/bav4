import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { EaTopicsContentPanel } from '../../../../../ea/modules/topics/components/menu/EaTopicsContentPanel';
import { $injector } from '../../../../../injection';
import { MainMenu } from '../../../../../modules/menu/components/mainMenu/MainMenu';
import { TabIds } from '../../../../../domain/mainMenu';
import { AdditionalMenu } from './content/additionalMenu/AdditionalMenu';
import { EaMiscContentPanel } from './content/misc/EaMiscContentPanel';

/**
 *
 * @class
 * @author kunze_ge
 */
export class EaMainMenu extends MainMenu {
	constructor() {
		super();
		const { TranslationService: translationService } = $injector.inject('TranslationService');
		this._translationService = translationService;
	}

	_getContentPanel(definition) {
		switch (definition) {
			case TabIds.EXTENSION:
				return html`${unsafeHTML(`<${AdditionalMenu.tag} data-test-id />`)}`;
			case TabIds.TOPICS:
				return html`${unsafeHTML(`<${EaTopicsContentPanel.tag} data-test-id />`)}`;
			case TabIds.MISC:
				return html`${unsafeHTML(`<${EaMiscContentPanel.tag} data-test-id />`)}`;
			default:
				return super._getContentPanel(definition);
		}
	}

	static get tag() {
		return 'ea-main-menu';
	}
}
