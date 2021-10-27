import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MainMenu } from '../../../../menu/components/mainMenu/MainMenu';
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
	
	_demoMoreContent() {
		return html`
		${this._extendEabContent()} ${super._demoMoreContent()}
		`;
         }
         
        _extendEabContent() {
//		return html`
//		<div class="">	
//		<ul class="ba-list">
//		<li class="ba-list-item  ba-list-item__header">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//					Zusatzfunktionen
//				</span>
//			</span>
//		</li>
//		<li class="ba-list-item">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//				Mitmachen und Börsen
//				</span>
//				<span class="ba-list-item__secondary-text">
//					Hier Korrekturen und neue Objekte melden
//				</span>
//			</span>
//		</li>
//		<li class="ba-list-item">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//				Daten-Recherche und Download
//				</span>
//				<span class="ba-list-item__secondary-text">
//					Hier Daten durchsuchen und exportieren
//				</span>
//			</span>
//		</li>
//		<li class="ba-list-item">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//				Mischpult "Energiemix Bayern vor Ort"
//				</span>
//				<span class="ba-list-item__secondary-text">
//					Hier Strom- und Wärmemix, Potenziale und Szenarien einer Kommune abrufen
//				</span>
//					<button  @click="${toggleMeasureTool}" class="tool-bar__button">
//						<div class="tool-bar__button_icon measure">							
//						</div>
//						<div class="tool-bar__button-text">
//							${translate('menu_toolbar_measure_button')}
//						</div>  
//					</button>  	
//
//			</span>
//		</li>
//		<li class="ba-list-item">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//				${translate('ea_menu_analyse3d')}
//				</span>
//				<span class="ba-list-item__secondary-text">
//				${translate('ea_menu_analyse3d_tooltip')}
//				</span>
//			</span>
//		</li>
//		<li class="ba-list-item">
//			<span class="ba-list-item__text ">
//				<span class="ba-list-item__primary-text">
//				Standortcheck Oberfl. Geothermie
//				</span>
//				<span class="ba-list-item__secondary-text">
//					Hier die Standorteignung für oberflächennahe Geothermie prüfen
//				</span>
//			</span>
//		</li>
//		<li  class="ba-list-item">
//                    <span class="ba-list-item__text vertical-center">
//                        <span class="ba-list-item__primary-text">
//                        Dark mode
//                        </span>
//                    </span>
//                    <span class="ba-list-item__after">
//                        <ba-theme-toggle></ba-theme-toggle>
//                    </span>
//                </li>
//	</ul>
//	</div>
//	`;
		return html`
		<ea-additional-menu></ea-additional-menu>
	`;
	}
        
	static get tag() {
		return 'ea-main-menu';
	}
}
