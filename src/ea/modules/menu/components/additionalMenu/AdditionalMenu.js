import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { toggleTaggingMode } from '../../../../store/contribution/contribution.action';
import { setCurrentModule } from '../../../../store/module/module.action';
import { Analyse3DModuleContent } from '../../../toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../../toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../../../toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../../../toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../../toolbox/components/researchModuleContent/ResearchModuleContent';
import css from './additionalMenu.css';


const Update_IsOpen = 'update_isOpen';
const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
/**
 * Container for Modules
 *
 * @class
 * @author alsturm
 */
export class AdditionalMenu extends MvuElement {

	constructor() {
		super({
			isOpen: false,
			isPortrait: false,
			hasMinWidth: false
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService
		}
			= $injector.inject('EnvironmentService', 'TranslationService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._moduleId = null;
	}

	update(type, data, model) {
		switch (type) {
			case Update_IsOpen:
				return { ...model, isOpen: data };
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };
		}
	}

	onInitialize() {
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));
		this.observe(state => state.module.current, current => this._moduleId = current);
	}

	/**
	 * @override
	*/
	createView() {

		const toggleModuleFn = (id) => {
			return () => {
				const moduleTag = this._moduleId === id ? null : id;
				setCurrentModule(moduleTag);
			};
		};

		const toggleContributionModule = () => {
			toggleTaggingMode();
			toggleModuleFn(EAContribution.tag)();
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
		<style>${css}</style>		
		<li id="contribution" class="ba-list-item" @click="${toggleContributionModule}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-mitmachboerse">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
					${translate('ea_menu_report')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_report_tooltip')}
				</span>
			</span>
		</li>
		<li id="research" class="ba-list-item" @click="${toggleModuleFn(ResearchModuleContent.tag)}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-recherche">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
						${translate('ea_menu_recherche')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_recherche_tooltip')}
				</span>
			</span>
		</li>
		<li id="mixer" class="ba-list-item" @click="${toggleModuleFn(MixerModuleContent.tag)}">
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon-mischpult">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">
					<span class="ba-list-item__primary-text">
						${translate('ea_menu_mixer')}
					</span>
					<span class="ba-list-item__secondary-text">
						${translate('ea_menu_mixer_tooltip')}
					</span>
				</span>
		</li>
		<li id="redesign" class="ba-list-item" @click="${toggleModuleFn(RedesignModuleContent.tag)}">
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon-mischpult">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">
					<span class="ba-list-item__primary-text">
						${translate('ea_menu_redesign')}
					</span>
					<span class="ba-list-item__secondary-text">
						${translate('ea_menu_redesign_tooltip')}
					</span>
				</span>
		</li>
		<li id="analyse3d" class="ba-list-item" @click="${toggleModuleFn(Analyse3DModuleContent.tag)}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-3d_wind">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
				${translate('ea_menu_analyse3d')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_analyse3d_tooltip')}
				</span>
			</span>
		</li>
		<li id="geotherm" class="ba-list-item" @click="${toggleModuleFn(GeothermModuleContent.tag)}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-standortcheck">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
				${translate('ea_menu_geotherm_short')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_geotherm_tooltip')}
				</span>
			</span>
		</li>
		</div>
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get tag() {
		return 'ea-additional-menu';
	}
}
