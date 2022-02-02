import { html } from 'lit-html';
import { OlMap }  from '../../../../../modules/map/components/olMap/OlMap';
import css from './olMap.css';

/**
 * Element which extendedrenders the ol map.
 * @class
 * @author kunze
 */
export class EaOlMap extends OlMap {

	constructor() {
		super();
        }
        
	/**
	 * @override
         * observeModel('updateSize' .. ) is no longer needed if this behavior is implemented 
         *  in the parent class
	 */
	onInitialize() {
            super.onInitialize();
              this.observeModel('updateSize', () => {
			this._viewSyncBlocked = true;
			this._map.updateSize();
                        this._viewSyncBlocked = false;
		});
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
