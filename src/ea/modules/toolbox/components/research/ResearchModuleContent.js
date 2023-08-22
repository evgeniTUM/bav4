import { html } from 'lit-html';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';
import { $injector } from '../../../../../injection';
import css from './research.css';

const Update = 'update';
const Reset = 'reset';

const initialModel = {
	isPortrait: false,
	hasMinWidth: false,
	themes: {},
	category: null,
	theme: null,
	filters: [],
	themeSpec: {},
	resultsMetadata: {},
	results: {},
	openSections: ['step1']
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

			this.signal(Update, { themes, theme, category });
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
			this.signal(Update, { openSections: [e.target.id] });
		};

		const onCategoryChanged = (e) => {
			const category = e.target.value;
			const theme = model.themes[category][0];
			this.signal(Update, { category, theme });
		};

		const onThemeChange = async (e) => {
			const theme = e.target.value;
			const resultsMetadata = await this._researchService.queryMetadata(theme, []);
			this.signal(Update, { theme, resultsMetadata });

			setTimeout(async () => {
				const testMetadata = await this._researchService.queryMetadata(theme, [
					{
						name: 'Inbetriebnahmejahr',
						type: 'numeric',
						min: 2015,
						max: Infinity
					}
				]);
			});
		};

		const themeSelectionContent =
			model.themes && model.category
				? html`
						<collapsable-content id="step1" .title=${'1. Wählen Sie ein Thema aus'} .open=${model.openSections.includes('step1')} @toggle=${onToggle}>
							<select id="category" @change=${onCategoryChanged} title="Kategorie" required>
								${Object.keys(model.themes).map((e) => html`<option value="${e}" ?selected=${e === model.category}>${e}</option>`)}
								<label for="category">Category</label>
							</select>
							<select id="theme" @change=${onThemeChange} title="Thema" required>
								${model.themes[model.category].map((e) => html`<option value="${e}" ?selected=${e === model.theme}>${e}</option>`)}
								<label for="theme">Thema</label>
							</select>
						</collapsable-content>
				  `
				: '';

		const filterContent = html`
			<collapsable-content id="step2" .title=${'2. Filtern Sie nach Eigenschaften'} .open=${model.openSections.includes('step2')} @toggle=${onToggle}>
				${model.filters}
			</collapsable-content>
		`;

		const resultsMetadata = JSON.stringify(model.resultsMetadata, null, 2);

		return html`<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_recherche')}</div>

				<div class="content">${themeSelectionContent} ${filterContent} ${resultsMetadata}</div>

				<div class="footer-content"></div>
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
