import { html } from 'lit-html';
import css from './collapsableContent.css';
import { classMap } from 'lit-html/directives/class-map.js';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../utils/markup';
import { AbstractMvuContentPanel } from '../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';


const Update_Disabled = 'update_disabled';
const Update_Open = 'update_open';
const Update_Title = 'update_title';

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
			case Update_Title:
				return { ...model, title: data };
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const { disabled, open } = model;

		const onClick = () => {
			this.signal(Update_Open, !open);
		};

		const titleAttribute = this.getAttribute('title');
		const title = titleAttribute ? titleAttribute : model.title;

		return html`
		<style>${css}</style> 
        <div class='ba-section divider ${classMap({ disabled: disabled })}'>
            <div class='header ba-list-item' @click=${onClick}>
                <span .title='visible-title'  class='ba-list-item__text ba-list-item__primary-text' tabindex='0' .checked='true' >${title}</span>
                <button data-test-id class='ba-list-item__after' title="collapse-title"  ?disabled=${disabled}>
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

	set title(value) {
		this.signal(Update_Title, value);
	}

	get title() {
		return this.getModel().title;
	}

	set open(value) {
		this.signal(Update_Open, value);
	}

	get open() {
		return this.getModel().open;
	}


}
