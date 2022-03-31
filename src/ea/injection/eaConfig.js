import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { GeoFeaturePlugin } from '../plugins/GeoFeaturePlugin';
import { ManageModuleLayersPlugin } from '../plugins/ManageModuleLayersPlugin';


$injector
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerSingleton('GeoFeaturePlugin', new GeoFeaturePlugin())
	.registerSingleton('ManageModuleLayersPlugin', new ManageModuleLayersPlugin())
	.registerModule(eaMapModule) ;

