import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { GeoFeaturePlugin } from '../plugins/GeoFeaturePlugin';


$injector
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerSingleton('GeoFeaturePlugin', new GeoFeaturePlugin())
	.registerModule(eaMapModule) ;

