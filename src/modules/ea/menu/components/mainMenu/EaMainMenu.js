import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { BaElement, renderTagOf } from '../../../../BaElement';
import css          from '../../../../menu/components/mainMenu/mainMenu.css';
import { MainMenu } from '../../../../menu/components/mainMenu/MainMenu';
import { DevInfo } from '../../../../utils/components/devInfo/DevInfo';
import { TopicsContentPanel } from '../../../../topics/components/menu/TopicsContentPanel';
import { SearchResultsPanel } from '../../../../search/components/menu/SearchResultsPanel';
import { TabKey, toggle } from '../../../../../store/mainMenu/mainMenu.action';
import { FeatureInfoPanel } from '../../../../featureInfo/components/FeatureInfoPanel';
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
			default:
				return super._getContentPanel(definition);
		}
	}
        
	static get tag() {
		return 'ea-main-menu';
	}
}
