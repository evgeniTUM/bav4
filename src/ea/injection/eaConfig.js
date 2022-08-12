import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { ManageModulesPlugin } from '../plugins/ManageModulesPlugin';
import { LegendPlugin } from '../plugins/LegendPlugin';
import { WebAnalyticsPlugin } from '../plugins/WebAnalyticsPlugin';
import { WmsCapabilitiesService } from '../services/WmsCapabilitiesService';
import { LayerVisibilityNotificationPlugin } from '../plugins/LayerVisibilityNotificationPlugin';


$injector
	.registerSingleton('WmsCapabilitiesService', new WmsCapabilitiesService())
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerSingleton('ManageModulesPlugin', new ManageModulesPlugin())
	.registerSingleton('LegendPlugin', new LegendPlugin())
	.registerSingleton('WebAnalyticsPlugin', new WebAnalyticsPlugin())
	.registerSingleton('LayerVisibilityNotificationPlugin', new LayerVisibilityNotificationPlugin())
	.registerModule(eaMapModule) ;

