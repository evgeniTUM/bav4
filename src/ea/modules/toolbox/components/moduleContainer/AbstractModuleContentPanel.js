/**
 * @module ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel
 */
import { html } from 'lit-html';
import moduleContentPanelCss from './abstractModuleContentPanel.css';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';

/**
 * Base class for all content panels of modules .
 * Just prepends common CSS classes.
 * @class
 * @author kunzege
 * @abstract
 */
export class AbstractModuleContentPanel extends AbstractMvuContentPanel {
	constructor(model = {}) {
		super(model);
		if (this.constructor === AbstractModuleContentPanel) {
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
				${moduleContentPanelCss}
			</style>
		`;
	}
}
