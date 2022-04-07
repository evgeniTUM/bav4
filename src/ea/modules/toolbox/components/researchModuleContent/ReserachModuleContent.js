import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { openFnModuleComm  } from '../../../../store/fnModuleComm/fnModuleComm.action';

import css from './researchModuleContent.css';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';

const IFRAME = 'myResearchIFrame';
const POPUP_ID = 'module-container';
const MODULE_SITE = 'recherche';

/**
 * @class
 * @author kunze_ge
 */
export class ResearchMOduleContent extends AbstractModuleContent {

	constructor() {
		super();

		const {TranslationService: translationService, EnvironmentService: environmentService, UnitsService: unitsService, UrlService: urlService} = $injector.inject('TranslationService', 'EnvironmentService', 'UnitsService', 'UrlService');
		this._translationService = translationService;
		this._environmentService = environmentService;
		this._unitsService = unitsService;
//		this._shareService = shareService;
		this._moduleDomain = null;
		this._urlService = urlService;
		this._tool = {
			name: 'research',
			active: false,
			title: 'toolbox_researchTool_research',
			icon: 'research'
		};
		this._shareUrls = null;
	}

	createView(state) {
		const translate = (key) => this._translationService.translate(key);
		const {active, statistic} = state;
		this._tool.active = active;
		const {HttpService: httpService, ConfigService: configService} = $injector.inject('HttpService', 'ConfigService');

		this._moduleDomain = `${configService.getValueAsPath('MODULE_BACKEND_URL')}`;
		this._parameter = [];
		this._moduleRequestUrl = this._moduleDomain + MODULE_SITE + '?' + this._parameter;

		return html`
        <style>${css}</style>
            	<div class="ba-tool-container">
                	<div class="ba-tool-container__title"> 
						${translate('toolbox_recherche_header')}                   
                	</div>  
                <div class="tab-content">
                        <div style="height: 100%;" >
                            <div id="myResearchIFrame" style="height: 100%;padding:30px"></div>
                         </div>
                </div>
            	</div>
            </div>
        `;
	}

	setPopupPosition(popup) {

		popup.style.setProperty('height', '95%', '');
		popup.style.setProperty('width', '100%', '');
		popup.style.setProperty('max-height', '100%', '');
//        popup.style.setProperty('max-width', '600px', '');
//        popup.style.setProperty('resize', 'both', '');
		popup.setAttribute('align', 'right');
	}

	async asyncInitialization(site, domain, pWindow) {
		try {
			let myPromise = new Promise(function(resolve) {
				setTimeout(function() {
					openFnModuleComm(site, domain, pWindow)
				}, 1000);
			});
			return true;
		} catch (ex) {
			return ex;
		}
	}
	
	callModul(first) {

		let iframeRoot = this.shadowRoot.getElementById(IFRAME);

		if (iframeRoot === null) {
			console.log('iframe ' + IFRAME + ' not found');
//                $scope.options.moduleReset();
			return;
		}
		if (iframeRoot && iframeRoot.firstElementChild) {
			console.log(iframeRoot);
			console.log('children iframe ' + IFRAME + ' already exists');
//                $scope.options.moduleReset();
			return;
		}

		var parameter = [];

		//  **********   Öffnen des externen Links in IFRAME  ***************
		var ifrm = document.createElement('IFRAME');

		ifrm.setAttribute('src', this._moduleRequestUrl);
		ifrm.style.width = 100 + '%';
		ifrm.style.height = 100 + '%';
		ifrm.style.allowTransparency = 'true';
		ifrm.style.border = '1px solid rgba(44, 90, 147, 1)';

		iframeRoot.appendChild(ifrm);
		iframeRoot.style.setProperty('height', '100%', '');
		//              setPopupPosition();
		let myWindow = ifrm.contentWindow;
		let agent = this;

		ifrm.onload = function() {
			try {
				agent.asyncInitialization(MODULE_SITE, agent._moduleDomain, myWindow).then(function(data) {
					// success
					agent.setPopupPosition(ifrm.parentElement);
					return true;
				}, function(errData) {
					// error
					console.log('errData researchDirective' + errData);
				});
			} catch (ex) {
				console.log('Exception beim laden des Iframes ' + agent._moduleDomain + MODULE_SITE);
				console.log(ex);
			}
		}
	}

	onAfterRender(first) {
		super.onAfterRender(first);
		this.callModul(first);
		this.offsetParent.style.width = '40em';
	}

	static get tag() {
		return 'ea-module-research-content';
	}
}
