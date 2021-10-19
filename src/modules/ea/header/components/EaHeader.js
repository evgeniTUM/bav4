import '../../../header/i18n';
import { html } from 'lit-html';
import { Header } from '../../../header/components/Header';
import css from './ea_header.css';

/**
 * Container element for header stuff customized for Energieatlas.
 * @class
 * @author kunze_ge
 */
export class EaHeader extends Header {

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

//    Erweiterung des CSS Imports um EAB spezifische Style definitionen
        defaultCss() {
            return html`${this.extendedCss()} ${super.defaultCss()}`;
	}
        
        static get tag() {
		return 'ea-header';
	}
}
