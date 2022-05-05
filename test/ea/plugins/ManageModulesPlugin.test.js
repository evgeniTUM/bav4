import { CONTRIBUTION_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/contribution/OlContributionHandler.js';
import { GEO_FEATURE_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler.js';
import { EAContribution } from '../../../src/ea/modules/toolbox/components/contribution/EAContribution.js';
import { MixerModuleContent } from '../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent.js';
import { RedesignModuleContent } from '../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent.js';
import { ResearchModuleContent } from '../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent.js';
import { ManageModulesPlugin } from '../../../src/ea/plugins/ManageModulesPlugin.js';
import { setCurrentModule } from '../../../src/ea/store/module/module.action.js';
import { moduleReducer } from '../../../src/ea/store/module/module.reducer.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { createMainMenuReducer } from '../../../src/store/mainMenu/mainMenu.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('ManageModulesPlugin', () => {

	const setup = (state) => {

		const store = TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			module: moduleReducer,
			mainMenu: createMainMenuReducer()
		});

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

});
