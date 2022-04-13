import { FnModulePlugin } from '../../../src/ea/plugins/FnModulePlugin.js';
import { closeFnModules, openFnModuleComm } from '../../../src/ea/store/fnModuleComm/fnModuleComm.action.js';
import { fnModuleCommReducer } from '../../../src/ea/store/fnModuleComm/fnModuleComm.reducer.js';
import { FEATURE_ADD, CLEAR_FEATURES, geofeatureReducer, initialState as initialGeoFeatureState } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { TestUtils } from '../../test-utils.js';
import { mapclickReducer, initialState as initialMapclickState } from '../../../src/ea/store/mapclick/mapclick.reducer';
import { pointerReducer, initialState as initialPointerState } from '../../../src/store/pointer/pointer.reducer';


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

	const storeMockHelper = {
		actions: [],

		createGeofeatureReducer() {
			return (state = initialGeoFeatureState, action) => {
				this.actions.push(action);
				return geofeatureReducer(state, action);
			}
		},
		createMapClickReducer() {
			return (state = initialMapclickState, action) => {
				this.actions.push(action);
				return mapclickReducer(state, action);
			}
		},
		createPointerReducer() {
			return (state = initialPointerState, action) => {
				this.actions.push(action);
				return pointerReducer(state, action);
			}
		}

	}

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
			fnModuleComm: fnModuleCommReducer,
			geofeature: storeMockHelper.createGeofeatureReducer(),
			mapclick: storeMockHelper.createMapClickReducer(),
			pointer: storeMockHelper.createPointerReducer()
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

		const expectedSite = "http://test-site";
		const expectedDomain = 'dom1';

		openFnModuleComm(expectedSite, expectedDomain, windowMock);
		closeFnModules();

		expect(windowMock.messages).toHaveSize(2);
		expect(windowMock.messages[0]).toEqual(
			{ msg: { "code": "open", "module": expectedSite }, domain: expectedDomain }
		);
		expect(windowMock.messages[1]).toEqual(
			{ msg: { "code": "close", "module": expectedSite }, domain: expectedDomain }
		);
	});

	describe('when communication is open', () => {
		const site = "http://test-site";
		const domain = 'dom1';

		const setupOpen = async (state) => {
			const store = setup();

			const instanceUnderTest = new FnModulePlugin();
			await instanceUnderTest.register(store);

			openFnModuleComm(site, domain, windowMock);
			windowMock.messages = [];
			storeMockHelper.actions = [];

			return store;
		}

		it('clears geofeature layers on message \'clearLayer\'', async () => {
			const store = await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clearLayer',
					module: domain,
					message: 'test' 
				},
				event: { origin: site },

			});

			const lastAction = storeMockHelper.actions.pop();
			expect(lastAction.type).toEqual(CLEAR_FEATURES);
		});

		it('adds geofeature on message \'addfeature\'', async () => {
			const store = await setupOpen();
			const geojson = { type: 'i identify as a geojson' };

			windowMock.listenerFunction({
				data: {
					code: 'addfeature',
					module: domain,
					message: {
						geojson: geojson
					}
				},
				event: { origin: site },

			});

			const lastAction = storeMockHelper.actions.pop();
			expect(lastAction.type).toEqual(FEATURE_ADD);
			expect(lastAction.payload[0].data).toEqual(geojson);
		});

	});

});
