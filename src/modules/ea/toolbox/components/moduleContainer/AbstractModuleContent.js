import { html } from 'lit-html';
import { BaElement } from '../../../../BaElement';
import toolContentCss from './abstractModuleContent.css';

/**
 * Base class for all ModuleContent panels.
 * @class
 * @author kunze_ge
 * @abstract
 */
export class AbstractModuleContent extends BaElement {

	constructor() {
		super();
		if (this.constructor === AbstractModuleContent) {
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
		    ${toolContentCss}
		</style>
		`;
	}
}
