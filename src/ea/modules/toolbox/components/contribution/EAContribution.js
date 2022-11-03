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
			mode: 'energy-market',
			isPortrait: false,
			hasMinWidth: false,
			showInvalidFields: false,
			currentCategory: nothing,
			categoryFields: { },
			additionalInfo: '',
			email: '',
			categoriesSpecification: [],
			statusMessage: nothing
		});

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService,
			ConfigService: configService,
			HttpService: httpService
		}
			= $injector.inject(
				'EnvironmentService',
				'TranslationService',
				'CoordinateService',
				'ConfigService',
				'HttpService'
			);

		this._environmentService = environmentService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;
		this._configService = configService;
		this._httpService = httpService;
	}


	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update:
				return { ...model, ...data };

			case Update_Field: {
				const categoryFields = model.categoryFields;
				categoryFields[data.name] = data.value;

				return { ...model, categoryFields };
			}

			case Reset_Fields:
				return { ...model, categoryFields: {} };
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

		const completionMessage = html`
		<div id='completion-message'>
			<h2>Vielen Dank!</h2>
			<p>Ihre Meldung wurde erfolgreich versendet. Damit leisten Sie einen wertvollen Beitrag, die Datenbasis in unserem Portal fortlaufend zu verbessern.</p>
			<p>Nach Prüfung der Angaben werden wir das gemeldete Objekt oder die Korrektur übernehmen. Bei Rückfragen kommen wir auf Sie zu.</p>
			<p>Ihr Energie-Atlas Bayern-Team</p>
		</div>`;

		const failureMessage = html`
		<div id='failure-message'>
			<h2 class='error'>Bei der Verarbeitung ist ein Fehler aufgetreten</h2>
			<p>Bitte versuchen sie es zu einem späteren Zeitpunkt noch einmal</p>
		</div>`;



		const onSubmit = async (event) => {
			setTaggingMode(false);
			event.preventDefault();

			const url = this._configService.getValueAsPath('BACKEND_URL') + 'report/message';
			const fieldData = Object.entries(model.categoryFields).map(f => `${f[0]}: ${f[1]}`).join('\n');

			const json = {
				reportType: model.mode === 'energy-market' ? 'Börse' : 'Meldung',
				coordinates: getCoordinatesString(),
				additionalInfo: model.additionalInfo,
				email: model.email,
				category: model.currentCategory,
				categoryData: fieldData
			};

			const dataBody = JSON.stringify(json);
			const response = await this._httpService.post(url, dataBody, 'application/json');

			const statusMessage = response.status === 200 ? completionMessage : failureMessage;
			this.signal(Update, { statusMessage });
		};

		const createField = (name, optional, type = 'text') => {
			return html`
				<div id=${name} title=${name}>								
					<input placeholder=${name + (optional ? '' : '*')}  ?required=${!optional}  type=${type} name="${name}" .value="" 
						@input=${(e) => this.signal(Update_Field, { name: e.target.name, value: e.target.value })} >
				</div> `;
		};

		const onSelectionChanged = (e) => {
			this.signal(Update, { currentCategory: e.target.value });
			model.categoryFields = {};
			this.shadowRoot.querySelectorAll('.category-fields input').forEach(i => i.value = '');
		};

		const categoryFields = {};
		model.categoriesSpecification.forEach(e => {
			categoryFields[e['ee-name']] = e['ee-angaben'].map(e => createField(e.name, e.optional));
		});

		const introduction = model.mode === 'energy-market' ?
			html`<div class='header'>Abwärmeinformations- und Solarflächenbörse</div>
				<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>` :
			html`<div class='header'>Neumeldungen und Korrekturen</div>
				<p>Melden Sie bisher nicht dargestellte Objekte (z. B. EEG-Anlagen, Wärmenetze) und ergänzen oder korrigieren Sie Angaben zu bestehenden Objekten.</p>`;

		const energyMarketMode = model.mode === 'energy-market';
		const prefix = energyMarketMode ? 'Melden' : 'Neumeldung und Korrektur';
		const step1 = energyMarketMode ? 'Melden oder Suchen' : `${prefix}: Standort des Objektes markieren`;

		const buttonHeaders = energyMarketMode ?
			html`<div class='button-header'>Meldung neuer Einträge/ Korrektur bestehender Einträge</div>
				<div class='button-header'>Bestehende Einträge durchsuchen</div>
				<div class='arrow-down'></div>
				<div class='arrow-down'></div>` :
			'';
		const findButton = energyMarketMode ?
			html`<button id="search" type='button' @click=${onClickFindButton} title=${translate('ea_contribution_button_find_tooltip')}>
				${translate('ea_contribution_button_find_title')}
				<div class='search-icon'></div>
				<span class='subtext'>${translate('ea_contribution_button_find_text')}</span>
			</button>` :
			'';

		const form = html`
			<form id='report' action="#" @submit="${onSubmit}">

				${introduction}

				<collapsable-content id='step1' title='1. ${step1}' .open=${true}>
					<div class='button-container'>
							${buttonHeaders}
							<button id="tag" type='button' @click=${onClickTagButton} title=${translate('ea_contribution_button_tag_tooltip')}>
								${translate(model.tagging ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag_title')}
								<div class='tag-icon'></div>
								<span class='subtext'>${translate('ea_contribution_button_tag_text')}</span>
							</button>
							${findButton}
					</div>

					<br/>
					<div title=${translate(model.tagging ? 'ea_contribution_coordinates_tooltip_2' : 'ea_contribution_coordinates_tooltip_1')}>
						<label for="coordinates">${translate('ea_contribution_coordinates_text')}</label>	
						<input id='coordinates' name='coordiantes' class="coordinates" 
							oninvalid="this.setCustomValidity('Bitte Standort markieren')"
							placeholder=${translate('ea_contribution_coordinates_placeholder')}
							value=${getCoordinatesString()} required></input>
					</div>
				</collapsable-content>

				<collapsable-content id='step2' title='2. ${prefix}: Auswahl der Kategorie' .open=${true}>
					<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}" required>
						<option value="" selected disabled>Bitte wählen ... </option>
						${model.categoriesSpecification.map(e => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
						<label for="category">Category</label>
					</select>
				</collapsable-content>

				<collapsable-content id='step3' .title='3. ${prefix}: Angaben zu neuem Eintrag/zu bestehendem Eintrag'} .open=${true}>
					<p>Übersicht der notwendigen Angaben (Pflichtangaben mit * und in Fettdruck):</p>
					<div class='category-fields'>
						${categoryFields[model.currentCategory]}
					</div>

					<textarea placeholder="Zusätzlicher Text" id="additional-info" name='additionalInfo' value=${model.description}
						@input=${(e) => this.signal(Update, { additionalInfo: e.target.value })}></textarea>

				</collapsable-content>

				<collapsable-content id='step4' title='4. ${prefix}: Ihre E-Mail-Adresse' .open=${true}>
					<input id='email' placeholder='Ihre Email Adresse' required  type='email' name="email" 
						@input=${(e) => this.signal(Update, { email: e.target.value })}>
					
					<p>
						<br/>
						Wir behalten uns vor, Meldungen nicht zu übernehmen. Wir beachten die Vorschriften des 
						<a href="https://www.energieatlas.bayern.de/datenschutz" target='_blank'>Datenschutzes</a>.
					</p>
					<div class='form-buttons'>
						<button id="send" class="button" type='submit'
							.label=${translate('ea_contribution_button_send')}
							@click=${() => this.signal(Update, { showInvalidFields: true })}>
							Senden
						</button>
					</div>

				</collapsable-content>
			</form>`;

		return html`
			<style>${css}</style>
			<style>${model.showInvalidFields ? validationCss : nothing}</style>
			<div class="container">

				<slot name='introduction'></slot>

				${model.statusMessage !== nothing ? model.statusMessage : form}
			
			</div>
		`;

	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	get categories() {
		return this.getModel().categoriesSpecification;
	}

	set categories(cat) {
		this.signal(Update, { categoriesSpecification: cat });
	}

	get mode() {
		return this.getModel().mode;
	}

	set mode(m) {
		this.signal(Update, { mode: m });
	}

	static get name() {
		return 'contribution';
	}

	static get tag() {
		return 'ea-feature-contribution';
	}
}
