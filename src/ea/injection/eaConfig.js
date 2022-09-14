import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { ManageModulesPlugin } from '../plugins/ManageModulesPlugin';
import { LegendPlugin } from '../plugins/LegendPlugin';
import { WebAnalyticsPlugin } from '../plugins/WebAnalyticsPlugin';
import { WmsCapabilitiesService } from '../services/WmsCapabilitiesService';
import { LayerVisibilityNotificationPlugin } from '../plugins/LayerVisibilityNotificationPlugin';
import { GeoResourceInfoService } from '../../modules/geoResourceInfo/services/GeoResourceInfoService';
import { loadEabGeoResourceDetailInfo } from '../services/provider/geoResourceDetailInfoResult.provider';

export const eaConfig = () => {
	$injector
		.registerSingleton('WmsCapabilitiesService', new WmsCapabilitiesService())
		.registerSingleton('GeoResourceDetailInfoService', new GeoResourceInfoService(loadEabGeoResourceDetailInfo))
		.registerSingleton('FnModulePlugin', new FnModulePlugin())
		.registerSingleton('ManageModulesPlugin', new ManageModulesPlugin())
		.registerSingleton('LegendPlugin', new LegendPlugin())
		.registerSingleton('WebAnalyticsPlugin', new WebAnalyticsPlugin())
		.registerSingleton('LayerVisibilityNotificationPlugin', new LayerVisibilityNotificationPlugin())
		.registerModule(eaMapModule);
};

