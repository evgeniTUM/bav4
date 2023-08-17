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
	themeSpec: {},
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

	/**
	 * @override
	 */
	onInitialize() {
		const loadThemes = async () => {
			const themes = await this._researchService.getThemes();
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

		const test = async () => {
			const test = await this._researchService.getData();
			console.log(test);
		};

		const onToggle = (e) => {
			this.signal(Update, { openSections: [e.target.id] });
		};

		const onCategoryChanged = (e) => {
			this.signal(Update, { category: e.target.value });
		};

		const onThemeChange = (e) => {
			this.signal(Update, { theme: e.target.value });
		};

		const content =
			model.themes && model.category
				? html`
						<collapsable-content id="step1" .title=${'1. Wählen Sie ein Thema aus'} .open=${model.openSections.includes('step1')} @toggle=${onToggle}>
							<select id="category" @change=${onCategoryChanged} title="Kategorie" required>
								${Object.keys(model.themes).map((e) => html`<option value="${e}">${e}</option> `)}
								<label for="category">Category</label>
							</select>
							<select id="theme" @change=${onThemeChange} title="Thema" required>
								${model.themes[model.category].map((e) => html`<option value="${e}">${e}</option> `)}
								<label for="theme">Thema</label>
							</select>
						</collapsable-content>
				  `
				: '';

		return html`<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_recherche')}</div>

				<div class="content">${content}</div>

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
