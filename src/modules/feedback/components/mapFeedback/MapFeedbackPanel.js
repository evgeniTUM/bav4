import { html } from 'lit-html';
import { $injector } from '../../../../injection';
import { MvuElement } from '../../../MvuElement';
import css from './mapFeedbackPanel.css';

const Update_Type = 'update_type';
const Update_Category = 'update_category';
const Update_Message = 'update_message';
const Update_EMail = 'update_email';
const Update_CategoryOptions = 'update_categoryoptions';

export class MapFeedbackPanel extends MvuElement {
	constructor() {
		super({
			message: '',
			email: '',
			category: '',
			categoryOptions: []
		});

		const {
			ConfigService: configService,
			TranslationService: translationService,
			MapFeedbackService: mapFeedbackService
		} = $injector.inject('ConfigService', 'TranslationService', 'MapFeedbackService');

		this._configService = configService;
		this._translationService = translationService;
		this._mapFeedbackService = mapFeedbackService;

		this.reasonOptions = [
			{ value: '', label: '-' },
			{ value: 'missing', label: 'Missing' },
			{ value: 'wrong type', label: 'Wrong Type' },
			{ value: 'error', label: 'Error' }
		];
	}

	onInitialize() {
		this._getCategorieOptions();
	}

	async _getCategorieOptions() {
		try {
			const categorieOptions = await this._mapFeedbackService.getCategories();
			this.signal(Update_CategoryOptions, categorieOptions);
		} catch (e) {
			console.error(e);
			this.signal(Update_CategoryOptions, []);
		}
	}

	update(type, data, model) {
		switch (type) {
			case Update_Type:
				return { ...model, type: data };
			case Update_Category:
				return { ...model, category: data };
			case Update_Message:
				return { ...model, message: data };
			case Update_EMail:
				return { ...model, email: data };
			case Update_CategoryOptions:
				return { ...model, categoryOptions: ['', ...data] };
		}
	}

	createView(model) {
		const { email, message, category, categoryOptions } = model;
		const translate = (key) => this._translationService.translate(key);

		const handleTypeChange = (event) => {
			const selectedType = event.target.value;
			this.signal(Update_Type, selectedType);
		};

		const handleCategoryChange = () => {
			this._noAnimation = true;
			const select = this.shadowRoot.getElementById('category');
			const selectedCategory = select.options[select.selectedIndex].value;
			this.signal(Update_Category, selectedCategory);
		};

		const handleEmailChange = (event) => {
			const { value } = event.target;
			this.signal(Update_EMail, value);
		};

		const handleMessageChange = (event) => {
			const { value } = event.target;
			this.signal(Update_Message, value);
		};

		const handleSubmit = (event) => {
			event.preventDefault();
			const formdata = new FormData(event.target);
			const data = Object.fromEntries(formdata.entries());
			// eslint-disable-next-line no-console
			console.log('🚀 ~ MapFeedbackPanel ~ handleSubmit ~ data:', data);
			this.dispatchEvent(new CustomEvent('feedback-form-submit', { detail: data }));
		};

		return html`
			<style>
				${css}
			</style>

			<h2 id="feedbackPanelTitle">${translate('feedback_header')}</h2>

			<div class="feedback-form-container">
				<div class="feedback-form-left">
					<form @submit="${handleSubmit}">
						<br />

						<label for="category">${translate('feedback_markChangeNotice')}</label>
						<div>
							<label for="symbol" class="icon-label">
								<input type="radio" id="symbol" name="type" value="symbol" @change="${handleTypeChange}" required />
								Symbol
							</label>
						</div>
						<div>
							<label for="line" class="icon-label">
								<input type="radio" id="line" name="type" value="line" @change="${handleTypeChange}" required />
								Line
							</label>
						</div>
						<br />

						<label for="category">${translate('feedback_categorySelection')}</label>
						<select id="category" name="category" .value="${category}" @change="${handleCategoryChange}" required>
							${categoryOptions.map((option) => html` <option value="${option}">${option}</option> `)}
						</select>

						<label for="message">${translate('feedback_changeDescription')}</label>
						<textarea
							id="message"
							name="message"
							.value="${message}"
							@input="${handleMessageChange}"
							minlength="10"
							maxlength="40"
							required
						></textarea>

						<label for="email">${translate('feedback_eMail')}</label>
						<input type="email" id="email" name="email" .value="${email}" @input="${handleEmailChange}" required />
						<br />
						${translate('feedback_disclaimer')} (<a
							href="https://geoportal.bayern.de/bayernatlas/?lang=de&topic=ba&catalogNodes=11&bgLayer=atkis&layers=timLayer#"
							>${translate('feedback_privacyPolicy')}</a
						>).
						<br />

						<button type="submit">Submit</button>
					</form>
				</div>
				<div class="feedback-form-right"></div>
			</div>
		`;
	}

	static get tag() {
		return 'ba-mvu-feedbackpanel';
	}
}
