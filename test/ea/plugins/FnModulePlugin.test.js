import { FnModulePlugin } from '../../../src/ea/plugins/FnModulePlugin.js';
import { closeFnModule, openFnModuleComm } from '../../../src/ea/store/fnModuleComm/fnModuleComm.action.js';
import { fnModuleCommReducer } from '../../../src/ea/store/fnModuleComm/fnModuleComm.reducer.js';
import { ADD_FEATURE, ADD_LAYER, CLEAR_LAYERS, geofeatureReducer, REMOVE_FEATURE } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { activateMapClick, deactivateMapClick } from '../../../src/ea/store/mapclick/mapclick.action.js';
import { mapclickReducer, MAPCLICK_ACTIVATE, MAPCLICK_DEACTIVATE } from '../../../src/ea/store/mapclick/mapclick.reducer';
import { $injector } from '../../../src/injection/index.js';
import { setClick } from '../../../src/store/pointer/pointer.action.js';
import { pointerReducer } from '../../../src/store/pointer/pointer.reducer';
import { TestUtils } from '../../test-utils.js';


describe('FnModulePlugin', () => {
	const windowMock = {
		messages: [],
		listenerFunction: null,

		postMessage(msg, domain) {
			this.messages.push({ msg, domain });
		},

		addEventListener(name, listener) {
			this.listenerFunction = listener;
		}
	};

	const storeActions = [];

	const environmentServiceMock = {
		getWindow() {
			return windowMock;
		}
	};

	const coordinateServiceMock = {
		stringify: {},
		toLonLat: (coords) => coords
	};

	const setup = (state) => {
		windowMock.messages = [];

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			fnModuleComm: fnModuleCommReducer,
			geofeature: geofeatureReducer,
			mapclick: mapclickReducer,
			pointer: pointerReducer
		});

		$injector.registerSingleton(
			'EnvironmentService', environmentServiceMock
		);

		$injector.registerSingleton(
			'CoordinateService', coordinateServiceMock
		);



		return store;
	};


	it('sends open/close messages on state change', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };
		openFnModuleComm(module, domain);
		closeFnModule();

		expect(windowMock.messages).toHaveSize(2);
		expect(windowMock.messages[0]).toEqual(
			{
				msg: {
					code: 'open',
					module: module
				},
				domain: domain
			});
		expect(windowMock.messages[1]).toEqual(
			{
				msg: {
					code: 'close',
					module: module
				},
				domain: domain
			});
	});

	describe('when communication is open,', () => {
		const module = 'test_modul';
		const domain = 'http://domain.com/eab-module';

		const setupOpen = async () => {
			const store = setup();

			const instanceUnderTest = new FnModulePlugin();
			await instanceUnderTest.register(store);

			window.ea_moduleWindow = { test_modul: windowMock };
			openFnModuleComm(module, domain);
			windowMock.messages = [];
			storeActions.length = 0;

			return store;
		};

		it('adds a geofeature layer on message \'addlayer\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'addlayer',
					module: domain,
					message: { layerId: 42 }
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(ADD_LAYER);
			expect(lastAction.payload).toEqual(42);

		});

		it('clears geofeature layers on message \'clearLayer\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clearLayer',
					module: domain,
					message: null
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(CLEAR_LAYERS);
		});

		it('adds geofeature on message \'addfeature\'', async () => {
			await setupOpen();
			const geojson = {
				type: 'i identify as a geojson'
			};

			windowMock.listenerFunction({
				data: {
					code: 'addfeature',
					module: domain,
					message: {
						layerId: 42,
						geojson: { features: [geojson] }
					}
				},
				event: { origin: module }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(ADD_FEATURE);
			expect(lastAction.payload).toEqual({ layerId: 42, features: [geojson] });
		});

		it('removes geofeature on message \'removefeature\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'removefeature',
					module: domain,
					message: {
						layerId: 42,
						id: 24 }
				},
				event: { origin: module }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(REMOVE_FEATURE);
			expect(lastAction.payload).toEqual({ layerId: 42, ids: [24] });
		});

		it('adds mapclick on message \'activate_mapclick\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'activate_mapclick',
					module: domain,
					message: 42
				},
				event: { origin: module }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(MAPCLICK_ACTIVATE);
			expect(lastAction.payload).toEqual(42);
		});

		it('removes mapclick on message \'cancel_mapclick\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'cancel_mapclick',
					module: domain,
					message: null
				},
				event: { origin: module }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(MAPCLICK_DEACTIVATE);
		});

		it('clears geofeatures on message \'clearmap\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clearmap',
					module: domain,
					message: null
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(CLEAR_LAYERS);
		});

		it('sends a \'mapclick\' message on \'pointer.click\' event when \'mapclick.active\' is true', async () => {
			await setupOpen();

			activateMapClick();
			setClick({ coordinate: [42.0, 24.0], screenCoordinate: [1, 2] });

			expect(windowMock.messages).toHaveSize(1);
			expect(windowMock.messages[0].msg).toEqual(
				{
					code: 'mapclick',
					module: module,
					id: undefined,
					coord: '42,24'
				});

			windowMock.messages = [];
			deactivateMapClick();
			setClick({ coordinate: [42.0, 24.0], screenCoordinate: [1, 2] });

			expect(windowMock.messages).toHaveSize(0);
		});

	});

});
