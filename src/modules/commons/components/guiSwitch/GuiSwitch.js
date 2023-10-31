/**
 * @module modules/commons/components/guiSwitch/GuiSwitch
 */
import css from './guiSwitch.css';
import { html } from 'lit-html';
import { MvuElement } from '../../../MvuElement';
import { getPseudoStyle, getStyle } from '../../../../utils/style-utils';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../utils/markup';
import { isFunction } from '../../../../utils/checks';

const Update_Disabled = 'update_disabled';
const Update_Checked = 'update_checked';
const Update_Indeterminate = 'update_indeterminate';
const Update_Title = 'update_title';
// eslint-disable-next-line no-unused-vars
const Toggle_No_Op = (checked) => {};

/**
 * new 'nicer' toggle element based on https://web.dev/building-a-switch-component/
 *
 * Events:
 * - onToggle()
 *
 * Properties:
 * - `checked`
 * - `disabled`
 * - `indeterminate`
 * - `title`
 *
 *
 * @class
 * @author nklein
 * @author thiloSchlemmer
 *
 * @property {boolean} checked = false - The checkbox is whether checked or not.
 * @property {boolean} indeterminate = false - The checkbox has an indeterminate state.
 * @property {string} title = '' - The title of the button.
 * @property {boolean} disabled = false - The checkbox react on user interactions or not.
 * @property {function(checked)} onToggle - The toggle event fires when the checked state of a GuiSwitch element is toggled.
 */
export class GuiSwitch extends MvuElement {
	#switch = {};

	constructor() {
		super({
			checked: false,
			indeterminate: false,
			disabled: false,
			title: ''
		});
		// eslint-disable-next-line no-unused-vars
		this._onToggle = Toggle_No_Op;
	}

	onInitialize() {
		this.setAttribute(TEST_ID_ATTRIBUTE_NAME, '');
	}

	update(type, data, model) {
		const returnAndPropagate = (data) => {
			this.dispatchEvent(
				new CustomEvent('toggle', {
					detail: { checked: data }
				})
			);
			this._onToggle(data);

			return data;
		};

		switch (type) {
			case Update_Checked:
				return { ...model, checked: returnAndPropagate(data), indeterminate: false };

			case Update_Indeterminate:
				return { ...model, indeterminate: data };

			case Update_Disabled:
				return { ...model, disabled: data };

			case Update_Title:
				return { ...model, title: data };
		}
	}

