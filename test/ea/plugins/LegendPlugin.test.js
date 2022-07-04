import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { createMainMenuReducer } from '../../../src/store/mainMenu/mainMenu.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('ManageModulesPlugin', () => {

	const geoResourceServiceMock = { byId: () => ({ label: 'label' }) };


	const setup = (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			module: moduleReducer
		});

		$injector
			.registerSingleton('GeoResourceService', geoResourceServiceMock);
		return store;
	};


});
