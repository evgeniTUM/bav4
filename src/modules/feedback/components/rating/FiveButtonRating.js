/**
 * @module modules/feedback/components/rating/FiveButtonRating
 */

import { html } from 'lit-html';
import css from './fiveButtonRating.css';
import { MvuElement } from '../../../MvuElement';
import { $injector } from '../../../../injection';

/**
 * possible rating types
 * @readonly
 * @enum {string}
 */
export const Rating = Object.freeze({
	NONE: '0',
	TERRIBLE: '1',
	BAD: '2',
	SATISFIED: '3',
	GOOD: '4',
	EXCELLENT: '5'
});

const Update_Rating = 'update_rating';

export class FiveButtonRating extends MvuElement {
	constructor() {
		super({
			rating: Rating.NONE
		});

		const { TranslationService: translationService } = $injector.inject('TranslationService');
		this._translationService = translationService;
	}

	update(type, data, model) {
		switch (type) {
			case Update_Rating:
				return { ...model, rating: data };
		}
	}

	createView(model) {
		const { rating } = model;

		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>
				${css}
			</style>

			<div>
				<button
					class="star-button ${Rating.TERRIBLE <= rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.TERRIBLE)}"
					title="${translate('fiveButtonRating_terrible')}"
				>
					*
				</button>
				<button
					class="star-button ${Rating.BAD <= rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.BAD)}"
					title="${translate('fiveButtonRating_bad')}"
				>
					*
				</button>
				<button
					class="star-button ${Rating.SATISFIED <= rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.SATISFIED)}"
					title="${translate('fiveButtonRating_satisfied')}"
				>
					*
				</button>
				<button
					class="star-button ${Rating.GOOD <= rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.GOOD)}"
					title="${translate('fiveButtonRating_good')}"
				>
					*
				</button>
				<button
					class="star-button ${Rating.EXCELLENT <= rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.EXCELLENT)}"
					title="${translate('fiveButtonRating_excellent')}"
				>
					*
				</button>
			</div>
		`;
	}

	_onRatingClick(rating) {
		// todo remove:
		if (rating === Rating.EXCELLENT) {
			rating = Rating.NONE;
		}

		this.rating = rating;
	}

	set rating(value) {
		// todo remove:
		console.log('🚀 ~ FiveButtonRating ~ setrating ~ value:', value);
		this.signal(Update_Rating, value);
		this.dispatchEvent(
			new CustomEvent('rating', {
				detail: { rating: value }
			})
		);
	}

	get rating() {
		console.log('🚀 ~ FiveButtonRating ~ getrating ~ this.getModel().rating():', this.getModel().rating);
		return this.getModel().rating;
	}

	static get tag() {
		return 'ba-mvu-fivebuttonrating';
	}
}