	onAfterRender(firstTime) {
		if (firstTime) {
			this._state = {
				activeThumb: null,
				recentlyDragged: false,
				dragging: false
			};

			const checkbox = this.shadowRoot.querySelector('input');
			const thumbSize = getPseudoStyle(checkbox, 'width');
			const padding = getStyle(checkbox, 'padding-left') + getStyle(checkbox, 'padding-right');

			this.#switch = {
				thumbSize: thumbSize,
				padding,
				bounds: {
					lower: 0,
					middle: (checkbox.clientWidth - padding) / 4,
					upper: checkbox.clientWidth - thumbSize - padding
				}
			};
		}
	}

	createView(model) {
		const { checked, indeterminate, disabled, title } = model;

		const onChange = (event) => {
			const checked = event.target.checked;
			this.signal(Update_Checked, checked);
		};

		return html`
			<style>
				${css}
			</style>

			<label title="${title}" for="guiSwitch" @click=${(e) => this._labelClick(e)} class="ba-switch  ${disabled ? 'cursor-disabled' : ''}">
				<slot name="before"></slot>
				<input
					@change=${onChange}
					@pointerdown=${(event) => this._dragInit(event)}
					@pointerup=${() => this._dragEnd()}
					@click=${(event) => this._preventBubbles(event)}
					@keydown=${(event) => this._keydown(event)}
					id="guiSwitch"
					type="checkbox"
					role="switch"
					.checked=${checked}
					.indeterminate=${indeterminate}
					.disabled=${disabled}
					tabindex="0"
				/>
				<slot name="after"></slot>
				<slot></slot>
			</label>
		`;
	}

	_dragInit(event) {
		if (event.target.disabled) return;

		this._state.activeThumb = event.target;
		this._state.activeThumb.addEventListener('pointermove', (event) => {
			this._dragging(event);
		});
		window.addEventListener('pointerup', () => this._dragEnd(), { once: true });
		this._state.activeThumb.style.setProperty('--thumb-transition-duration', '0s');
		this._state.activeThumb.style.setProperty('--thumb-position', this._calculateThumbPosition(event.offsetX));
	}

	_dragging(event) {
		if (this._state.activeThumb) {
			this._state.activeThumb.style.setProperty('--thumb-position', this._calculateThumbPosition(event.offsetX));
			this._state.dragging = true;
		}
	}

	_calculateThumbPosition(offsetX) {
		const getHarmonizedPosition = (offsetX, thumbSize, bounds) => {
			const rawPosition = Math.round(offsetX - thumbSize / 2);

			return rawPosition < bounds.lower ? 0 : rawPosition > bounds.upper ? bounds.upper : rawPosition;
		};

		const { thumbSize, bounds, padding } = this.#switch;
		const directionality = getStyle(this._state.activeThumb, '--isLTR');
		const track = directionality === -1 ? this._state.activeThumb.clientWidth * -1 + thumbSize + padding : 0;

		const position = getHarmonizedPosition(offsetX, thumbSize, bounds);
		return `${track + position}px`;
	}

	_dragEnd() {
		if (!this._state.activeThumb) return;

		this._state.activeThumb.checked = this._state.dragging ? this._determineChecked() : !this._determineChecked();
		this.signal(Update_Checked, this._state.activeThumb.checked);
		if (this._state.activeThumb.indeterminate) {
			this._state.activeThumb.indeterminate = false;
		}

		this._state.activeThumb.style.removeProperty('--thumb-transition-duration');
		this._state.activeThumb.style.removeProperty('--thumb-position');
		this._state.activeThumb.removeEventListener('pointermove', this._dragging);
		this._state.activeThumb = null;
		this._state.dragging = false;

		this._padRelease();
	}

	_padRelease() {
		this._state.recentlyDragged = true;

		setTimeout(() => {
			this._state.recentlyDragged = false;
		}, 300);
	}

	_preventBubbles(event) {
		if (this._state.recentlyDragged) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	_keydown(event) {
		const target = event.target;
		if (target.disabled) {
			return;
		}

		if (event.key === ' ') {
			this.signal(Update_Checked, !target.checked);

			event.preventDefault();
			event.stopPropagation();
		}
	}

	_labelClick(event) {
		const target = event.target;
		const checkbox = target.querySelector('input');

		if (this._state.recentlyDragged || !target.classList.contains('ba-switch') || checkbox.disabled) {
			return;
		}

		this.signal(Update_Checked, !checkbox.checked);
		event.preventDefault();
	}

	_determineChecked() {
		const { bounds } = this.#switch;
		const currentPosition = parseInt(this._state.activeThumb.style.getPropertyValue('--thumb-position'));
		console.log(currentPosition);
		return currentPosition >= bounds.middle;
	}

	set indeterminate(value) {
		this.signal(Update_Indeterminate, value);
	}

	get indeterminate() {
		return this.getModel().indeterminate;
	}

	set title(value) {
		this.signal(Update_Title, value);
	}

	get title() {
		return this.getModel().title;
	}

	set disabled(value) {
		this.signal(Update_Disabled, value);
	}

	get disabled() {
		return this.getModel().disabled;
	}

	set checked(value) {
		this.signal(Update_Checked, value);
	}

	get checked() {
		return this.getModel().checked;
	}
	set onToggle(callback) {
		this._onToggle = callback && isFunction(callback) ? callback : Toggle_No_Op;
	}

	get onToggle() {
		return this._onToggle;
	}

	static get tag() {
		return 'ba-switch';
	}
}
