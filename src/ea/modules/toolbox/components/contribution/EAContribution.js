import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setTaggingMode } from '../../../../store/contribution/contribution.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import css from './eaContribution.css';
import validationCss from './validation.css';

const Update = 'update';
const Update_Field = 'update_field';
const Reset_Fields = 'reset_fields';

export class EAContribution extends AbstractMvuContentPanel {

	constructor() {
		super({
			isPortrait: false,
			hasMinWidth: false,
			validation: false,
			currentCategory: nothing,
			categoryFields: { },
			additionalInfo: '',
			email: ''
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService,
			ConfigService: configService
		}
			= $injector.inject('EnvironmentService', 'TranslationService', 'CoordinateService', 'ConfigService');

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;
		this._configService = configService;

		this._categories = {};
	}


	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update: {
				return {
					...model,
					...data
				};
			}

			case Update_Field: {
				const categoryFields = model.categoryFields;
				categoryFields[data.name] = data.value;

				return {
					...model,
					categoryFields
				};
			}

			case Reset_Fields:
				return {
					...model,
					categoryFields: {}
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

		const onClickTagButton = () => {
			const taggingActive = !model.tagging;
			setTaggingMode(taggingActive);
			this.shadowRoot.getElementById('coordinates').setCustomValidity('');
		};

		const onClickFindButton = () => {
			setCurrentModule(ResearchModuleContent.name);
		};

		const getCoordinatesString = () => {
			return model.position ? this._coordinateService.stringify(this._coordinateService.toLonLat(model.position), 4326, { digits: 5 }) : '';
		};

		const onSubmit = async (event) => {
			alert(JSON.stringify(model, null, 1));
			setTaggingMode(false);
			event.preventDefault();

			const url = this._configService.getValueAsPath('BACKEND_URL') + 'report/message';



			const json = {
				reportType: 'Börse',
				coordinates: getCoordinatesString(),
				additionalInfo: model.additionalInfo,
				email: model.email,
				category: model.currentCategory,
				categoryData: JSON.stringify(model.categoryFields, null, 1)
			};

			const request = await fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(json)
			});
			const response = await request.text();
			alert(response);
		};

		const createField = (name, optional, type = 'text') => {
			const label = optional ? name : name + '*';

			return html`
				<div id=${name} title=${name}>								
					<input placeholder=${label}  ?required=${!optional}  type=${type} name="${name}" .value="" 
						@change=${(e) => this.signal(Update_Field, { name: e.target.name, value: e.target.value })} >
				</div>
			`;
		};

		const onSelectionChanged = (e) => {
			this.signal(Update, { currentCategory: e.target.value });
			model.categoryFields = {};
			this.shadowRoot.querySelectorAll('.category-fields input').forEach(i => i.value = '');
		};

		const categoryFields = {};
		this._categories.forEach(e => {
			categoryFields[e['ee-name']] = e['ee-angaben'].map(e => createField(e.name, e.optional));
		});

		const tagButtonTitle = translate(model.tagging ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag_title');

		return html`
			<style>${css}</style>
			<style>${model.validation ? validationCss : nothing}</style>
			<div class="container">

				<div class='header'>Abwärmeinformations- und Solarflächenbörse</div>
				<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>

				<form id='boerse' action="#" @submit="${onSubmit}">

				<collapsable-content id='step1' title='1. Melden oder Suchen' .open=${true}>
					<div class="button-headers flex-container">
						<div class='button-space'></div>
					</div>
					<div class="button-container">
						<div class='mode-selection-column'>
							<div class='button-header'>Meldung neuer Einträge/ Korrektur bestehender Einträge</div>
							<div class='arrow-down'></div>
							<button id="tag" type='button' @click=${onClickTagButton} title=${tagButtonTitle}>
								${tagButtonTitle}
								<div class='tag-icon'></div>
								${translate('ea_contribution_button_tag_text')}
							</button>
						</div>
						<div class='mode-selection-column'>
							<div class='button-header'>Bestehende Einträge durchsuchen</div>
							<div class='arrow-down'></div>
							<button id="search" type='button' @click=${onClickFindButton} title=${translate('ea_contribution_button_find_title')}>
								${translate('ea_contribution_button_find_title')}
								<div class='search-icon'></div>
								${translate('ea_contribution_button_find_text')}
							</button>
						</div>
					</div>

					<br/>
					<div class="" title="${translate('ea_contribution_coordinates_text')}">
						<label for="coordinates">${translate('ea_contribution_coordinates_text')}</label>	
						<input id='coordinates' name='coordiantes' class="coordinates" 
							oninvalid="this.setCustomValidity('Bitte Standort markieren')"
							value=${getCoordinatesString()} required></input>
					</div>
				</collapsable-content>

				<collapsable-content id='step2' title='2. Melden: Auswahl der Kategorie' .open=${true}>
					<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}" required>
						<option value="" selected disabled>Bitte wählen ... </option>
						${this._categories.map(e => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
						<label for="category">Category</label>
					</select>
				</collapsable-content>

				<collapsable-content id='step3' .title=${'3. Melden: Angaben zu neuem Eintrag/zu bestehendem Eintrag'} .open=${true}>
					<p>Übersicht der notwendigen Angaben (Pflichtangaben mit * und in Fettdruck):</p>
					<div class='category-fields'>
						${categoryFields[model.currentCategory]}
					</div>

					<textarea placeholder="Zusätzlicher Text" id="textarea" name='additionalInfo' value=${model.description}
						@change=${(e) => this.signal(Update, { additionalInfo: e.target.value })}></textarea>

				</collapsable-content>

				<collapsable-content id='step4' title='4. Melden: Ihre E-Mail-Adresse' .open=${true}>
					<input placeholder='Ihre Email Adresse' required  type='email' name="email" 
						@change=${(e) => this.signal(Update, { email: e.target.value })}>
					
					<p>
						<br/>
						Wir behalten uns vor, Meldungen nicht zu übernehmen. Wir beachten die Vorschriften des 
						<a href="https://www.energieatlas.bayern.de/datenschutz" target='_blank'>Datenschutzes</a>.
					</p>
					<div class='form-buttons'>
						<button id="select" class="button" type='submit'
							.label=${translate('ea_contribution_button_send')}
							@click=${() => this.signal(Update, { validation: true })}>
							Send
						</button>
					</div>

				</collapsable-content>
				</form>
			
			</div>
		`;

	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	get categories() {
		return this._categories;
	}

	set categories(cat) {
		this._categories = cat;
	}

	static get name() {
		return 'contribution';
	}

	static get tag() {
		return 'ea-feature-contribution';
	}
}
