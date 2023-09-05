import { html } from 'lit-html';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';
import { $injector } from '../../../../../injection';
import css from './research.css';
import { resultsElement, themeSelectionElement, filterElement } from './research-elements';
import { FieldProperties } from '../../../../services/ResearchService';

const Update = 'update';
const Update_NextPage = 'update_next_page';
const Update_PreviousPage = 'update_next_page';
const Reset = 'reset';

const PAGING_SIZE = 20;

const initialModel = {
	isPortrait: false,
	hasMinWidth: false,
	themes: {},
	category: null,
	theme: null,
	filters: {},
	themeSpec: { fields: [] },
	queryResult: {
		hits: 0,
		results: [],
		pageSize: PAGING_SIZE,
		page: 0
	},
	openSections: ['step1', 'step2', 'step3'],
	openTab: 1,
	page: 0,
	sortField: null
};
export class ResearchModuleContent extends AbstractModuleContentPanel {
	constructor() {
		super(initialModel);

		const {
			ConfigService: configService,
			EnvironmentService: environmentService,
			TranslationService: translationService,
			ResearchService: researchService
		} = $injector.inject('ConfigService', 'EnvironmentService', 'TranslationService', 'ResearchService');

		this._configService = configService;
		this._environmentService = environmentService;
		this._translationService = translationService;
		this._researchService = researchService;
		this._subscribers = [];
	}

	onInitialize() {
		const loadThemes = async () => {
			const themes = await this._researchService.themes();
			const category = Object.keys(themes)[0];
			const theme = themes[category][0];

			this.signal(Update, { themes, theme, category });
		};

		setTimeout(loadThemes);
	}

	/**
	 * @override
	 */
	onInitialize() {
		const loadThemes = async () => {
			const themes = await this._researchService.themes();
			const category = Object.keys(themes)[0];
			const theme = themes[category][0];

			const themeSpec = await this._researchService.queryMetadata(theme, []);
			const filters = {};
			themeSpec.fields.forEach((f) => {
				if (f.type === 'numeric') filters[f.name] = { min: f.min, max: f.max };
			});
			this.signal(Update, { themes, category, theme, themeSpec, filters });
		};

		setTimeout(loadThemes);
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update: {
				const test = { ...model, ...data };
				return test;
			}
			case Update_NextPage: {
				const hits = model.queryResult ? model.queryResult.hits : 0;
				const page = model.page + (model.page === hits / PAGING_SIZE ? 0 : 1);
				const test = { ...model, page };
				return test;
			}
			case Update_PreviousPage: {
				const page = model.page === 0 ? 0 : model.page - 1;
				const test = { ...model, page };
				return test;
			}
			case Reset: {
				return initialModel;
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

		const onToggle = (e) => {
			// this.signal(Update, { openSections: [e.target.id] });
		};

		const onThemeChange = async (category, theme) => {
			const themeSpec = await this._researchService.queryMetadata(theme, []);
			this.signal(Update, { category, theme, themeSpec });
		};

		const updateResults = async (newModel) => {
			const queryFilters = Object.values(newModel.filters);
			const queryResult = await this._researchService.query(newModel.theme, queryFilters, newModel.sortField, PAGING_SIZE, newModel.page);
			this.signal(Update, { ...newModel, queryResult });
		};

		const onChange = (f) => async (change) => {
			if (change.type === 'numeric') {
				const { min, max } = change;
				const filters = { ...model.filters };
				filters[f.name] = { ...f, min: Number(min), max: Number(max) };
				await updateResults({ ...model, filters, page: 0 });
			} else if (change.type === 'enum') {
				const { values } = change;
				const filters = { ...model.filters };
				filters[f.name] = { ...f, values };
				await updateResults({ ...model, filters, page: 0 });
			}
		};

		const onPageChanged = (pageDelta) => async () => {
			const newPage = model.page + pageDelta;
			if (newPage > model.queryResult.hits / PAGING_SIZE || newPage < 0) return;
			await updateResults({ ...model, page: newPage });
		};

		const filters = model.themeSpec?.fields?.map((f) =>
			filterElement({ ...f, maxLimit: f.max, minLimit: f.min }, model.filters[f.name], onChange(f))
		);

		const fieldsToShow = model.themeSpec.fields.filter((f) => f.properties.includes(FieldProperties.VIEWABLE));
		const results = resultsElement(model.queryResult, fieldsToShow);

		const onTabChanged = (tab) => () => {
			this.signal(Update, { openTab: tab });
		};

		const tabs = [
			html`
				Treffer: ${model.queryResult?.hits}
				<collapsable-content id="step1" .title=${'1. Wählen Sie ein Thema aus'} .open=${model.openSections.includes('step1')} @toggle=${onToggle}>
					${themeSelectionElement(
						{
							themes: model.themes,
							category: model.category,
							theme: model.theme
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
				${results}
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
