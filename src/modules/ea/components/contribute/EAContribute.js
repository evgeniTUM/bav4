import { html } from 'lit-html';
import { $injector } from '../../../../injection';
import { setDescription, setLocation, setTaggingMode } from '../../../../store/ea/contribute/contribute.action';
import { addLayer, removeLayer } from '../../../../store/layers/layers.action';
import { CONTRIBUTION_LAYER_ID } from '../../../map/components/olMap/handler/contribution/OlContributionHandler';
import { MvuElement } from '../../../MvuElement';
import closeIcon from './assets/x-square.svg';
import css from './eaContribute.css';
import proj4 from 'proj4';

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
		this.observe(state => state.contribute, data => this.signal(Update, data));
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const close = () => {
		};

		const onChangeDescription = (e) => {
			setDescription(e.target.value);
		};


		const onClickTagButton = () => {

			const taggingActive = !model.tagging;
			setTaggingMode(taggingActive);

			if (taggingActive)
				addLayer(CONTRIBUTION_LAYER_ID, { label: "contribution_layer", constraints: { hidden: true, alwaysTop: false } });
			else
				removeLayer(CONTRIBUTION_LAYER_ID);
		};


		const onClickFinish = () => {
			alert(JSON.stringify(model));
		}

		const getCoordinatesString = () => {
			return model.position ? this._coordinateService.stringify(this._coordinateService.toLonLat(model.position), 4326, { digits: 5}) : '';
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
						<textarea id="description" name="${translate('ea_contribute_desc')}" .value=${model.description} @input=${onChangeDescription}></textarea>
					</div>	
					<div class="tool-container__style_desc" title="${translate('ea_contribute_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribute_coordinates_text')}</label>	
						<div id='coordinates'>${getCoordinatesString()}</div>
					</div>
					<ba-button id="tag" 
						class="tool-container__button" 
						.label=${translate(model.tagging ? 'ea_contribute_button_tag_cancel' : 'ea_contribute_button_tag')}
						@click=${onClickTagButton}></ba-button>
					<ba-button id="select" 
						class="tool-container__button" 
						.label=${translate('ea_contribute_button_finish')}
						@click=${onClickFinish}></ba-button>
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
