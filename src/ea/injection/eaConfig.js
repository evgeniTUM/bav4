import { $injector } from '../../injection/';

import { FnModulePlugin } from '../plugins/FnModulePlugin';

$injector
	.registerSingleton('FnModulePlugin', new FnModulePlugin());
