import { html, nothing } from 'lit-html';
import { AdditionalMenu } from '../additionalMenu/AdditionalMenu';
import { $injector } from '../../../../../injection';
import css  from '../../../../../modules/menu/components/mainMenu/mainMenu.css'
import { MainMenu } from '../../../../../modules/menu/components/mainMenu/MainMenu';
import { EaTopicsContentPanel } from '../../../../../ea/modules/topics/components/menu/EaTopicsContentPanel';
import { TabId, toggle } from '../../../../../store/mainMenu/mainMenu.action';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';


/**
 *
 * @class
 * @author kunze_ge
 */
export class EaMainMenu extends MainMenu {

	constructor() {
		super();
                window.console.log('EaMainMenu.constructor');
                const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject('EnvironmentService', 'TranslationService');
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
