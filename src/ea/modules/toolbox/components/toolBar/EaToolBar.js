import { html } from 'lit-html';
import css from './eaToolBar.css';
import { ToolBar } from '../../../../../modules/toolbox/components/toolBar/ToolBar'


/**
 * EAB Customized Container for Tools
 *
 * @class
 * @author kunze_ge
 */
export class EaToolBar extends ToolBar {

	constructor() {
		super();
                }
                
        extendedCss() {
		return html`
		<style>
		${css}
		</style>
		`;
	}

        defaultCss() {
            return html`${super.defaultCss()} ${this.extendedCss()}`;
	}

	static get tag() {
		return 'ea-tool-bar';
	}
}
