import { CONTRIBUTION_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/contribution/OlContributionHandler.js';
import { GEO_FEATURE_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler.js';
import { EAContribution } from '../../../src/ea/modules/toolbox/components/contribution/EAContribution.js';
import { MixerModuleContent } from '../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent.js';
import { RedesignModuleContent } from '../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent.js';
import { ResearchModuleContent } from '../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent.js';
import { ManageModulesPlugin } from '../../../src/ea/plugins/ManageModulesPlugin.js';
import { activateGeoResource, deactivateGeoResource, setCurrentModule } from '../../../src/ea/store/module/module.action.js';
import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { layersReducer, LAYER_ADDED, LAYER_REMOVED } from '../../../src/store/layers/layers.reducer.js';
import { createMainMenuReducer } from '../../../src/store/mainMenu/mainMenu.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('ManageModulesPlugin', () => {

	const geoResourceServiceMock = { byId: () => ({ label: 'label' }) };

	const storeActions = [];

	const setup = (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			layers: layersReducer,
			module: moduleReducer,
			mainMenu: createMainMenuReducer()
		});

		$injector
			.registerSingleton('GeoResourceService', geoResourceServiceMock);
		return store;
	};

	it('toggles contribution layer when tool ID equals tag of contribution component', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		setCurrentModule(EAContribution.tag);

		expect(store.getState().layers.active.length).toBe(1);
		expect(store.getState().layers.active[0].id).toBe(CONTRIBUTION_LAYER_ID);

		setCurrentModule('something');

		expect(store.getState().layers.active.length).toBe(0);
	});

	it('toggles geofeature layer when tool ID equals tag of mixer/research/redesign component', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		[MixerModuleContent.tag, RedesignModuleContent.tag, ResearchModuleContent.tag].forEach(tag => {
			setCurrentModule(tag);

			expect(store.getState().layers.active.length).toBe(1);
			expect(store.getState().layers.active[0].id).toBe(GEO_FEATURE_LAYER_ID);
			expect(store.getState().layers.active[0].label).toBe('Verwaltungseinheiten');

			setCurrentModule('something');

			expect(store.getState().layers.active.length).toBe(0);

		});
	});


	it('toggles the main menu when opening/closing a module', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().mainMenu.open).toBeTrue();

		setCurrentModule(MixerModuleContent.tag);
		expect(store.getState().mainMenu.open).toBeFalse();

		setCurrentModule(ResearchModuleContent.tag);
		expect(store.getState().mainMenu.open).toBeFalse();

		setCurrentModule('something');
		expect(store.getState().mainMenu.open).toBeTrue();
	});

	it('activates a georesource', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);
		spyOn(geoResourceServiceMock, 'byId').and.returnValue({ label: 'label-for-42' });

		activateGeoResource('42');

		expect(geoResourceServiceMock.byId).toHaveBeenCalledWith('42');

		const actions = storeActions.filter(a => a.type === LAYER_ADDED);
		expect(actions).toHaveSize(1);
		expect(actions[0].payload).toEqual({
			id: 'module-georesource-42',
			properties: {
				geoResourceId: '42',
				label: 'label-for-42'
			}
		});
	});

	it('activates a georesource only once', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		activateGeoResource('42');
		activateGeoResource('42');

		const actions = storeActions.filter(a => a.type === LAYER_ADDED);
		expect(actions).toHaveSize(1);
	});

	it('deactivates a georesource', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);
		activateGeoResource('42');

		deactivateGeoResource('42');

		const actions = storeActions.filter(a => a.type === LAYER_REMOVED);
		expect(actions).toHaveSize(1);
		expect(actions[0].payload).toEqual('module-georesource-42');
	});

});
