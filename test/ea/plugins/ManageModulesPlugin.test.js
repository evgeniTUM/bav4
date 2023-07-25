import { QueryParameters } from '../../../src/domain/queryParameters.js';
import { SELECT_LOCATION_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/selection/OlSelectLocationHandler.js';
import { GEO_FEATURE_LAYER_ID } from '../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler.js';
import { Analyse3DModuleContent } from '../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent.js';
import { EnergyMarketModuleContent } from '../../../src/ea/modules/toolbox/components/contribution/EnergyMarketModuleContent.js';
import { GeothermModuleContent } from '../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent.js';
import { MixerModuleContent } from '../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent.js';
import { RedesignModuleContent } from '../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent.js';
import { ResearchModuleContent } from '../../../src/ea/modules/toolbox/components/research/ResearchModuleContent.js';
import { ManageModulesPlugin } from '../../../src/ea/plugins/ManageModulesPlugin.js';
import { CLEAR_MAP } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { activateGeoResource, deactivateGeoResource, EaModulesQueryParameters, setCurrentModule } from '../../../src/ea/store/module/ea.action.js';
import { DEACTIVATE_ALL_GEORESOURCES, eaReducer, SET_CURRENT_MODULE } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { FEATURE_INFO_REQUEST_ABORT } from '../../../src/store/featureInfo/featureInfo.reducer.js';
import { CLEAR_FEATURES } from '../../../src/store/highlight/highlight.reducer.js';
import { layersReducer, LAYER_ADDED, LAYER_REMOVED } from '../../../src/store/layers/layers.reducer.js';
import { createMainMenuReducer } from '../../../src/store/mainMenu/mainMenu.reducer.js';
import { LevelTypes } from '../../../src/store/notifications/notifications.action.js';
import { NOTIFICATION_ADDED } from '../../../src/store/notifications/notifications.reducer.js';
import { TestUtils } from '../../test-utils.js';
import { EnergyReportingModuleContent } from '../../../src/ea/modules/toolbox/components/contribution/EnergyReportingModuleContent.js';
import { addLayer } from '../../../src/store/layers/layers.action.js';

describe('ManageModulesPlugin', () => {
	const windowMock = {
		location: {
			get search() {
				return null;
			}
		}
	};

	const geoResourceServiceMock = { byId: () => ({ label: 'label' }) };
	const environmentServiceMock = { getWindow: () => windowMock };

	const storeActions = [];

	const setup = (state) => {
		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			layers: layersReducer,
			ea: eaReducer,
			mainMenu: createMainMenuReducer()
		});

		$injector.registerSingleton('GeoResourceService', geoResourceServiceMock).registerSingleton('EnvironmentService', environmentServiceMock);
		return store;
	};

	it('toggles select location layer when tool ID equals name of energy-market/energy-reporting/geotherm component', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		[EnergyMarketModuleContent.name, EnergyReportingModuleContent.name, GeothermModuleContent.name].forEach((tag) => {
			setCurrentModule(tag);

			expect(store.getState().layers.active.length).toBe(1);
			expect(store.getState().layers.active[0].id).toBe(SELECT_LOCATION_LAYER_ID);
			expect(store.getState().layers.active[0].label).toBe('Standortselektion');

			setCurrentModule('something');

			expect(store.getState().layers.active.length).toBe(0);
		});
	});

	it('toggles geofeature layer when tool ID equals name of mixer/research/redesign component', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		[MixerModuleContent.name, RedesignModuleContent.name, ResearchModuleContent.name, Analyse3DModuleContent.name].forEach((tag) => {
			setCurrentModule(tag);

			expect(store.getState().layers.active.length).toBe(1);
			expect(store.getState().layers.active[0].id).toBe(GEO_FEATURE_LAYER_ID);
			expect(store.getState().layers.active[0].label).toBe('Verwaltungseinheiten');

			setCurrentModule('something');

			expect(store.getState().layers.active.length).toBe(0);
		});
	});

	it('when opening a module, closes the main menu', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().mainMenu.open).toBeTrue();

		setCurrentModule(MixerModuleContent.name);
		expect(store.getState().mainMenu.open).toBeFalse();

		setCurrentModule(ResearchModuleContent.name);
		expect(store.getState().mainMenu.open).toBeFalse();
	});

	describe('when closing a module, ', () => {
		let store;

		beforeEach(async () => {
			store = setup();

			const instanceUnderTest = new ManageModulesPlugin();
			await instanceUnderTest.register(store);

			expect(store.getState().mainMenu.open).toBeTrue();

			setCurrentModule(MixerModuleContent.name);
			setCurrentModule('something');
		});

		it('opens the main menu', async () => {
			expect(store.getState().mainMenu.open).toBeTrue();
		});

		it('clears map', async () => {
			expect(storeActions.filter((a) => a.type === CLEAR_MAP).length).toBeGreaterThan(0);
		});

		it('clears active georesources', async () => {
			expect(storeActions.filter((a) => a.type === DEACTIVATE_ALL_GEORESOURCES).length).toBeGreaterThan(0);
		});

		it('resets featureInfo state', async () => {
			expect(storeActions.filter((a) => a.type === FEATURE_INFO_REQUEST_ABORT).length).toBeGreaterThan(0);
		});

		it('clears highlight features', async () => {
			expect(storeActions.filter((a) => a.type === CLEAR_FEATURES).length).toBeGreaterThan(0);
		});
	});

	describe('when switching module, ', () => {
		let store;

		beforeEach(async () => {
			store = setup();

			const instanceUnderTest = new ManageModulesPlugin();
			await instanceUnderTest.register(store);

			expect(store.getState().mainMenu.open).toBeTrue();

			setCurrentModule(MixerModuleContent.name);
			setCurrentModule(ResearchModuleContent.name);
		});

		it('clears map', async () => {
			expect(storeActions.filter((a) => a.type === CLEAR_MAP).length).toBeGreaterThan(0);
		});

		it('clears active georesources', async () => {
			expect(storeActions.filter((a) => a.type === DEACTIVATE_ALL_GEORESOURCES).length).toBeGreaterThan(0);
		});

		it('resets featureInfo state', async () => {
			expect(storeActions.filter((a) => a.type === FEATURE_INFO_REQUEST_ABORT).length).toBeGreaterThan(0);
		});

		it('clears highlight features', async () => {
			expect(storeActions.filter((a) => a.type === CLEAR_FEATURES).length).toBeGreaterThan(0);
		});
	});

	it('activates a georesource layer', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);
		spyOn(geoResourceServiceMock, 'byId').and.returnValue({ label: 'label-for-42' });

		activateGeoResource('42');

		expect(geoResourceServiceMock.byId).toHaveBeenCalledWith('42');

		const actions = storeActions.filter((a) => a.type === LAYER_ADDED && a.payload.id === 'module-georesource-42');

		expect(actions).toHaveSize(1);
		expect(actions[0].payload).toEqual({
			id: 'module-georesource-42',
			properties: {
				geoResourceId: '42',
				label: 'label-for-42'
			}
		});
	});

	it('activates a georesource layer only once', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		activateGeoResource('42');
		activateGeoResource('42');

		const actions = storeActions.filter((a) => a.type === LAYER_ADDED && a.payload.id === 'module-georesource-42');
		expect(actions).toHaveSize(1);
	});

	it('do not activates a georesource if already active', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);

		addLayer('42');
		activateGeoResource('42');

		const actions = storeActions.filter((a) => a.type === LAYER_ADDED && a.payload.id === 'module-georesource-42');
		expect(actions).toHaveSize(0);
	});

	it('deactivates a georesource layer', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModulesPlugin();
		await instanceUnderTest.register(store);
		activateGeoResource('42');

		deactivateGeoResource('42');

		const actions = storeActions.filter((a) => a.type === LAYER_REMOVED && a.payload === 'module-georesource-42');
		expect(actions).toHaveSize(1);
		expect(actions[0].payload).toEqual('module-georesource-42');
	});

	describe('processing of query parameter comp, ', () => {
		it('opens ea module', async () => {
			jasmine.clock().install();

			const testCase = EaModulesQueryParameters[0];

			const store = setup();

			const queryParam = QueryParameters.EA_MODULE + '=' + testCase.parameter;
			spyOnProperty(windowMock.location, 'search').and.returnValue(queryParam);

			const instanceUnderTest = new ManageModulesPlugin();
			await instanceUnderTest.register(store);

			jasmine.clock().tick(101);

			const actions = storeActions.filter((a) => a.type === SET_CURRENT_MODULE);
			expect(actions).toHaveSize(1);
			expect(actions[0].payload).toEqual(testCase.name);

			jasmine.clock().uninstall();
		});

		it('emits error when "comp" value is invalid', async () => {
			const store = setup();

			const queryParam = QueryParameters.EA_MODULE + '=invalid';
			spyOnProperty(windowMock.location, 'search').and.returnValue(queryParam);

			const instanceUnderTest = new ManageModulesPlugin();
			await instanceUnderTest.register(store);

			const actions = storeActions.filter((a) => a.type === NOTIFICATION_ADDED);
			expect(actions).toHaveSize(1);
			expect(actions[0].payload._payload.content).toEqual('No module: "invalid".');
			expect(actions[0].payload._payload.level).toEqual(LevelTypes.ERROR);
		});
	});
});
