import { html, nothing } from 'lit-html';
import { $injector } from '../../../../injection';
import css from './eaContribute.css';
import { setDescription } from '../../../../store/ea/contribute/contribute.action';
import closeIcon from './assets/x-square.svg';
import { MvuElement } from '../../../MvuElement';
import { setType } from '../../../../store/draw/draw.action';


const Update = 'update';

export class EAContribute extends MvuElement {

	constructor() {
		super({
			description: "",
			isPortrait: false,
			hasMinWidth: false,
			toolId: null
		});

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
	update(type, data, model) {
		switch (type) {
			case Update:
				return {
					...model,
					description: data.description
				};
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		// this.observe(state => state.media, media => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth }));

		// this.observe(state => state.tools.current, current => this.signal(Update_ToolId, current));
		this.observe(state => state.contribute, data => this.signal(Update, data));
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const { description } = model;

		const close = () => {
		};

		const onChangeDescription = (e) => {
			setDescription(e.target.value);
		};

		const getOrientationClass = () => {
			// TODO
			//			return isPortrait ? 'is-portrait' : 'is-landscape';
			return 'is-landscape';
		};

		const getMinWidthClass = () => {
			// TODO
			//return hasMinWidth ? 'is-desktop' : 'is-tablet';
			return 'is-desktop';
		};

		const onClickMarkButton = () => {
			//setType('marker');
		};

		return html`
			<style>${css}</style>		
			<div class=" ${getOrientationClass()} ${getMinWidthClass()}">  	
			<div class="tool-container"> 			
				<div class="tool-container__content is-open">    
					<div class="tool-container__tools-nav">                         
						<ba-icon class='tool-container__close-button' .icon='${closeIcon}' .size=${1.5} .color=${'var(--text2)'} .color_hover=${'var(--text2)'} @click=${close}>						
                	</div>
					
					<div class="tool-container__style_desc" title="${translate('ea_contribute_desc')}">
						<label for="style_desc">${translate('ea_contribute_desc')}</label>	
						<textarea id="style_desc" name="${translate('ea_contribute_desc')}" .value=${description} @input=${onChangeDescription}></textarea>
					</div>	
					<div class="tool-container__style_desc" title="${translate('ea_contribute_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribute_coordinates_text')}</label>	
						<ba-coordinate-select id="coordinates"></ba-coordinate-select>
					</div>
					<ba-button id="mark" 
						class="tool-container__button" 
						.label=${translate('ea_contribute_button_mark')}
						@click=${onClickMarkButton}></ba-button>
				</div>
			</div>		
			</div>		
		`;

	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get tag() {
		return 'ea-feature-contribute';
	}
}
