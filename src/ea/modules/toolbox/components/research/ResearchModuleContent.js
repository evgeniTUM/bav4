import { html } from 'lit-html';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';
import { $injector } from '../../../../../injection';
import css from './research.css';
import { resultsElement, themeSelectionElement, filterElement } from './research-elements';

const Update = 'update';
const Reset = 'reset';

const initialModel = {
	isPortrait: false,
	hasMinWidth: false,
	themes: {},
	category: null,
	theme: null,
	filters: {},
	themeSpec: {},
	resultsMetadata: {},
	results: [],
	openSections: ['step1', 'step2', 'step3']
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

			const resultsMetadata = await this._researchService.queryMetadata(theme, []);
			const filters = {};
			resultsMetadata.fields.forEach((f) => {
				if (f.type === 'numeric') filters[f.name] = { min: f.min, max: f.max };
			});
			this.signal(Update, { themes, category, theme, resultsMetadata, filters });
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
			const resultsMetadata = await this._researchService.queryMetadata(theme, []);
			this.signal(Update, { category, theme, resultsMetadata });
		};

		const onMinMaxChange = (f) => async (min, max) => {
			const filters = { ...model.filters };
			filters[f.name] = { ...f, min: Number(min), max: Number(max) };
			const queryFilters = Object.values(filters);
			const results = await this._researchService.query(model.theme, queryFilters, 1);
			this.signal(Update, { filters, results });
		};
		const filters = model.resultsMetadata?.fields?.map((f) =>
			filterElement({ name: f.name, type: f.type, maxLimit: f.max, minLimit: f.min }, model.filters[f.name], onMinMaxChange(f))
		);

		const results = resultsElement(model.results);

		const resultsMetadata = JSON.stringify(model.filters, null, 2);

		return html`<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_recherche')}</div>

				<div class="content">
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
					<collapsable-content id="step3" .title=${'3. Treffer'} .open=${model.openSections.includes('step3')} @toggle=${onToggle}>
						${results}
					</collapsable-content>
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
