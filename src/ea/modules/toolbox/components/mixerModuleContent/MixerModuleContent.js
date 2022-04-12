import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { openFnModuleComm } from '../../../../store/fnModuleComm/fnModuleComm.action';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';
import css from './mixerModuleContent.css';


const IFRAME = 'myMixerIFrame';
const MODULE_SITE = 'mixer';

/**
 * @class
 * @author kunze_ge
 */
export class MixerModuleContent extends AbstractModuleContent {

	constructor() {
		super();

		const {
			TranslationService: translationService,
			ConfigService: configService
		} = $injector.inject('TranslationService', 'ConfigService');
		this._translationService = translationService;
		this._configService = configService;
		this._moduleDomain = null;
		this._tool = {
			name: 'mixer',
			active: false,
			title: 'toolbox_mixerTool_mixer',
			icon: 'mixer'
		};
		this._shareUrls = null;
	}

	createView(state) {
		const translate = (key) => this._translationService.translate(key);
		const { active, statistic } = state;
		this._tool.active = active;

		this._moduleDomain = this._configService.getValueAsPath('MODULE_BACKEND_URL');
		this._parameter = [];
		this._moduleRequestUrl = this._moduleDomain + MODULE_SITE + '?' + this._parameter;

		return html`
        <style>${css}</style>
            	<div class="ba-tool-container">
                	<div class="ba-tool-container__title"> 
						${translate('toolbox_mixer_header')}                   
                	</div>  
                <div class="tab-content">
                        <div style="height: 100%;" >
                            <div id="${IFRAME}" class="iframe_container" align="right">
								<iframe id="mixer_iframe" class="iframe" src="${this._moduleRequestUrl}"/>
							</div>
                         </div>
                </div>
            	</div>
            </div>
        `;
	}

	async asyncInitialization(site, domain, pWindow) {
		try {
			let myPromise = new Promise(function (resolve) {
				setTimeout(function () {
					openFnModuleComm(site, domain, pWindow)
				}, 1000);
			});
			return true;
		}
		catch (ex) {
			return ex;
		}
	}

	callModul(first) {

		let ifrm = this.shadowRoot.getElementById('mixer_iframe');
		let myWindow = ifrm.contentWindow;
		let agent = this;

		ifrm.onload = function () {
			try {
				agent.asyncInitialization(MODULE_SITE, agent._moduleDomain, myWindow).then(function (data) {
					// success
					return true;
				}, function (errData) {
					// error
					console.log('errData mixerDirective' + errData);
				});
			}
			catch (ex) {
				// Mixer Modul bereits geöffnet
				console.log('Exception beim laden des Iframes ' + agent._moduleDomain + MODULE_SITE);
				console.log(ex);
				//                $scope.options.moduleReset();
			}
		};
	}

	onAfterRender(first) {
		super.onAfterRender(first);
		this.callModul(first);
		this.offsetParent.style.width = '40em';
	}

	static get tag() {
		return 'ea-module-mixer-content';
	}
}
