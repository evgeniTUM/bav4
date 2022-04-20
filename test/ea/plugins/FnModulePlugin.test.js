import { FnModulePlugin } from '../../../src/ea/plugins/FnModulePlugin.js';
import { closeFnModules, openFnModuleComm } from '../../../src/ea/store/fnModuleComm/fnModuleComm.action.js';
import { fnModuleCommReducer } from '../../../src/ea/store/fnModuleComm/fnModuleComm.reducer.js';
import { CLEAR_FEATURES, FEATURE_ADD, geofeatureReducer } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { mapclickReducer } from '../../../src/ea/store/mapclick/mapclick.reducer';
import { $injector } from '../../../src/injection/index.js';
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
		stringify() { },
		toLonLat() { }
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


	it('send open/close messages on state change', async () => {
		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		const expectedSite = 'http://test-site';
		const expectedDomain = 'dom1';

		openFnModuleComm(expectedSite, expectedDomain, windowMock);
		closeFnModules();

		expect(windowMock.messages).toHaveSize(2);
		expect(windowMock.messages[0]).toEqual(
			{ msg: { 'code': 'open', 'module': expectedSite }, domain: expectedDomain }
		);
		expect(windowMock.messages[1]).toEqual(
			{ msg: { 'code': 'close', 'module': expectedSite }, domain: expectedDomain }
		);
	});

	describe('when communication is open', () => {
		const site = 'http://test-site';
		const domain = 'dom1';

		const setupOpen = async () => {
			const store = setup();

			const instanceUnderTest = new FnModulePlugin();
			await instanceUnderTest.register(store);

			openFnModuleComm(site, domain, windowMock);
			windowMock.messages = [];
			storeActions.length = 0;

			return store;
		};

		it('clears geofeature layers on message \'clearLayer\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clearLayer',
					module: domain,
					message: 'test'
				},
				event: { origin: site }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(CLEAR_FEATURES);
		});

		it('adds geofeature on message \'addfeature\'', async () => {
			await setupOpen();
			const geojson = { type: 'i identify as a geojson' };

			windowMock.listenerFunction({
				data: {
					code: 'addfeature',
					module: domain,
					message: {
						geojson: geojson
					}
				},
				event: { origin: site }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(FEATURE_ADD);
			expect(lastAction.payload[0].data).toEqual(geojson);
		});


		it('clears geofeatures on message \'clearmap\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clearmap',
					module: domain,
					message: null
				},
				event: { origin: site }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(CLEAR_FEATURES);
		});

	});

});
