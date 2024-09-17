/**
 * @module modules/layerManager/components/ValueSelect
 */
import { MvuElement } from '../../MvuElement';
import { $injector } from '../../../injection';
import { html, nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import css from './valueselect.css';

const Update_Title = 'update_title';
const Update_Values = 'update_values';
const Update_Selected = 'update_selected';
const Update_IsCollapsed = 'update_is_collapsed';
const Update_IsPortrait_Value = 'update_isportrait_value';

/**
 * Component to select a value from a list of values.
 *
 * @property {Array<string>} values the values
 * @property {string} selected the selected value
 * @property {string} title='' - The title of the button
 * @property {function(string)} onSelect The select callback function when the select state of the element is changed.
 * @fires onSelect The select event fires when the select state of the element is changed
 *
 * @class
 * @author thiloSchlemmer
 */
export class ValueSelect extends MvuElement {
	constructor() {
		super({ title: '', values: [], selected: null, isCollapsed: true, portrait: false });
		const { TranslationService: translationService } = $injector.inject('TranslationService');

		this._translationService = translationService;
		// eslint-disable-next-line no-unused-vars
		this._onSelect = (selectedValue) => {};
	}

	onInitialize() {
		this.observe(
			(state) => state.media.portrait,
			(portrait) => this.signal(Update_IsPortrait_Value, portrait)
		);
	}

	update(type, data, model) {
		switch (type) {
			case Update_Title:
				return { ...model, title: data };
			case Update_Values:
				return { ...model, values: data };
			case Update_Selected:
				return { ...model, selected: data };
			case Update_IsCollapsed:
				return { ...model, isCollapsed: data };
			case Update_IsPortrait_Value:
				return { ...model, portrait: data };
		}
	}

	createView(model) {
		const { portrait, selected } = model;
		const translate = (key) => this._translationService.translate(key);
		const valuesAvailable = model.values.length > 0;

		const getValues = () => {
			if (!valuesAvailable) {
				return nothing;
			}

			const onClick = (event) => {
				const selectedValue = model.values.find((value) => event.currentTarget.id === 'value_' + value);
				this.signal(Update_Selected, selectedValue);
				this.dispatchEvent(
					new CustomEvent('select', {
						detail: {
							selected: selectedValue
						}
					})
				);
				this._onSelect(selectedValue);
				this.signal(Update_IsCollapsed, !model.isCollapsed);
			};

			const getValue = (value) => {
				const isSelectedClass = {
					isselected: model.selected === value
				};
				return html` <div
					id="value_${value}"
					class="ba_value_item ${classMap(isSelectedClass)}"
					title=${translate('iconSelect_icon_hint')}
					@click=${onClick}
				>
					${value}
				</div>`;
			};

			return model.values.map((value) => getValue(value));
		};

		const onClick = () => {
			this.signal(Update_IsCollapsed, !model.isCollapsed);
		};

		const isCollapsedClass = {
			iscollapsed: model.isCollapsed
		};

		const getOrientationClass = () => {
			return portrait ? 'is-portrait' : 'is-landscape';
		};

		return html`
			<style>
				${css}
			</style>
			<div class="valueselect__container ${getOrientationClass()}">
				<div class="values_header">
					<button
						id="symbol-value"
						data-test-id
						class="valueselect__toggle-button"
						@click=${onClick}
						.title=${model.title}
						.disabled=${!valuesAvailable}
					>
						${selected}
					</button>
				</div>
				<div class="ba_values_container ${classMap(isCollapsedClass)}">${getValues()}</div>
			</div>
		`;
	}

	static get tag() {
		return 'ba-value-select';
	}

	set title(value) {
		this.signal(Update_Title, value);
	}

	get title() {
		return this.getModel().title;
	}

	set values(values) {
		this.signal(Update_Values, values);
	}

	get values() {
		return this.getModel().values;
	}

	set selected(value) {
		this.signal(Update_Selected, value);
	}

	get selected() {
		return this.getModel().selected;
	}

	set onSelect(callback) {
		this._onSelect = callback;
	}

	get onSelect() {
		return this._onSelect;
	}
}
