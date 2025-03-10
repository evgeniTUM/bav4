import { html } from 'lit-html';
import { $injector } from '../../../../../../../injection';
import { MvuElement } from '../../../../../../../modules/MvuElement';
import { setCurrentModule } from '../../../../../../store/module/ea.action';
import { Analyse3DModuleContent } from '../../../../../toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../../../../toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../../../../toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../../../../toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../../toolbox/components/mixer/MixerModuleContent';
import { ResearchModuleContent } from '../../../../../toolbox/components/research/ResearchModuleContent';
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

		const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject(
			'EnvironmentService',
			'TranslationService'
		);

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
		this.observe(
			(state) => state.media,
			(media) => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth })
		);
		this.observe(
			(state) => state.ea.currentModule,
			(current) => (this._moduleId = current)
		);
	}

	/**
	 * @override
	 */
	createView() {
		const toggleModuleFn = (id) => {
			return () => {
				const moduleId = this._moduleId === id ? null : id;
				setCurrentModule(moduleId);
			};
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
		<style>${css}</style>		
		
		<li id="research" class="ba-list-item" @click="${toggleModuleFn(ResearchModuleContent.name)}">
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
		<li id="mixer" class="ba-list-item" @click="${toggleModuleFn(MixerModuleContent.name)}">
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
		<li id="analyse3d" class="ba-list-item" @click="${toggleModuleFn(Analyse3DModuleContent.name)}">
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
		<li id="geotherm" class="ba-list-item" @click="${toggleModuleFn(GeothermModuleContent.name)}">
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
		<li id="energy-market" class="ba-list-item" @click="${toggleModuleFn(EnergyMarketModuleContent.name)}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-boerse">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
					${translate('ea_menu_boerse')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_boerse_tooltip')}
				</span>
			</span>
		</li>
		<li id="energy-reporting" class="ba-list-item" @click="${toggleModuleFn(EnergyReportingModuleContent.name)}">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-reporting">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text">
					${translate('ea_menu_energy_reporting')}
				</span>
				<span class="ba-list-item__secondary-text">
					${translate('ea_menu_energy_reporting_tooltip')}
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
