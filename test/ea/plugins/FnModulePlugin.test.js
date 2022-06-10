import { FnModulePlugin } from '../../../src/ea/plugins/FnModulePlugin.js';
import { closeFnModule, openFnModuleComm } from '../../../src/ea/store/fnModuleComm/fnModuleComm.action.js';
import { fnModuleCommReducer } from '../../../src/ea/store/fnModuleComm/fnModuleComm.reducer.js';
import { ADD_FEATURE, ADD_LAYER, CLEAR_LAYER, CLEAR_MAP, geofeatureReducer, REMOVE_FEATURE } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { activateMapClick, requestMapClick } from '../../../src/ea/store/mapclick/mapclick.action.js';
import { mapclickReducer, MAPCLICK_ACTIVATE, MAPCLICK_DEACTIVATE } from '../../../src/ea/store/mapclick/mapclick.reducer';
import { ACTIVATE_GEORESOURCE, DEACTIVATE_ALL_GEORESOURCES } from '../../../src/ea/store/module/module.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { CLICK_CHANGED, pointerReducer } from '../../../src/store/pointer/pointer.reducer';
import { FIT_REQUESTED, ZOOM_CENTER_CHANGED } from '../../../src/store/position/position.reducer.js';
import { TestUtils } from '../../test-utils.js';

