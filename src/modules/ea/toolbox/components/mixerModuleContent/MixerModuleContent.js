import { html } from 'lit-html';
import { $injector } from '../../../../../injection';

import css from './mixerModuleContent.css';
import { AbstractModuleContent } from '../moduleContainer/AbstractModuleContent';
/**
 * @class
 * @author kunze_ge
 */
export class MixerModuleContent extends AbstractModuleContent {

	constructor() {
		super();

		const { TranslationService: translationService, EnvironmentService: environmentService, UnitsService: unitsService, UrlService: urlService } = $injector.inject('TranslationService', 'EnvironmentService', 'UnitsService', 'UrlService');
		this._translationService = translationService;
		this._environmentService = environmentService;
		this._unitsService = unitsService;
//		this._shareService = shareService;
		this._urlService = urlService;
		this._tool = {
			name: 'measure',
			active: false,
			title: 'toolbox_measureTool_measure',
			icon: 'measure'
		};
		this._isFirstMeasurement = true;
		this._shareAsReadOnly = false;
		this._shareUrls = null;
	}

	createView(state) {
		const translate = (key) => this._translationService.translate(key);
		const { active, statistic } = state;
		this._tool.active = active;
                const { HttpService: httpService, ConfigService: configService } = $injector.inject('HttpService', 'ConfigService');
//                const mixermodule = `${configService.getValueAsPath('MODULE_BACKEND_URL')}mixer`;
                
//                const result = await
//        httpService.get(url);
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
                            <div id="myMixerIFrame" style="height: 100%;padding:30px">
                            <p>hier wird zukünftig die externe Zusatzfunktion Mischpult angezeigt</p>
                                <!--<iframe src="mixermodule" style="width: 100%; height: 100%; border: 1px solid rgb(44, 90, 147);"></iframe>-->
                            </div>
                         </div>
                </div>
            	</div>
            </div>
        `;
	}

	static get tag() {
		return 'ea-module-mixer-content';
	}
}
