import { html } from 'lit-html';
import css from './collapsableContent.css';
import { classMap } from 'lit-html/directives/class-map.js';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../utils/markup';
import { AbstractMvuContentPanel } from '../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';


const Update_Disabled = 'update_disabled';
const Update_Open = 'update_open';
const Update_Label = 'update_label';

export class CollapsableContent extends AbstractMvuContentPanel {

	constructor() {
		super({
			disabled: false,
			open: false,
			title: 'title'
		});
	}

	onInitialize() {
		this.setAttribute(TEST_ID_ATTRIBUTE_NAME, '');
	}

	update(type, data, model) {

		switch (type) {
			case Update_Disabled:
				return { ...model, disabled: data };
			case Update_Open:
				return { ...model, open: data };
			case Update_Label:
				return { ...model, label: data };
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const { disabled, label, open } = model;

		const onClick = () => {
			this.signal(Update_Open, !open);
		};

		return html`
		 <style>${css}</style> 
		 <div class='ba-section divider ${classMap({ disabled: disabled })}'>
            <div class='header ba-list-item' @click=${onClick}>
                <span .title='visible-title'  class='ba-list-item__text ba-list-item__primary-text' tabindex='0' .checked='true' >${label}</span>
                <button id='button-detail' data-test-id class='ba-list-item__after' title="collapse-title" >
                    <i class='icon chevron icon-rotate-90 ${classMap({ iconexpand: open })}'></i>
                </button>   
            </div>
            <div class='content ${classMap({ collapsed: !open })}'>
                <slot></slot>
            </div>
         </div> 
		`;
	}

	static get tag() {
		return 'collapsable-content';
	}

	set disabled(value) {
		this.signal(Update_Disabled, value);
	}

	get disabled() {
		return this.getModel().disabled;
	}

	set label(value) {
		this.signal(Update_Label, value);
	}

	get label() {
		return this.getModel().label;
	}

	set open(value) {
		this.signal(Update_Open, open);
	}

	get open() {
		return this.getModel().open;
	}


}
