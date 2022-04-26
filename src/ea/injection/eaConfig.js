import { $injector } from '../../injection/';

import { eaMapModule } from '../modules/map/injection/';
import { FnModulePlugin } from '../plugins/FnModulePlugin';
import { ManageModuleLayersPlugin } from '../plugins/ManageModuleLayersPlugin';


$injector
	.registerSingleton('FnModulePlugin', new FnModulePlugin())
	.registerSingleton('ManageModuleLayersPlugin', new ManageModuleLayersPlugin())
	.registerModule(eaMapModule) ;

