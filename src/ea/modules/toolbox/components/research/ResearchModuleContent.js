import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { SortDirections, Types } from '../../../../domain/researchTypes';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';
import { enumerationFilterElement, numericFilterElement, resultsElement, themeSelectionElement } from './research-elements';
import css from './research.css';

const Update = 'update';
const Update_ToggleActiveFilter = 'update_toggle_active_filter';
const Update_NextPage = 'update_next_page';
const Update_PreviousPage = 'update_next_page';
const Reset = 'reset';

const PAGING_SIZE = 20;

const initialModel = {
	activeEnumFilter: undefined,
	isPortrait: false,
	hasMinWidth: false,
	themeGroups: [],
	selectedThemeGroupName: null,
	selectedThemeId: null,
	propertyFilters: {},
	themeSpec: { propertydefinitions: [], featureCount: 0 },
	queryResult: undefined,
	openSections: ['step1', 'step2', 'step3'],
	openTab: 1,
	page: 0,
	sortField: null
};

export class ResearchModuleContent extends AbstractModuleContentPanel {
	constructor() {
		super(initialModel);

		const { TranslationService: translationService, ResearchService: researchService } = $injector.inject('TranslationService', 'ResearchService');

		this._translationService = translationService;
		this._researchService = researchService;
		this._subscribers = [];
	}

	async loadTheme(selectedThemeId, themeGroups, selectedThemeGroupName) {
		const themeSpec = await this._researchService.queryMetadata(selectedThemeId);
		const propertyFilters = {};
		themeSpec.propertydefinitions.forEach((f) => {
			if (f.type === Types.NUMERIC || f.type === Types.INTEGER) propertyFilters[f.originalkey] = { min: f.minLimit, max: f.maxLimit };
			else if (f.type === Types.CHARACTER) {
				propertyFilters[f.originalkey] = [];
			}
		});

		const sortField = themeSpec.propertydefinitions[0]?.originalkey;

		const newModel = { ...initialModel, themeGroups, selectedThemeGroupName, selectedThemeId, themeSpec, propertyFilters, sortField };
		const sorting = {
			originalkey: sortField,
			sortDirectio: SortDirections.ASCENDING
		};

		const queryResult = await this._researchService.queryFeatures(newModel.selectedThemeId, [], [], sorting, PAGING_SIZE, newModel.page);
		this.signal(Update, { ...newModel, queryResult });
	}

