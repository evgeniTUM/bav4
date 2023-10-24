import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { ManageModulesPlugin } from '../plugins/ManageModulesPlugin';
import { LegendPlugin } from '../plugins/LegendPlugin';
import { WebAnalyticsPlugin } from '../plugins/WebAnalyticsPlugin';
import { WmsCapabilitiesService } from '../services/WmsCapabilitiesService';
import { ResearchService } from '../services/ResearchService';
import { LayerVisibilityNotificationPlugin } from '../plugins/LayerVisibilityNotificationPlugin';
import { InfoPopupPlugin } from '../plugins/InfoPopupPlugin';
import { EaInfoPopupService } from '../services/EaInfoPopupService';
import { CookieService } from '../services/CookieService';

export const eaConfig = () => {
	$injector
		.registerSingleton('WmsCapabilitiesService', new WmsCapabilitiesService())
		.registerSingleton('FnModulePlugin', new FnModulePlugin())
		.registerSingleton('ManageModulesPlugin', new ManageModulesPlugin())
		.registerSingleton('LegendPlugin', new LegendPlugin())
		.registerSingleton('WebAnalyticsPlugin', new WebAnalyticsPlugin())
		.registerSingleton('InfoPopupPlugin', new InfoPopupPlugin())
		.registerSingleton('LayerVisibilityNotificationPlugin', new LayerVisibilityNotificationPlugin())
		.registerSingleton('EaInfoPopupService', new EaInfoPopupService())
		.registerSingleton('ResearchService', new ResearchService())
		.register('CookieService', CookieService)
		.registerModule(eaMapModule);
};