const GEOJSON_SAMPLE_DATA = {
	features: [
		{
			geometry: {
				crs: {
					type: 'name',
					properties: { name: 'EPSG:4326' }
				},
				coordinates: [42.0, 24.0],
				type: 'Point'
			},
			id: '1876369769',
			type: 'Feature'
		}
	]
};

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

	const mapServiceMock = {
		getMaxZoomLevel: () => 20,
		getMinZoomLevel: () => 1,
		getSrid: () => 4326
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

		$injector
			.registerSingleton('EnvironmentService', environmentServiceMock)
			.registerSingleton('CoordinateService', coordinateServiceMock)
			.registerSingleton('MapService', mapServiceMock);



		return store;
	};

	beforeEach(async () => {
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});


	it('sends open messages when opening module', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };

		openFnModuleComm(module, domain);

		const lastMessage = windowMock.messages.pop();
		expect(lastMessage).toEqual(
			{
				msg: {
					code: 'open',
					module: module
				},
				domain: domain
			});
	});

	it('sends close messages when closing module', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };
		openFnModuleComm(module, domain);

		closeFnModule();

		const lastMessage = windowMock.messages.pop();
		expect(lastMessage).toEqual(
			{
				msg: {
					code: 'close',
					module: module
				},
				domain: domain
			});
	});


	it('clears map when closing module', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };
		openFnModuleComm(module, domain);

		closeFnModule();

		expect(storeActions.filter(a => a.type === CLEAR_MAP).length).toBeGreaterThan(0);
	});

	it('clears active georesources when closing module', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };
		openFnModuleComm(module, domain);

		closeFnModule();

		expect(storeActions.filter(a => a.type === DEACTIVATE_ALL_GEORESOURCES).length).toBeGreaterThan(0);
	});

	it('resets featureInfo state when closing module', async () => {
		const module = 'dom1';
		const domain = 'http://test-site';

		const store = setup();

		const instanceUnderTest = new FnModulePlugin();
		await instanceUnderTest.register(store);

		window.ea_moduleWindow = { dom1: windowMock };
		openFnModuleComm(module, domain);

		closeFnModule();

		expect(storeActions.filter(a => a.type === DEACTIVATE_ALL_GEORESOURCES).length).toBeGreaterThan(0);
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

		it('adds non-draggable layer on message \'addlayer\'', async () => {
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
			expect(lastAction.payload).toEqual({ id: 42, draggable: false });

		});

		it('adds draggable layer on message \'addlayer\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'addlayer',
					module: domain,
					message: { layerId: 42, draggable: true }
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(ADD_LAYER);
			expect(lastAction.payload).toEqual({ id: 42, draggable: true });

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
						geojson: { features: [geojson] },
						style: { template: 'geolocation' },
						expandTo: true
					}
				},
				event: { origin: module }

			});

			jasmine.clock().tick(150);

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(ADD_FEATURE);
			expect(lastAction.payload).toEqual({
				layerId: 42,
				features: [{ ...geojson, style: { template: 'geolocation' }, expandTo: true }]
			});
		});

		it('buffers new geofeatures for 100ms', async () => {
			await setupOpen();
			const geojson = {
				type: 'i identify as a geojson'
			};

			const msg = {
				data: {
					code: 'addfeature',
					module: domain,
					message: {
						layerId: 42,
						geojson: { features: [geojson] },
						style: { template: 'geolocation' },
						expandTo: true
					}
				},
				event: { origin: module }
			};

			Array.from({ length: 500 }).forEach(() => windowMock.listenerFunction(msg));

			jasmine.clock().tick(110);

			const actions = storeActions.filter(a => a.type === ADD_FEATURE);
			expect(actions.length).toEqual(1);
		});

		it('removes geofeature on message \'removefeature\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'removefeature',
					module: domain,
					message: {
						layerId: 42,
						id: 24
					}
				},
				event: { origin: module }

			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(REMOVE_FEATURE);
			expect(lastAction.payload).toEqual({ layerId: 42, ids: [24] });
		});

		it('activates mapclicks on message \'activate_mapclick\'', async () => {
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

		it('deactivates mapclicks on message \'cancel_mapclick\'', async () => {
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
					message: 42
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(CLEAR_LAYER);
			expect(lastAction.payload).toEqual('42');
		});

		it('sends a \'mapclick\' message on \'mapclick.coordinate\' event', async () => {
			await setupOpen();

			activateMapClick();
			requestMapClick([42.0, 24.0]);

			expect(windowMock.messages).toHaveSize(1);
			expect(windowMock.messages[0].msg).toEqual(
				{
					code: 'mapclick',
					module: module,
					id: undefined,
					coord: '42,24'
				});
		});

		it('activates a georesource on message \'activateGeoResource\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'activateGeoResource',
					module: domain,
					message: '42'
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(ACTIVATE_GEORESOURCE);
			expect(lastAction.payload).toEqual('42');
		});

		it('deactivates all georesources on message \'deactivateGeoResource\'', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'deactivateGeoResource',
					module: domain,
					message: null
				},
				event: { origin: module }
			});

			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(DEACTIVATE_ALL_GEORESOURCES);
		});

		it('zooms and centers map on \'zoomAndCenter\' message', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'zoomAndCenter',
					module: domain,
					message: {
						geojson: GEOJSON_SAMPLE_DATA,
						zoom: 11
					}
				},
				event: { origin: module }
			});

			const action = storeActions.find(a => a.type === ZOOM_CENTER_CHANGED);
			expect(action).toBeDefined();
			expect(action.payload).toEqual({ zoom: 11, center: [42.0, 24.0] });
		});

		it('fits the map on \'zoom2Extent\' message with 20% scale', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'zoom2Extent',
					module: domain,
					message: {
						geojson: {
							features: [
								{
									geometry: {
										crs: {
											type: 'name',
											properties: { name: 'EPSG:4326' }
										},
										coordinates: [[[2.5, 2.5], [2.5, 2.5], [3, 3], [4, 4], [5, 5]]],
										type: 'Polygon'
									},
									id: '530497279',
									type: 'Feature'
								}
							],
							type: 'FeatureCollection'
						}
					}
				},
				event: { origin: module }
			});

			const action = storeActions.find(a => a.type === FIT_REQUESTED);
			expect(action).toBeDefined();
			expect(action.payload._payload).toEqual({ extent: [2.25, 2.25, 5.25, 5.25], options: {} });
		});



		it('clicks inside map on \'clickInMap\' message', async () => {
			await setupOpen();

			windowMock.listenerFunction({
				data: {
					code: 'clickInMap',
					module: domain,
					message: {
						geojson: GEOJSON_SAMPLE_DATA
					}
				},
				event: { origin: module }
			});

			const action = storeActions.find(a => a.type === CLICK_CHANGED);
			expect(action).toBeDefined();
			expect(action.payload._payload).toEqual({ coordinate: [42.0, 24.0] });
		});

	});
});
