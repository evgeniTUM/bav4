import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setLocation, setTaggingMode } from '../../../../store/locationSelection/locationSelection.action';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import { MODUS } from './ContributionModus';
import css from './eaContribution.css';
import collapsableContentCss from './collapsableContent.css';
import validationCss from './validation.css';
import { GlobalCoordinateRepresentations } from '../../../../../domain/coordinateRepresentation';

const Update = 'update';
const Reset = 'reset';
const Update_Field = 'update_field';
const Reset_Fields = 'reset_fields';
const Position_Change = 'position_change';

const initialModel = {
	mode: undefined,
	isPortrait: false,
	hasMinWidth: false,
	showInvalidFields: false,
	currentCategory: undefined,
	position: undefined,
	categoryFields: {},
	additionalInfo: '',
	email: '',
	categoriesSpecification: [],
	statusMessage: undefined,
	openSections: ['step1']
};

export class EAContribution extends AbstractMvuContentPanel {
	constructor() {
		super(initialModel);

		const {
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService,
			ConfigService: configService,
			HttpService: httpService
		} = $injector.inject('EnvironmentService', 'TranslationService', 'CoordinateService', 'ConfigService', 'HttpService');

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
			case Reset:
				return { ...initialModel, ...data };

			case Update: {
				if (data.openSections) {
					setTaggingMode(data.openSections.includes('step2'));
				}

				const modeButtons = this.shadowRoot.getElementById('mode-validation-element');
				if (modeButtons) modeButtons.setCustomValidity(data.mode || model.mode ? '' : 'Bitte Modus auswählen');

				const locationButton = this.shadowRoot.getElementById('location-validation-element');
				if (locationButton) locationButton.setCustomValidity(model.position !== null ? '' : 'Bitte Standort auswählen');

				return { ...model, ...data };
			}

			case Update_Field: {
				const categoryFields = model.categoryFields;
				categoryFields[data.name] = data.value;

				return { ...model, categoryFields };
			}

			case Reset_Fields:
				return { ...model, categoryFields: {} };

			case Position_Change: {
				if (data) {
					setTimeout(() => setTaggingMode(false), 500);

					return { ...model, position: data, openSections: ['step3'] };
				}

				return model;
			}
		}
	}

	reset() {
		this.signal(Reset, {
			mode: this.getModel().energyMarketMode ? MODUS.market : undefined,
			categoriesSpecification: this.getModel().categoriesSpecification
		});
		setLocation(null);
		setTaggingMode(false);
	}

	/**
	 * @override
	 */
	onDisconnect() {
		this.reset();
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(
			(state) => state.contribution.position,
			(data) => this.signal(Position_Change, data),
			false
		);
		this.observe(
			(state) => state.contribution,
			(data) => this.signal(Update, data)
		);
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const onClickNewButton = (mode) => () => {
			this.signal(Update, { mode, openSections: ['step2'] });
		};

		const onClickFindButton = () => {
			setCurrentModule(ResearchModuleContent.name);
		};

		const getCoordinatesString = () => {
			return model.position ? this._coordinateService.stringify(model.position, GlobalCoordinateRepresentations.WGS84, { digits: 5 }) : '';
		};

		const completionMessage = html` <div id="completion-message">
			<h2>Vielen Dank!</h2>
			<p>
				Ihre Meldung wurde erfolgreich versendet. Damit leisten Sie einen wertvollen Beitrag, die Datenbasis in unserem Portal fortlaufend zu
				verbessern.
			</p>
			<p>Nach Prüfung der Angaben werden wir das gemeldete Objekt oder die Korrektur übernehmen. Bei Rückfragen kommen wir auf Sie zu.</p>
			<p>Ihr Energie-Atlas Bayern-Team</p>
		</div>`;

		const failureMessage = html` <div id="failure-message">
			<h2 class="error">Bei der Verarbeitung ist ein Fehler aufgetreten</h2>
			<p>Bitte versuchen sie es zu einem späteren Zeitpunkt noch einmal</p>
		</div>`;

		const submit = async () => {
			setTaggingMode(false);

			const url = this._configService.getValueAsPath('BACKEND_URL') + 'report/message';
			const fieldData = Object.entries(model.categoryFields)
				.map((f) => `${f[0]}: ${f[1]}`)
				.join('\n');

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
					<input
						class=${optional ? '' : 'mandatory'}
						placeholder=${name + (optional ? '' : '*')}
						?required=${!optional}
						type=${type}
						name="${name}"
						.value=""
						@input=${(e) => this.signal(Update_Field, { name: e.target.name, value: e.target.value })}
					/>
				</div>
			`;
		};

		const onSelectionChanged = (e) => {
			this.signal(Update, { currentCategory: e.target.value, categoryFields: {} });
			model.categoryFields = {};
			this.shadowRoot.querySelectorAll('.category-fields input').forEach((i) => (i.value = ''));
			this.signal(Update, { openSections: ['step4'] });
		};

		const categoryFields = {};
		model.categoriesSpecification.forEach((e) => {
			categoryFields[e['ee-name']] = e['ee-angaben'].map((e) => createField(e.name, e.optional));
		});

		const energyMarketMode = model.mode === MODUS.market;
		const isCorrection = model.mode === MODUS.correction;

		const introduction = energyMarketMode
			? html`<div class="introduction">
					Melden Sie Abwärmequellen/-senken oder Dach-/Freiflächen zur PV-Nutzung. Die Suche nach Einträgen in den Börsen erfolgt über die
					Daten-Recherche.
			  </div>`
			: html`<div class="introduction">
					Melden Sie bisher nicht dargestellte Objekte (z. B. EEG-Anlagen, Wärmenetze) und ergänzen oder korrigieren Sie Angaben zu bestehenden
					Objekten.
			  </div>`;

		const buttonHeaders = energyMarketMode
			? html`<div class="button-header">Meldung neuer Einträge</div>
					<div class="button-header">Bestehende Einträge durchsuchen</div>
					<div class="arrow-down"></div>
					<div class="arrow-down"></div>`
			: '';

		const firstButtonClass = model.mode ? (energyMarketMode || !isCorrection ? 'active' : 'inactive') : 'unselected';
		const secondButtonClass = model.mode ? (energyMarketMode || isCorrection ? 'active' : 'inactive') : 'unselected';

		const firstButton = html`
			<button
				id="new"
				type="button"
				class=${firstButtonClass}
				@click=${onClickNewButton(energyMarketMode ? MODUS.market : MODUS.report)}
				title=${translate('ea_contribution_button_tag_tooltip')}
			>
				<div class="button-icon tag-icon"></div>
				${translate('ea_contribution_button_tag_title')}
			</button>
		`;
		const secondButton = energyMarketMode
			? html`<button
					id="search"
					type="button"
					class="unselected"
					@click=${onClickFindButton}
					title=${translate('ea_contribution_button_find_tooltip')}
			  >
					<div class="button-icon search-icon"></div>
					${translate('ea_contribution_button_find_title')}
			  </button>`
			: html`<button
					id="correction"
					type="button"
					class=${secondButtonClass}
					@click=${onClickNewButton(MODUS.correction)}
					title=${translate('ea_contribution_button_correction_tooltip')}
			  >
					<div class="button-icon correction-icon"></div>
					${translate('ea_contribution_button_correction_title')}
			  </button>`;

		const onToggle = (e) => {
			this.signal(Update, { openSections: [e.target.id] });
		};

		const onClickSendButton = () => {
			const form = this.shadowRoot.getElementById('report');
			if (!form.checkValidity()) {
				this.signal(Update, { openSections: ['step1', 'step2', 'step3', 'step4', 'step5'], showInvalidFields: true });
				form.reportValidity();
			} else {
				submit();
			}
		};

		const stepTitle = (text, subtext) =>
			html` <span style="color: var(--primary-color)">${text}${subtext ? ':' : ''}</span>
				<span style="font-style: italic">${subtext}</span>`;

		const form = html`
			<form id='report' class='form-content' action="#">

				<div>
					${introduction}

					<div class='step'>
					<collapsable-content id='step1' .customCSS=${collapsableContentCss}
						.title=${stepTitle('1. Modus auswählen', model.mode)}
						.open=${model.openSections.includes('step1')} @toggle=${onToggle}>
						<div class='arrow-container'>
							${buttonHeaders}
						</div>

						<input class='mode-validation-element' id='mode-validation-element'></input>

						<div class='button-container'>
								${firstButton}
								${secondButton}
						</div>

						<br/>
					</collapsable-content>
					</div>

					<div class='step'>
					<collapsable-content id='step2' .customCSS=${collapsableContentCss}
						.title=${stepTitle('2. Standort des Objektes markieren', getCoordinatesString(model.position))}
						.open=${model.openSections.includes('step2')} @toggle=${onToggle}>
						<div>
								<input class='mode-validation-element' id='location-validation-element'></input>
							Klicken Sie in die Karte, um den Standort des Objektes zu markieren.
						</div>
					</collapsable-content>
					</div>


					<div class='step'>
					<collapsable-content id='step3' .customCSS=${collapsableContentCss}
						.title=${stepTitle('3. Auswahl der Kategorie', model.currentCategory)}
						.open=${model.openSections.includes('step3')} @toggle=${onToggle} >
						<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}" required>
							<option value="" selected disabled>Bitte wählen ... </option>
							${model.categoriesSpecification.map((e) => html`<option value="${e['ee-name']}">${e['ee-name']}</option> `)}
							<label for="category">Category</label>
						</select>
					</collapsable-content>
					</div>

					<div class='step'>
					<collapsable-content id='step4' .customCSS=${collapsableContentCss}
						.title=${stepTitle('4. Angaben zum Objekt')} .open=${model.openSections.includes('step4')}
						@toggle=${onToggle}>

						${isCorrection ? '' : html` <div class="fields-help">Übersicht der notwendigen Angaben (Pflichtangaben mit * und in Fettdruck):</div>`}

${isCorrection ? '' : html`<div class="category-fields">${categoryFields[model.currentCategory]}</div>`}

						<textarea placeholder=${isCorrection ? 'Bitte hier Korrektur eintragen' : 'Zusätzliche Information'} 
							id="additional-info" name='additionalInfo' value=${model.description} ?required=${isCorrection}
							@input=${(e) => this.signal(Update, { additionalInfo: e.target.value })}></textarea>

					</collapsable-content>
					</div>

					<div class='step'>
					<collapsable-content id='step5' .customCSS=${collapsableContentCss}
						.title=${stepTitle('5. E-Mail-Adresse')} .open=${model.openSections.includes('step5')} 
						@toggle=${onToggle}>
						<input id='email' placeholder='Ihre E-Mail-Adresse' required  type='email' name="email" 
							@input=${(e) => this.signal(Update, { email: e.target.value })}>
						<p>
							<br/>
							Wir behalten uns vor, Meldungen nicht zu übernehmen. Wir beachten die Vorschriften des 
							<a href="https://www.energieatlas.bayern.de/datenschutz" target='_blank'>Datenschutzes</a>.
						</p>

					</collapsable-content>
					</div>
				</div>

				<div class='form-buttons'>
					<ba-button id="send" .label=${translate('ea_contribution_button_send')} 
						.type=${'primary'} @click=${onClickSendButton} >
						Senden
					</button>
				</div>
			</form>`;

		const completionForm = html`
		<div>${model.statusMessage}</div>
				<div class='form-buttons'>
					<ba-button id="back" .label=${translate('ea_contribution_button_back')} 
						.type=${'primary'} @click=${() => this.reset()} >
						Senden
					</button>
				</div>
			</div>`;

		return html`
			<style>
				${css}
			</style>
			<style>
				${model.showInvalidFields ? validationCss : nothing}
			</style>
			<div class="container">${model.statusMessage ? completionForm : form}</div>
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
