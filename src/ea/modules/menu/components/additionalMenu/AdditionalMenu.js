import { html } from 'lit-html';
import { MvuElement } from '../../../../../modules/MvuElement';
import css from './additionalMenu.css';
import { MixerModuleContent } from '../../../toolbox/components/mixerModuleContent/MixerModuleContent';
import { openToolContainer, setContainerContent, toggleToolContainer } from '../../../../../store/toolContainer/toolContainer.action';
import { $injector } from '../../../../../injection';


const Update_IsOpen = 'update_isOpen';
const Update_Fetching = 'update_fetching';
const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
/**
 * Container for Tools
 *
 * @class
 * @author alsturm
 */
export class AdditionalMenu extends MvuElement {

	constructor() {
		super({
			isOpen: false,
			isFetching: false,
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
		this._toolId = null;
	}

	update(type, data, model) {
		switch (type) {
			case Update_IsOpen:
				return { ...model, isOpen: data };
			case Update_Fetching:
				return { ...model, isFetching: data };
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };
		}
	}

	onInitialize() {
		this.observe(state => state.network.fetching, fetching => this.signal(Update_Fetching, fetching));
		this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));
		this.observe(state => state.toolContainer.contentId, contentId => this._toolId = contentId);
	}

		/**
	 * @override
	 */
	createView(model) {

		const { isFetching, isPortrait, hasMinWidth, isOpen } = model;

		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return hasMinWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return isOpen ? 'is-open' : '';
		};

		const toggleTool = (id) => {
			if (this._toolId === id) {
				toggleToolContainer();
			}
			else {
				setContainerContent(id);
				openToolContainer();
			}
		};
		const toggleDrawTool = () => {
			const toolId = DrawToolContent.tag;
			toggleTool(toolId);
		};

		const toggleMeasureTool = () => {
			const toolId = MeasureToolContent.tag;
			toggleTool(toolId);
		};

		const toggleShareTool = () => {
			const toolId = ShareToolContent.tag;
			toggleTool(toolId);
		};

		const getAnimatedBorderClass = () => {
			return isFetching ? 'animated-action-button__border__running' : '';
		};

		const toggleMixerModule = () => {
			const toolId = MixerModuleContent.tag;
			toggleTool(toolId);
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>${css}</style>		
		<div class="${getOrientationClass()} "> 
			<ul class="ba-list">
			<li class="ba-list-item  ba-list-item__header">
				<span class="ba-list-item__text ">
				<span class="ba-list-item__primary-text">
					Zusatzfunktionen
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-mitmachboerse">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text" title=${translate('ea_menu_report_tooltip')}>
					${translate('ea_menu_report')}
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-recherche">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text" title=${translate('ea_menu_recherche_tooltip')}>
						${translate('ea_menu_recherche')}
				</span>
			</span>
		</li>
		<li class="ba-list-item" @click="${toggleMixerModule}" title=${translate('ea_menu_mixer_tooltip')}>
				<span class="ba-list-item__pre">
					<span class="ba-list-item__icon icon-mischpult">
					</span>
				</span>
				<span class="ba-list-item__text vertical-center">
					<span class="ba-list-item__primary-text">
						${translate('ea_menu_mixer')}
					</span>
				</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-3d_wind">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text" title=${translate('ea_menu_analyse3d_tooltip')}>
				${translate('ea_menu_analyse3d')}
				</span>
			</span>
		</li>
		<li class="ba-list-item">
			<span class="ba-list-item__pre">
				<span class="ba-list-item__icon icon-standortcheck">
				</span>
			</span>
			<span class="ba-list-item__text vertical-center">
				<span class="ba-list-item__primary-text" title=${translate('ea_menu_geotherm_tooltip')}>
				${translate('ea_menu_geotherm_short')}
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
