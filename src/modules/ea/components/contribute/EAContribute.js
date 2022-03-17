import { html } from 'lit-html';
import { $injector } from '../../../../injection';
import { setDescription, setLocation, setTaggingMode } from '../../../../store/ea/contribute/contribute.action';
import { addLayer } from '../../../../store/layers/layers.action';
import { CONTRIBUTION_LAYER_ID } from '../../../map/components/olMap/handler/contribution/OlContributionHandler';
import { MvuElement } from '../../../MvuElement';
import closeIcon from './assets/x-square.svg';
import css from './eaContribute.css';


const Update = 'update';

export class EAContribute extends MvuElement {

	constructor() {
		super({
			description: "",
			isPortrait: false,
			hasMinWidth: false,
			active: false
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService,
		}
			= $injector.inject('EnvironmentService', 'TranslationService', 'CoordinateService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;
	}


	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update:
				return {
					...model,
					...data
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

		const getStore = () => {
			const { StoreService: storeService } = $injector.inject('StoreService');
			return storeService.getStore();
		};

		const onClickTagButton = () => {
			setTaggingMode(true);
		};

		const onClickSetLocationButton = () => {
			addLayer(CONTRIBUTION_LAYER_ID, { label: "contribution_layer", constraints: { hidden: true, alwaysTop: false } });

			const state = getStore().getState();
			setLocation(state.position.center);
		};

		const getCoordinatesString = () => {
			return model.position ? model.position[0] + " " + model.position[1] : '';
		};

		if (!model.active)
			return null;

		return html`
			<style>${css}</style>		
			<div class="tool-container"> 			
				<div class="tool-container__content is-open" id='container'>    
					<div class="tool-container__tools-nav">                         
						<ba-icon class='tool-container__close-button' .icon='${closeIcon}' .size=${1.5} .color=${'var(--text2)'} .color_hover=${'var(--text2)'} @click=${close}>						
                	</div>
					<div class="tool-container__style_desc" title="${translate('ea_contribute_desc')}">
						<label for="description">${translate('ea_contribute_desc')}</label>	
						<textarea id="description" name="${translate('ea_contribute_desc')}" .value=${description} @input=${onChangeDescription}></textarea>
					</div>	
					<div class="tool-container__style_desc" title="${translate('ea_contribute_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribute_coordinates_text')}</label>	
						<div id='coordinates'>${getCoordinatesString()}</div>
					</div>
					<ba-button id="tag" 
						class="tool-container__button" 
						.label=${translate('ea_contribute_button_tag')}
						@click=${onClickTagButton}></ba-button>
					<ba-button id="select" 
						class="tool-container__button" 
						.label=${translate('ea_contribute_button_select')}
						@click=${onClickSetLocationButton}></ba-button>
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
