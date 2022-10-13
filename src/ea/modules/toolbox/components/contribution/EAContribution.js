import { html, nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setDescription, setTaggingMode } from '../../../../store/contribution/contribution.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import css from './eaContribution.css';

const Update = 'update';

const SAMPLE_DATA = { 'boerse': [
	{
		'ee-name': 'Test1',
		'ee-angaben': [{ 'name': 'name1', optional: true }]
	},
	{ 'ee-name': 'Solarflächenbörse:Dachflächen',
		'ee-angaben': [
			{ 'name': 'Ansprechpartner', 'optional': false },
			{ 'name': 'Ansprechpartner E-Mail', 'optional': false },
			{ 'name': 'Ansprechpartner Telefon', 'optional': false },
			{ 'name': 'Nutzbare Dachfläche', 'optional': false },
			{ 'name': 'Dachneigung (°)', 'optional': false },
			{ 'name': 'Dachausrichtung (Süd/West/...)', 'optional': false },
			{ 'name': 'Bezeichnung der Fläche', 'optional': true },
			{ 'name': 'Gebäudeeigentümer', 'optional': true },
			{ 'name': 'Aktuelle Nutzung', 'optional': true },
			{ 'name': 'Jahr der Errichtung bzw. letzten ...', 'optional': true },
			{ 'name': 'Dachmaterial', 'optional': true },
			{ 'name': 'Stand', 'optional': true }] }] };

export class EAContribution extends AbstractMvuContentPanel {

	constructor() {
		super({
			description: '',
			isPortrait: false,
			hasMinWidth: false,
			active: false
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService
		}
			= $injector.inject('EnvironmentService', 'TranslationService', 'CoordinateService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;

		this.currentCategory = nothing;
		this.result = {};
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
		this.observe(state => state.contribution, data => this.signal(Update, data));
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);


		const onChangeDescription = (e) => {
			setDescription(e.target.value);
		};


		const onClickTagButton = () => {

			const taggingActive = !model.tagging;
			setTaggingMode(taggingActive);
		};


		const onClickResearchButton = () => {
			setCurrentModule(ResearchModuleContent.name);
		};


		const onClickFinish = () => {
			alert(JSON.stringify(this.result));
			setTaggingMode(false);
		};

		const getCoordinatesString = () => {
			return model.position ? this._coordinateService.stringify(this._coordinateService.toLonLat(model.position), 4326, { digits: 5 }) : '';
		};

		const onChangeTextField = (event) => {
			this.result[event.target.name] = event.target.value;
		};

		const createField = (name, optional) => {
			const clazz = optional ? 'optional' : 'required';
			const label = optional ? name : name + '*';

			return html`
				<div class="fieldset invalid" title="${translate('toolbox_drawTool_style_text')}"">								
					<input class='${classMap({ required: !optional })}' required="${optional ? '' : 'required'}"  type="text" id="style_text" name="${name}" .value="" @change=${onChangeTextField} >
					<label for="style_text" class="${clazz} control-label">${label}</label><i class="bar"></i>
				</div>
			`;
		};

		const onSelectionChanged = (e) => {
			this.currentCategory = e.target.value;
			this.render();
		};

		const categorySpecs = SAMPLE_DATA.boerse.find(e => e['ee-name'] === this.currentCategory);
		let entries = html``;
		if (categorySpecs) {
			entries = categorySpecs['ee-angaben'].map(e => createField(e.name, e.optional));
		}


		return html`
			<style>${css}</style>
			<div class="container">
				<div class='header'>Abwärmeinformations- und Solarflächenbörse</div>
				<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>

				<collapsable-content .title=${'1. Melden oder Suchen'} .open=${true}>
					<ba-button id="tag" 
						class="button" 
						.label=${translate(model.tagging ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag')}
						@click=${onClickTagButton}></ba-button>
					<ba-button id="search" 
						class="button" 
						.label=${translate('ea_contribution_button_find')}
						@click=${onClickResearchButton}></ba-button>

					<div class="coordinates-container" title="${translate('ea_contribution_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribution_coordinates_text')}</label>	
						<div name='coordiantes' class="coordinates">${getCoordinatesString()}</div>
					</div>
				</collapsable-content>

				<collapsable-content .title=${ '2. Melden: Auswahl der Kategorie'} .open=${true}>
					<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}">
						${SAMPLE_DATA.boerse.map(e => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
						<label for="category">Category</label>
					</select>
				</collapsable-content>

				<collapsable-content .title=${'3. Melden: Angaben zu neuem Eintrag/zu bestehendem Eintrag'} .open=${true}>
					${entries}
					<div  class="fieldset">						
						<textarea  required="required"  id="textarea-foo" name='additionalInfo' @change=${onChangeTextField}></textarea>
						<label for="textarea-foo" class="control-label">${translate('ea_contribution_additional_input')}</label><i class="bar"></i>
					</div>	
				</collapsable-content>

				<collapsable-content .title=${'4. Melden: Ihre E-Mail-Adresse'} .open=${true}>
					${createField('Ihre Email Addresse', false)}
				</collapsable-content>

				<ba-button id="select" class="button" 
					.label=${translate('ea_contribution_button_finish')}
					@click=${onClickFinish}></ba-button>
				
			</div>
		`;

	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get name() {
		return 'contribution';
	}

	static get tag() {
		return 'ea-feature-contribution';
	}
}
