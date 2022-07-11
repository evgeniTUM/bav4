import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { ManageModulesPlugin } from '../plugins/ManageModulesPlugin';
import { LegendPlugin } from '../plugins/LegendPlugin';
import { WmsCapabilitiesService } from '../services/WmsCapabilitiesService';


$injector
	.registerSingleton('WmsCapabilitiesService', new WmsCapabilitiesService())
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerSingleton('ManageModulesPlugin', new ManageModulesPlugin())
	.registerSingleton('LegendPlugin', new LegendPlugin())
	.registerModule(eaMapModule) ;

