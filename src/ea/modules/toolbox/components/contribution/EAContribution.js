import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setTaggingMode } from '../../../../store/contribution/contribution.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import { MODUS } from './ContributionModus';
import css from './eaContribution.css';
import validationCss from './validation.css';

const Update = 'update';
const Update_Field = 'update_field';
const Reset_Fields = 'reset_fields';


export class EAContribution extends AbstractMvuContentPanel {

	constructor() {
		super({
			mode: nothing,
			isPortrait: false,
			hasMinWidth: false,
			showInvalidFields: false,
			currentCategory: nothing,
			categoryFields: { },
			additionalInfo: '',
			email: '',
			categoriesSpecification: [],
			statusMessage: nothing,
			openSections: ['step1']
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
		this.observe(state => state.contribution.position,
			() => {
				this.signal(Update, { openSections: 'step2' });
				setTaggingMode(false);
			}, false
		);
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const onClickTagButton = (mode) => () => {
			setTaggingMode(true);
			this.shadowRoot.getElementById('coordinates').setCustomValidity('');
			this.signal(Update, { mode });
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
				reportType: model.mode,
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
			this.signal(Update, { openSections: 'step3' });
		};

		const categoryFields = {};
		model.categoriesSpecification.forEach(e => {
			categoryFields[e['ee-name']] = e['ee-angaben'].map(e => createField(e.name, e.optional));
		});

		const energyMarketMode = model.mode === MODUS.market;
		const isCorrection = model.mode === MODUS.correction;

		const introduction = energyMarketMode ?
			html`<p>Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die Daten-Recherche.</p>` :
			html`<p>Melden Sie bisher nicht dargestellte Objekte (z. B. EEG-Anlagen, Wärmenetze) und ergänzen oder korrigieren Sie Angaben zu bestehenden Objekten.</p>`;

		const buttonHeaders = energyMarketMode ?
			html`<div class='button-header'>Meldung neuer Einträge/ Korrektur bestehender Einträge</div>
				<div class='button-header'>Bestehende Einträge durchsuchen</div>
				<div class='arrow-down'></div>
				<div class='arrow-down'></div>` :
			'';
		const secondButton = energyMarketMode ?
			html`<button id="search" type='button' @click=${onClickFindButton} title=${translate('ea_contribution_button_find_tooltip')}>
				${translate('ea_contribution_button_find_title')}
				<div class='search-icon'></div>
				<span class='subtext'>${translate('ea_contribution_button_find_text')}</span>
			</button>` :
			html`<button id="correction" type='button' @click=${onClickTagButton(MODUS.correction)} title=${translate('ea_contribution_button_correction_tooltip')}>
					${translate(model.tagging && isCorrection ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_correction_title')}
					<div class='tag-icon'></div>
					<span class='subtext'>${translate('ea_contribution_button_tag_text')}</span>
				</button>`;

		const onToggle = (e) => {
			this.signal(Update, { openSections: [e.target.id] });
		};


		const onClickSendButton = () => {
			const form = this.shadowRoot.getElementById('report');
			if (!form.reportValidity()) {
				this.signal(Update, { openSections: ['step1', 'step2', 'step3', 'step4'], showInvalidFields: true });
			}
		};


		const step1Title = model.mode === nothing ?
			html`1. Standort des Objektes markieren` :
			html`1. Standort des Objektes markieren: <span style="font-style: italic">${model.mode}</span>`;
		const step2Title = model.currentCategory === nothing ?
			html`2. Auswahl der Kategorie` :
			html`2. Auswahl der Kategorie: <span style="font-style: italic">${model.currentCategory}</span>`;

		const form = html`
			<form id='report' action="#" @submit="${onSubmit}">

				${introduction}

				<collapsable-content id='step1' .title='${step1Title}' .open=${model.openSections.includes('step1')} @toggle=${onToggle}>
					<div class='button-container'>
							${buttonHeaders}
							<button id="tag" type='button' @click=${onClickTagButton(MODUS.report)} title=${translate('ea_contribution_button_tag_tooltip')}>
								${translate(model.tagging && !isCorrection ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag_title')}
								<div class='tag-icon'></div>
								<span class='subtext'>${translate('ea_contribution_button_tag_text')}</span>
							</button>
							${secondButton}
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

				<collapsable-content id='step2' .title='${step2Title}' .open=${model.openSections.includes('step2')} @toggle=${onToggle} >
					<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}" required>
						<option value="" selected disabled>Bitte wählen ... </option>
						${model.categoriesSpecification.map(e => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
						<label for="category">Category</label>
					</select>
				</collapsable-content>

				<collapsable-content id='step3' title='3. Angaben zum Objekt' .open=${model.openSections.includes('step3')} @toggle=${onToggle}>
					<p>Übersicht der notwendigen Angaben (Pflichtangaben mit * und in Fettdruck):</p>

${isCorrection ? '' :
		html`<div class='category-fields'>
			${categoryFields[model.currentCategory]}
		</div>`
}

					<textarea placeholder=${isCorrection ? 'Bitte hier Korrektur eintragen*' : 'Zusätzliche Information'} 
						id="additional-info" name='additionalInfo' value=${model.description} ?required=${model.isCorrection}
						@input=${(e) => this.signal(Update, { additionalInfo: e.target.value })}></textarea>

				</collapsable-content>

				<collapsable-content id='step4' title='4. Meldung absenden' .open=${model.openSections.includes('step4')} @toggle=${onToggle}>
					<input id='email' placeholder='Ihre E-Mail-Adresse' required  type='email' name="email" 
						@input=${(e) => this.signal(Update, { email: e.target.value })}>
					
					<p>
						<br/>
						Wir behalten uns vor, Meldungen nicht zu übernehmen. Wir beachten die Vorschriften des 
						<a href="https://www.energieatlas.bayern.de/datenschutz" target='_blank'>Datenschutzes</a>.
					</p>
					<div class='form-buttons'>
						<button id="send" class="button" type='submit'
							.label=${translate('ea_contribution_button_send')}
							@click=${onClickSendButton}>
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
