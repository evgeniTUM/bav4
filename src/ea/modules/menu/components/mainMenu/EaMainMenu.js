import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { BaElement, renderTagOf } from '../../../../../modules/BaElement';
import css  from '../../../../../modules/menu/components/mainMenu/mainMenu.css'
import { MainMenu } from '../../../../../modules/menu/components/mainMenu/MainMenu';
import { DevInfo } from  '../../../../../modules/utils/components/devInfo/DevInfo';
import { TopicsContentPanel } from '../../../../../modules/topics/components/menu/TopicsContentPanel';
import { EaTopicsContentPanel } from '../../../../../ea/modules/topics/components/menu/EaTopicsContentPanel';
import { SearchResultsPanel } from   '../../../../../modules/search/components/menu/SearchResultsPanel';
import { TabKey, toggle } from '../../../../../store/mainMenu/mainMenu.action';
import { FeatureInfoPanel } from '../../../../../modules/featureInfo/components/FeatureInfoPanel';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { AdditionalMenu } from '../additionalMenu/';


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
        
         
        _extendEabContent() {
		return html`
		<ea-additional-menu></ea-additional-menu>
	`;
	}
        _getContentPanel(definition) {
		switch (definition) {
			case TabKey.EXTENSION:
				return this._extendEabContent();
			case TabKey.TOPICS:
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
