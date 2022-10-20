import { html, nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setDescription, setTaggingMode } from '../../../../store/contribution/contribution.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import css from './eaContribution.css';

const Update = 'update';
const Update_Category = 'update_category';
const Update_UserInput = 'update_user_input';
const Reset_UserInput = 'reset_user_input';

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
			currentCategory: nothing,
			result: { }
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

			case Update_Category:
				return {
					...model,
					currentCategory: data
				};

			case Update_UserInput: {
				const result = model.result;
				result[data.name] = data.value;

				return {
					...model,
					result
				};
			}

			case Reset_UserInput:
				return {
					...model,
					result: {}
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


		const onClickSend = () => {
			alert(JSON.stringify(model.result, null, 1));
			setTaggingMode(false);
		};

		const getCoordinatesString = () => {
			return model.position ? this._coordinateService.stringify(this._coordinateService.toLonLat(model.position), 4326, { digits: 5 }) : '';
		};

		const onChangeTextField = (event) => {
			this.signal(Update_UserInput, { name: event.target.name, value: event.target.value });
		};

		const createField = (name, optional) => {
			const clazz = optional ? 'optional' : 'required';
			const label = optional ? name : name + '*';

			return html`
				<div id=${name} class="fieldset invalid" title="${translate('toolbox_drawTool_style_text')}"">								
					<input class='${classMap({ required: !optional })}' required="${optional ? '' : 'required'}"  type="text" id="style_text" name="${name}" .value="" @change=${onChangeTextField} >
					<label for="style_text" class="${clazz} control-label">${label}</label><i class="bar"></i>
				</div>
			`;
		};

		const onSelectionChanged = (e) => {
			this.shadowRoot.getElementById('category-fields').reset();
			this.signal(Reset_UserInput);
			this.signal(Update_Category, e.target.value);
		};

		const categoryFields = {};
		SAMPLE_DATA.boerse.forEach(e => {
			categoryFields[e['ee-name']] = e['ee-angaben'].map(e => createField(e.name, e.optional));
		});

		const tagButtonTitle = translate(model.tagging ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag_title');

		return html`
			<style>${css}</style>
			<div class="container">
				
				<div class='header'>Abwärmeinformations- und Solarflächenbörse</div>
				<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>

				<collapsable-content id='step1' .title=${'1. Melden oder Suchen'} .open=${true}>
					<div class="button-headers flex-container">
						<div class='button-space'></div>
					</div>
					<div class="button-container">
						<div style='width: 50%;'>
							<div class='button-header'>Meldung neuer Einträge/ Korrektur bestehender Einträge</div>
							<div class='arrow-down'></div>
							<button id="tag" @click=${onClickTagButton} title=${tagButtonTitle}>
								${tagButtonTitle}
								<div class='tag-icon'></div>
								${translate('ea_contribution_button_tag_text')}
							</button>
						</div>
						<div class='button-space'></div>
						<div style='width: 50%;'>
							<div class='button-header'>Bestehende Einträge durchsuchen</div>
							<div class='arrow-down'></div>
							<button id="search" @click=${onClickResearchButton} title=${translate('ea_contribution_button_find')}>
								${translate('ea_contribution_button_find_title')}
								<div class='search-icon'></div>
								${translate('ea_contribution_button_find_text')}
							</button>
						</div>
					</div>

					<div class="" title="${translate('ea_contribution_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribution_coordinates_text')}</label>	
						<input name='coordiantes' class="coordinates" value=${getCoordinatesString()} readonly></input>
					</div>
				</collapsable-content>

				<collapsable-content id='step2' .title=${ '2. Melden: Auswahl der Kategorie'} .open=${true}>
					<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}">
						<option selected disabled>Bitte wählen ... </option>
						${SAMPLE_DATA.boerse.map(e => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
						<label for="category">Category</label>
					</select>
				</collapsable-content>

				<collapsable-content id='step3' .title=${'3. Melden: Angaben zu neuem Eintrag/zu bestehendem Eintrag'} .open=${true}>
					<p>Übersicht der notwendigen Angaben (Pflichtangaben mit * und in Fettdruck):</p>
					<form id='category-fields'>
						${categoryFields[model.currentCategory]}
					</form>

					<div  class="fieldset">						
						<textarea  required="required"  id="textarea" name='additionalInfo' value=${model.description} @change=${onChangeDescription}></textarea>
						<label for="textarea-foo" class="control-label">${translate('ea_contribution_additional_input')}</label><i class="bar"></i>
					</div>	

				</collapsable-content>

				<collapsable-content id='step4' .title=${'4. Melden: Ihre E-Mail-Adresse'} .open=${true}>
					${createField('Ihre Email Addresse', false)}
					
					<p>
						<br/>
						Wir behalten uns vor, Meldungen nicht zu übernehmen. Wir beachten die Vorschriften des 
						<a href="https://www.energieatlas.bayern.de/datenschutz" target='_blank'>Datenschutzes</a>.
					</p>

					<ba-button id="select" class="button" 
						.label=${translate('ea_contribution_button_send')}
						@click=${onClickSend}></ba-button>

				</collapsable-content>

			
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