	/**
	 * @override
	 */
	onInitialize() {
		const loadThemes = async () => {
			const themeGroups = await this._researchService.loadThemeGroups();
			const selectedThemeGroupName = themeGroups[0].grouGpname;
			const selectedThemeId = themeGroups[0].themes[0].themeId;

			this.loadTheme(selectedThemeId, themeGroups, selectedThemeGroupName);
		};

		setTimeout(loadThemes);
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update: {
				return { ...model, ...data };
			}
			case Update_NextPage: {
				const hits = model.queryResult ? model.queryResult.features.length : 0;
				const page = model.page + (model.page === hits / PAGING_SIZE ? 0 : 1);
				return { ...model, page };
			}
			case Update_PreviousPage: {
				const page = model.page === 0 ? 0 : model.page - 1;
				return { ...model, page };
			}
			case Reset: {
				return initialModel;
			}
			case Update_ToggleActiveFilter: {
				const currentFilter = model.activeEnumFilter;
				return { ...model, activeEnumFilter: data === currentFilter ? undefined : data };
			}
		}
	}

	reset() {
		this._subscribers.forEach((o) => o());
		this.signal(Reset);
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
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const onToggle = () => {
			// this.signal(Update, { openSections: [e.target.id] });
		};

		const updateResults = async (newModel) => {
			const queryFilters = Object.values(newModel.propertyFilters).filter((f) => !(f.values && f.values.length === 0));
			const sorting = {
				originalkey: model.sortField,
				sortDirectio: SortDirections.ASCENDING
			};
			const queryResult = await this._researchService.queryFeatures(newModel.selectedThemeId, [], queryFilters, sorting, PAGING_SIZE, newModel.page);
			this.signal(Update, { ...newModel, queryResult });
		};

		const onChange = (f) => async (change) => {
			if (change.type === Types.NUMERIC || change.type === Types.INTEGER) {
				const { min, max } = change;
				const propertyFilters = { ...model.propertyFilters };
				propertyFilters[f.originalkey] = { min: Number(min), max: Number(max) };
				await updateResults({ ...model, propertyFilters, page: 0 });
			} else if (change.type === Types.CHARACTER) {
				const { values } = change;
				const propertyFilters = { ...model.propertyFilters };
				propertyFilters[f.originalkey] = values;
				await updateResults({ ...model, propertyFilters, page: 0 });
			}
		};

		const onPageChanged = (pageDelta) => async () => {
			const newPage = model.page + pageDelta;
			if (newPage > model.queryResult.hits / PAGING_SIZE || newPage < 0) return;
			await updateResults({ ...model, page: newPage });
		};

		const onEnumFilterToggle = (displayname) => () => {
			this.signal(Update_ToggleActiveFilter, displayname);
		};

		const filters = model.themeSpec?.propertydefinitions?.map((f) =>
			[Types.CHARACTER].includes(f.type)
				? enumerationFilterElement(f, model.propertyFilters[f.originalkey], model.activeEnumFilter, onChange(f), onEnumFilterToggle(f.displayname))
				: [Types.NUMERIC, Types.INTEGER].includes(f.type)
				? numericFilterElement(f, model.propertyFilters[f.originalkey], onChange(f))
				: html``
		);

		const fieldsToShow = model.themeSpec.propertydefinitions.filter((f) => f.displayable === true);
		const features = resultsElement(model.queryResult, fieldsToShow, model.themeSpec.geoResourceId);

		const onTabChanged = (tab) => () => {
			this.signal(Update, { openTab: tab });
		};

		const onThemeChange = (themeGroup, themeId) => this.loadTheme(themeId, model.themeGroups, themeGroup);

		const tabs = [
			html`
				Treffer: ${model.queryResult ? model.queryResult.hits : model.themeSpec?.featureCount}
				<collapsable-content id="step1" .title=${'1. Wählen Sie ein Thema aus'} .open=${model.openSections.includes('step1')} @toggle=${onToggle}>
					${themeSelectionElement(
						{
							themeGroups: model.themeGroups,
							selectedThemeGroupName: model.selectedThemeGroupName,
							selectedThemeId: model.selectedThemeId
						},
						onThemeChange
					)}
				</collapsable-content>

				<collapsable-content
					id="step2"
					.title=${'2. Filtern Sie nach Eigenschaften'}
					.open=${model.openSections.includes('step2')}
					@toggle=${onToggle}
				>
					${filters}
				</collapsable-content>
			`,
			html`
				<div style="display: flex">
					<button .label=${'Previous'} @click=${onPageChanged(-1)}>Previous Page</button>
					<button .label=${'Next'} @click=${onPageChanged(1)}>Next Page</button>
				</div>
				${features}
			`,
			html``
		];

		return html`<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_recherche')}</div>

				<div class="content">
					<div style="display:flex">
						<ba-button .label=${'Abfrage'} @click=${onTabChanged(1)}>Abfrage</ba-button>
						<ba-button .label=${'Ergebnis'} @click=${onTabChanged(2)}>Ergebnis</ba-button>
						<ba-button .label=${'Export'} @click=${onTabChanged(3)}>Export</ba-button>
					</div>

					${tabs[model.openTab - 1]}
				</div>
			</div>`;
	}

	static get name() {
		return 'recherche';
	}

	static get tag() {
		return 'ea-module-research-content';
	}

	static get initialWidth() {
		return 40;
	}

	static get minWidth() {
		return 40;
	}
}
