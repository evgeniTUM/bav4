import { html } from 'lit-html';
import { BaElement } from '../../../../BaElement';
import css from './additionalMenu.css';
import { MixerModuleContent } from '../../../toolbox/components/mixerModuleContent/MixerModuleContent';
import { openToolContainer, setContainerContent, toggleToolContainer } from '../../../../../store/toolContainer/toolContainer.action';
import { $injector } from '../../../../../injection';


/**
 * Container for Tools
 *
 * @class
 * @author alsturm
 */
export class AdditionalMenu extends BaElement {

	constructor() {
		super();

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService
		}
			= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
	}

	/**
	 * @override
	 */
	createView(state) {

		const { toolBar, toolContainer, fetching, portrait, minWidth } = state;

		const toolBarOpen = toolBar.open;
		const activeToolId = toolContainer.contentId;
		const getOrientationClass = () => {
			return portrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return minWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return toolBarOpen ? 'is-open' : '';
		};

		const toggleTool = (toolId) => {
                        this.log('toggleTool --> Toolid:  ' + toolId); 
			setContainerContent(toolId);
			if (activeToolId === toolId) {
				toggleToolContainer();
			}
			else {
				openToolContainer();
			}
		};
		const toggleMixerModule = () => {
			const toolId = MixerModuleContent.tag;
			toggleTool(toolId);
		};

		const getAnimatedBorderClass = () => {
			return fetching ? 'animated-action-button__border__running' : '';
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>${css}</style>		
		<div class="${getOrientationClass()} ${getMinWidthClass()}"> 
			<ul class="ba-list">
			<li class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
					Zusatzfunktionen
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Mitmachen und Börsen
				</span>
				<span class="ba-list-item__secondary-text">
					Hier Korrekturen und neue Objekte melden
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Daten-Recherche und Download
				</span>
				<span class="ba-list-item__secondary-text">
					Hier Daten durchsuchen und exportieren
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<div  @click="${toggleMixerModule}" class="tool-bar__button">
				<span class="ba-list-item__text ">
					<span class="ba-list-item__primary-text">
						Mischpult "Energiemix Bayern vor Ort"
					</span>
					<span class="ba-list-item__secondary-text">
						Hier Strom- und Wärmemix, Potenziale und Szenarien einer Kommune abrufen
					</span>
				</span>
			</div>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				${translate('ea_menu_analyse3d')}
				</span>
				<span class="ba-list-item__secondary-text">
				${translate('ea_menu_analyse3d_tooltip')}
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
				Standortcheck Oberfl. Geothermie
				</span>
				<span class="ba-list-item__secondary-text">
					Hier die Standorteignung für oberflächennahe Geothermie prüfen
				</span>
			</span>
		</li>
		</div>
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	/**
		 * @override
		 * @param {Object} globalState
		 */
	extractState(globalState) {
		const { toolBar, toolContainer, network: { fetching }, media: { portrait, minWidth } } = globalState;
		return { toolBar, toolContainer, fetching, portrait, minWidth };
	}

	static get tag() {
		return 'ea-additional-menu';
	}
}
