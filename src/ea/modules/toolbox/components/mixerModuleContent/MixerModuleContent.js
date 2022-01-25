import { html } from 'lit-html';
import { $injector } from '../../../../../injection';

import css from './mixerModuleContent.css';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';

const IFRAME = 'myMixerIFrame';
const POPUP_ID = 'module-container';

/**
 * @class
 * @author kunze_ge
 */
export class MixerModuleContent extends AbstractModuleContent {

    constructor() {
        super();

        const {TranslationService: translationService, EnvironmentService: environmentService, UnitsService: unitsService, UrlService: urlService} = $injector.inject('TranslationService', 'EnvironmentService', 'UnitsService', 'UrlService');
        this._translationService = translationService;
        this._environmentService = environmentService;
        this._unitsService = unitsService;
//		this._shareService = shareService;
        this._urlService = urlService;
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
        const {active, statistic} = state;
        this._tool.active = active;
        const {HttpService: httpService, ConfigService: configService} = $injector.inject('HttpService', 'ConfigService');

        this._moduleDomain = `${configService.getValueAsPath('MODULE_BACKEND_URL')}`;
        this._moduleSite = 'mixer';
        this._parameter = [];
        this._moduleRequestUrl = this._moduleDomain + this._moduleSite + '?' + this._parameter;

//                const result = await httpService.get(url);
//
//        if (result.ok) {
//        return await result.json();
//        }
//        throw new Error(`Catalog for '${topicId}' could not be loaded`);

        return html`
        <style>${css}</style>
            	<div class="ba-tool-container">
                	<div class="ba-tool-container__title"> 
						${translate('toolbox_mixer_header')}                   
                	</div>  
                <div class="tab-content">
                        <div style="height: 100%;" >
                            <div id="myMixerIFrame" style="height: 100%;padding:30px"></div>
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

    asyncInitialization(parameter) {}

    initMixer(agent) {
        console.log('init Mixer');
//        agent.setPopupPosition(agent.parent.parent);
    }
    ;
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
//                    this.asyncInitialization(parameter).then(function(data) {
                // success
                window.console.log('callInit');
                agent.initMixer(agent);
                agent.setPopupPosition(ifrm.parentElement);
//                        return true;
//                    }, function(errData) {
//                        // error
//                        console.log('errData mixerDirective' + errData);
//                    });
            } catch (ex) {
                // Mixer Modul bereits geöffnet
                console.log('Exception beim laden des Iframes ' + this._moduleDomain + this._moduleSite);
                console.log(ex);
//                $scope.options.moduleReset();
            }
        }
    }

    onAfterRender(first) {
        super.onAfterRender(first);
        this.callModul(first);
    }

    static get tag() {
        return 'ea-module-mixer-content';
    }
}
