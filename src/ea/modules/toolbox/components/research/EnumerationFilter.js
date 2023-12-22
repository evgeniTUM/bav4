import css from './research.css';
import { classMap } from 'lit-html/directives/class-map.js';
import { html } from '../../../../../../node_modules/lit-html/lit-html';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';

const Update = 'update';

export class EnumerationFilter extends AbstractModuleContentPanel {
	constructor() {
		super({ collapsed: true });
	}
	update(type, data, model) {
		switch (type) {
			case Update: {
				return { ...model, ...data };
			}
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const { displayname, values, collapsed } = model;

		const classes = {
			collapsed
		};
		const options = values.map((v) => html` <option value=${v}>${v}</option> `);
		const onClick = () => this.signal(Update, { collapsed: !collapsed });

		return html`<style>
				${css}
			</style>
			<div class="enumeration" @click=${onClick} id=${displayname}>
				<label for=${displayname}><span style="font-weight: bold">${displayname}</span></label>
				<div class="enumeration-options ${classMap(classes)}">${options}</div>
			</div> `;
	}

	set data(value) {
		this.signal(Update, value);
	}

	static get tag() {
		return 'ea-research-enumeration-filter';
	}
}
