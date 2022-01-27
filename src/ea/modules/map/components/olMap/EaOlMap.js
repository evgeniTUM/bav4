import { html } from 'lit-html';
import { OlMap }  from '../../../../../modules/map/components/olMap/OlMap'
import css from './olMap.css';


const Update_Position = 'update_position';
const Update_Layers = 'update_layers';

/**
 * Element which renders the ol map.
 * @class
 * @author kunze
 */
export class EaOlMap extends OlMap {


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

	/**
	 * @override
	 */
	static get tag() {
		return 'ea-ol-map';
	}
}
