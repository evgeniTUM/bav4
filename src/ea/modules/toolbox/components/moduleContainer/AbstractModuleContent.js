import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { MvuElement } from '../../../../../modules/MvuElement';
import { openFnModuleComm } from '../../../../store/fnModuleComm/fnModuleComm.action';
import toolContentCss from './abstractModuleContent.css';

/**
 * Base class for all ModuleContent panels.
 * @class
 * @author kunze_ge
 * @abstract
 */
export class AbstractModuleContent extends MvuElement {

	constructor() {
		super();

		const {
			TranslationService: translationService,
			ConfigService: configService
		} = $injector.inject('TranslationService', 'ConfigService');
		this._translationService = translationService;
		this._configService = configService;
		this._moduleDomain = null;
		this._shareUrls = null;


		if (this.constructor === AbstractModuleContent) {
			// Abstract class can not be constructed.
			throw new TypeError('Can not construct abstract class.');
		}
	}

	getConfig() {
		throw new TypeError('Class has to override method \'getConfig\'');
	}

	createView(state) {
		this._moduleDomain = this._configService.getValueAsPath('MODULE_BACKEND_URL');
		this._parameter = [];
		this._moduleRequestUrl = this._moduleDomain + this.getConfig().site + '?' + this._parameter;

		return html`
            	<div class="ba-tool-container">
                	<div class="ba-tool-container__title"> 
						${this.getConfig().header_title}                   
                	</div>  
                <div class="tab-content">
                        <div style="height: 100%;" >
                            <div id="${this.getConfig().iframe}" class="iframe_container" align="right">
								<iframe id="${this.getConfig().frame_id}" class="iframe" src="${this._moduleRequestUrl}"/>
							</div>
                         </div>
                </div>
            	</div>
            </div>
        `;
	}

	async asyncInitialization(site, domain, pWindow) {
		try {
			const myPromise = new Promise(function (resolve) {
				setTimeout(function () {
					openFnModuleComm(site, domain, pWindow);
				}, 1000);
			});
			return true;
		}
		catch (ex) {
			return ex;
		}
	}

	callModul(first) {

		const ifrm = this.shadowRoot.getElementById(this.getConfig().frame_id);
		const myWindow = ifrm.contentWindow;
		const agent = this;
		const site = this.getConfig().site;

		ifrm.onload = function () {
			try {
				agent.asyncInitialization(site, agent._moduleDomain, myWindow).then(function (data) {
					// success
					return true;
				}, function (errData) {
					// error
					console.error('errData mixerDirective' + errData);
				});
			}
			catch (ex) {
				// Modul bereits geöffnet
				console.error('Exception beim laden des Iframes ' + agent._moduleDomain + site);
			}
		};
	}

	onAfterRender(first) {
		super.onAfterRender(first);
		this.callModul(first);
		this.offsetParent.style.width = '40em';
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
