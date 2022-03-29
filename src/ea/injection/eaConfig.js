import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';

$injector
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerModule(eaMapModule) ;

