import { html, nothing } from 'lit-html';
import { $injector } from '../../../../../injection';
import { setTaggingMode, setDescription } from '../../../../store/contribution/contribution.action';
import css from './eaContribution.css';
import { setCurrentModule } from '../../../../store/module/ea.action';
import { ResearchModuleContent } from '../research/ResearchModuleContent';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';

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
				<div class="fieldset" title="${translate('toolbox_drawTool_style_text')}"">								
					<input required="${optional ? '' : 'required'}"  type="text" id="style_text" name="${name}" .value="" @change=${onChangeTextField} >
					<label for="style_text" class="${clazz} control-label">${label}</label><i class="bar"></i>
				</div>
			`;
		};


		const onSelectionChanged = (e) => {
			this.currentCategory = e.target.value;
			this.render();
		};

		const selectField = html`
            <div class='' >
				<select id='category' @change="${onSelectionChanged}" title="${translate('footer_coordinate_select')}">
					${SAMPLE_DATA.boerse.map(e => html`
					<option value="${e['ee-name']}">${e['ee-name']}</option>
					`)}
				</select>
				<label for="category">Category</label>
			</div>`;


		const categorySpecs = SAMPLE_DATA.boerse.find(e => e['ee-name'] === this.currentCategory);
		let entries = nothing;
		if (categorySpecs) {
			entries = categorySpecs['ee-angaben'].map(e => createField(e.name, e.optional));
		}

		return html`
			<style>${css}</style>		
			<div class="container"> 			
				${selectField}
				${entries}
				<div class="" title="${translate('ea_contribution_desc')}">
					<label for="description">${translate('ea_contribution_desc')}</label>	
					<textarea id="description" name="${translate('ea_contribution_desc')}" .value=${model.description} @input=${onChangeDescription}></textarea>
				</div>	
				<div class="" title="${translate('ea_contribution_coordinates_text')}">
					<label for="coordinates">${translate('ea_contribution_coordinates_text')}</label>	
					<div id='coordinates'>${getCoordinatesString()}</div>
				</div>
				
				<ba-button id="tag" 
					class="button" 
					.label=${translate(model.tagging ? 'ea_contribution_button_tag_cancel' : 'ea_contribution_button_tag')}
					@click=${onClickTagButton}></ba-button>
				<ba-button id="search" 
					class="button" 
					.label="search"
					@click=${onClickResearchButton}></ba-button>
				<ba-button id="select" 
					class="button" 
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
