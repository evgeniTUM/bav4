/**
 * @module modules/feedback/components/rating/StarsRatingPanel
 */

import { html } from 'lit-html';
import css from './starsRatingPanel.css';
import { MvuElement } from '../../../MvuElement';
import { $injector } from '../../../../injection';

/**
 * possible rating types
 * @readonly
 * @enum {number}
 */
export const Rating = Object.freeze({
	NONE: 0,
	STRONGLY_DISAGREE: 1,
	DISAGREE: 2,
	NEUTRAL: 3,
	AGREE: 4,
	STRONGLY_AGREE: 5
});

const Update_Rating = 'update_rating';

/**
 * Rating component
 * @fires  change when the rating has changed
 * @property {Rating} rating - The selected rating.
 * @class
 * @author norbertK
 */
export class StarsRatingPanel extends MvuElement {
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

	/**
	 * @override
	 */
	onInitialize() {
		this.observeModel('rating', (rating) => {
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { rating }
				})
			);
		});
	}

	createView(model) {
		const { rating } = model;
		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>
				${css}
			</style>

			<div class="container">
				<button
					class="star-button ${'rating-' + Rating.STRONGLY_DISAGREE} ${Rating.STRONGLY_DISAGREE === rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.STRONGLY_DISAGREE)}"
					title="${translate('fiveButtonRating_very_unlikely')}"
				></button>
				<button
					class="star-button ${'rating-' + Rating.DISAGREE} ${Rating.DISAGREE === rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.DISAGREE)}"
					title="${translate('fiveButtonRating_unlikely')}"
				></button>
				<button
					class="star-button ${'rating-' + Rating.NEUTRAL} ${Rating.NEUTRAL === rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.NEUTRAL)}"
					title="${translate('fiveButtonRating_neutral')}"
				></button>
				<button
					class="star-button ${'rating-' + Rating.AGREE} ${Rating.AGREE === rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.AGREE)}"
					title="${translate('fiveButtonRating_likely')}"
				></button>
				<button
					class="star-button ${'rating-' + Rating.STRONGLY_AGREE} ${Rating.STRONGLY_AGREE === rating ? 'selected' : 'unselected'}"
					@click="${() => this._onRatingClick(Rating.STRONGLY_AGREE)}"
					title="${translate('fiveButtonRating_very_likely')}"
				></button>
			</div>
		`;
	}

	_onRatingClick(rating) {
		this.rating = rating;
	}

	set rating(value) {
		this.signal(Update_Rating, value);
	}

	get rating() {
		return this.getModel().rating;
	}

	static get tag() {
		return 'ba-stars-rating-panel';
	}
}
