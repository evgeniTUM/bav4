import { html } from 'lit-html';
import { MvuElement } from '../../../../MvuElement';
import contentPanelCss from './abstractContentPanel.css';

/**
 * Base class for all content panels of the main menu.
 * Just prepends common CSS classes.
 * @class
 * @author taulinger
 * @abstract
 */
export class AbstractContentPanel extends MvuElement {

	constructor() {
		super();
		if (this.constructor === AbstractContentPanel) {
			// Abstract class can not be constructed.
			throw new TypeError('Can not construct abstract class.');
		}
	}

	/**
    * @override
    */
	defaultCss() {
		return html`
		${super.defaultCss()}
		<style>
		    ${contentPanelCss}
		</style>
		`;
	}
}
