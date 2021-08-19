import { $injector } from '../../../../../../../src/injection';
import { TestUtils } from '../../../../../../test-utils.js';
import { DRAW_LAYER_ID } from '../../../../../../../src/modules/map/store/DrawPlugin';
import { drawReducer } from '../../../../../../../src/modules/map/store/draw.reducer';
import { layersReducer } from '../../../../../../../src/store/layers/layers.reducer';
import { OverlayService } from '../../../../../../../src/modules/map/components/olMap/services/OverlayService';
import { Style } from 'ol/style';
import { DrawSnapType, DrawStateType, OlDrawHandler } from '../../../../../../../src/modules/map/components/olMap/handler/draw/OlDrawHandler';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { OSM, TileDebug } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { DragPan, Modify, Select, Snap } from 'ol/interaction';
import { finish, reset, remove, setType } from '../../../../../../../src/modules/map/store/draw.action';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { ModifyEvent } from 'ol/interaction/Modify';
import { LineString, Point } from 'ol/geom';
import { Collection, Feature, MapBrowserEvent } from 'ol';
import { DrawEvent } from 'ol/interaction/Draw';




describe('OlDrawHandler', () => {
	class MockClass {
		constructor() {
			this.get = 'I\'m a StyleService.';
		}

		addStyle() { }

		updateStyle() { }

		removeStyle() { }

		getStyleFunction() {
			const styleFunction = () => {
				const styles = [
					new Style()
				];

				return styles;
			};

			return styleFunction;
		}

	}


	const geoResourceServiceMock = {
		addOrReplace() { },
		// eslint-disable-next-line no-unused-vars
		byId() {
			return null;
		}
	};

	const fileStorageServiceMock = {
		async save() {
			return { fileId: 'saveFooBarBazId' };
		},
		isFileId(id) {
			return id.startsWith('f_');
		},
		isAdminId(id) {
			return id.startsWith('a_');
		}

	};
	const environmentServiceMock = { isTouch: () => false };
	const initialState = {
		active: false,
		mode: null,
		type: null,
		reset: null,
		fileSaveResult: { adminId: 'init', fileId: 'init' }
	};

	const setup = (state = initialState) => {
		const drawState = {
			draw: state,
			layers: {
				active: [],
				background: 'null'
			}
		};
		const store = TestUtils.setupStoreAndDi(drawState, { draw: drawReducer, layers: layersReducer });
		$injector.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('MapService', { getSrid: () => 3857, getDefaultGeodeticSrid: () => 25832 })
			.registerSingleton('EnvironmentService', environmentServiceMock)
			.registerSingleton('GeoResourceService', geoResourceServiceMock)
			.registerSingleton('FileStorageService', fileStorageServiceMock)
			.registerSingleton('UnitsService', {
				// eslint-disable-next-line no-unused-vars
				formatDistance: (distance, decimals) => {
					return distance + ' m';
				},
				// eslint-disable-next-line no-unused-vars
				formatArea: (area, decimals) => {
					return area + ' m²';
				}
			})
			.register('OverlayService', OverlayService)
			.register('StyleService', MockClass);
		return store;
	};

	const simulateDrawEvent = (type, draw, feature) => {
		const eventType = type;
		const drawEvent = new DrawEvent(eventType, feature);

		draw.dispatchEvent(drawEvent);
	};

	it('has two methods', () => {
		setup();
		const handler = new OlDrawHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(DRAW_LAYER_ID);
	});

	describe('when activated over olMap', () => {
		const container = document.createElement('div');
		const initialCenter = fromLonLat([11.57245, 48.14021]);

		const setupMap = () => {
			return new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})],
				target: container,
				view: new View({
					center: initialCenter,
					zoom: 1
				})
			});

		};

		it('creates a layer to draw', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const layer = classUnderTest.activate(map);

			expect(layer).toBeTruthy();
		});

		describe('uses Interactions', () => {
			it('adds Interactions', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();

				classUnderTest.activate(map);

				// adds Interaction for select, modify,snap, dragPan
				expect(map.addInteraction).toHaveBeenCalledTimes(4);
			});

			it('removes Interaction', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const layerStub = {};
				map.removeInteraction = jasmine.createSpy();
				classUnderTest.activate(map);
				classUnderTest.deactivate(map, layerStub);

				// removes Interaction for select, modify, snap, dragPan
				expect(map.removeInteraction).toHaveBeenCalledTimes(4);
			});

			it('removes Interaction, draw inclusive', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const layerStub = {};
				map.removeInteraction = jasmine.createSpy();
				classUnderTest.activate(map);
				setType('Line');
				classUnderTest.deactivate(map, layerStub);

				// removes Interaction for select, draw,modify, snap, dragPan
				expect(map.removeInteraction).toHaveBeenCalledTimes(5);
			});

			it('adds a select interaction', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();

				classUnderTest.activate(map);

				expect(classUnderTest._select).toBeInstanceOf(Select);
				expect(map.addInteraction).toHaveBeenCalledWith(classUnderTest._select);
			});

			it('adds a modify interaction', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();

				classUnderTest.activate(map);

				expect(classUnderTest._modify).toBeInstanceOf(Modify);
				expect(map.addInteraction).toHaveBeenCalledWith(classUnderTest._modify);
			});

			it('adds a snap interaction', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();

				classUnderTest.activate(map);

				expect(classUnderTest._snap).toBeInstanceOf(Snap);
				expect(map.addInteraction).toHaveBeenCalledWith(classUnderTest._snap);
			});

			it('adds a dragPan interaction', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();

				classUnderTest.activate(map);

				expect(classUnderTest._dragPan).toBeInstanceOf(DragPan);
				expect(map.addInteraction).toHaveBeenCalledWith(classUnderTest._dragPan);
			});

			it('register observer for type-changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const initSpy = spyOn(classUnderTest, '_init').and.callThrough();

				classUnderTest.activate(map);
				setType('Symbol');

				expect(classUnderTest._draw).toBeTruthy();
				expect(initSpy).toHaveBeenCalledWith('Symbol');
			});

			it('register observer for finish-request', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const finishSpy = spyOn(classUnderTest, '_finish').and.callThrough();

				classUnderTest.activate(map);
				finish();
				expect(finishSpy).toHaveBeenCalled();
			});

			it('register observer for reset-request', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const startNewSpy = spyOn(classUnderTest, '_startNew').and.callThrough();

				classUnderTest.activate(map);
				reset();
				expect(startNewSpy).toHaveBeenCalled();
			});


			it('register observer for remove-request', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const removeSpy = spyOn(classUnderTest, '_remove').and.callThrough();

				classUnderTest.activate(map);
				remove();
				expect(removeSpy).toHaveBeenCalled();
			});

			it('starts with a preselected drawType', () => {
				const state = { ...initialState, type: 'Symbol' };
				setup(state);
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const initSpy = spyOn(classUnderTest, '_init').and.callThrough();

				classUnderTest.activate(map);

				expect(initSpy).toHaveBeenCalled();
				expect(classUnderTest._draw).toBeTruthy();
			});

			it('starts without a preselected drawType, caused by unknown type', () => {
				const state = { ...initialState, type: 'somethingWrong' };
				setup(state);
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const initSpy = spyOn(classUnderTest, '_init');

				classUnderTest.activate(map);

				expect(initSpy).toHaveBeenCalledWith('somethingWrong');
				expect(classUnderTest._draw).toBeNull();
			});

			it('starts without a preselected drawType', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const initSpy = spyOn(classUnderTest, '_init');

				classUnderTest.activate(map);

				expect(initSpy).not.toHaveBeenCalled();
				expect(classUnderTest._draw).toBeNull();
			});

			it('aborts drawing after reset-request', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const startNewSpy = spyOn(classUnderTest, '_startNew').and.callThrough();

				classUnderTest.activate(map);

				setType('Line');
				const draw = classUnderTest._draw;
				const abortSpy = spyOn(draw, 'abortDrawing').and.callThrough();
				expect(classUnderTest._draw.getActive()).toBeTrue();

				reset();
				expect(startNewSpy).toHaveBeenCalled();
				expect(abortSpy).toHaveBeenCalled();
			});


			it('aborts current drawing after type-change', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const initSpy = spyOn(classUnderTest, '_init').and.callThrough();

				classUnderTest.activate(map);
				setType('Symbol');
				const abortSpy = spyOn(classUnderTest._draw, 'abortDrawing').and.callThrough();
				expect(classUnderTest._draw.getActive()).toBeTrue();
				setType('Line');
				expect(initSpy).toHaveBeenCalledTimes(2);
				expect(abortSpy).toHaveBeenCalled();
			});


			it('aborts current drawing with additional warning after errornous type-change', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const initSpy = spyOn(classUnderTest, '_init').and.callThrough();
				const warnSpy = spyOn(console, 'warn');

				classUnderTest.activate(map);
				setType('Symbol');
				const draw = classUnderTest._draw;
				const abortSpy = spyOn(draw, 'abortDrawing').and.callThrough();
				setType('SomethingWrong');
				expect(initSpy).toHaveBeenCalled();
				expect(abortSpy).toHaveBeenCalled();
				expect(warnSpy).toHaveBeenCalled();
			});


			it('finishs drawing after finish-request', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const startNewSpy = spyOn(classUnderTest, '_finish').and.callThrough();
				const geometry = new LineString([[0, 0], [1, 0]]);
				const feature = new Feature({ geometry: geometry });

				classUnderTest.activate(map);

				setType('Line');
				const draw = classUnderTest._draw;
				const finishSpy = spyOn(draw, 'finishDrawing').and.callThrough();

				simulateDrawEvent('drawstart', draw, feature);
				finish();

				expect(startNewSpy).toHaveBeenCalled();
				expect(finishSpy).toHaveBeenCalled();
			});

			it('switches to modify after finish-request on not-present sketch', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const startNewSpy = spyOn(classUnderTest, '_finish').and.callThrough();

				classUnderTest.activate(map);

				setType('Line');
				expect(classUnderTest._draw.getActive()).toBeTrue();

				finish();

				expect(startNewSpy).toHaveBeenCalled();
				expect(classUnderTest._modify.getActive()).toBeTrue();
				expect(classUnderTest._draw).toBeNull();
			});
		});

	});

	describe('when draw a line', () => {
		const initialCenter = fromLonLat([42, 42]);
		let target;
		const setupMap = (zoom = 10) => {
			target = document.createElement('div');
			return new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})],
				target: target,
				view: new View({
					center: initialCenter,
					zoom: zoom
				})
			});

		};

		it('feature gets valid id after start drawing', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new LineString([[0, 0], [1, 0]]);
			const feature = new Feature({ geometry: geometry });

			classUnderTest.activate(map);
			setType('Line');

			simulateDrawEvent('drawstart', classUnderTest._draw, feature);

			const id = feature.getId();

			expect(id).toBeTruthy();
			expect(id).toMatch(/draw_Line_[0-9]{13}/g);
		});

		it('switches to modify after drawend', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new LineString([[0, 0], [1, 0]]);
			const feature = new Feature({ geometry: geometry });

			classUnderTest.activate(map);
			setType('Line');
			expect(classUnderTest._modify.getActive()).toBeFalse();
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			simulateDrawEvent('drawend', classUnderTest._draw, feature);

			expect(classUnderTest._modify.getActive()).toBeTrue();
		});


	});

	const createSnappingFeatureMock = (coordinate, feature) => {
		return {
			get: () => [feature],
			getGeometry: () => new Point(coordinate)
		};
	};

	describe('when pointer move', () => {
		let target;
		const setupMap = () => {
			target = document.createElement('div');
			target.style.height = '100px';
			target.style.width = '100px';
			const map = new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})],
				target: target,
				view: new View({
					center: [42, 42],
					zoom: 1
				})
			});

			map.renderSync();
			return map;

		};

		const simulateMapMouseEvent = (map, type, x, y, dragging) => {
			const eventType = type;

			const event = new Event(eventType);
			//event.target = map.getViewport().firstChild;
			event.clientX = x;
			event.clientY = y;
			event.pageX = x;
			event.pageY = y;
			event.shiftKey = false;
			event.preventDefault = function () { };


			const mapEvent = new MapBrowserEvent(eventType, map, event);
			mapEvent.coordinate = [x, y];
			mapEvent.dragging = dragging ? dragging : false;
			map.dispatchEvent(mapEvent);
		};

		it('change measureState, when sketch is changing', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const drawStateSpy = jasmine.createSpy();
			classUnderTest.activate(map);
			classUnderTest._onDrawStateChanged(drawStateSpy);

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: null, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });

			setType('Symbol');
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 15, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: DrawStateType.ACTIVE, snap: null, coordinate: [15, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
			classUnderTest._activeSketch = new Feature({ geometry: new Point([1, 0]) });
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 20, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: DrawStateType.DRAW, snap: null, coordinate: [20, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
		});

		it('adds/removes style for grabbing while modifying', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const mapContainer = map.getTarget();

			classUnderTest.activate(map);
			classUnderTest._modify.setActive(true);

			classUnderTest._modify.dispatchEvent(new ModifyEvent('modifystart', null, new Event(MapBrowserEventType.SINGLECLICK)));
			expect(mapContainer.classList.contains('grabbing')).toBeFalse();
			classUnderTest._modify.dispatchEvent(new ModifyEvent('modifystart', null, new Event(MapBrowserEventType.POINTERDOWN)));
			expect(mapContainer.classList.contains('grabbing')).toBeTrue();
			classUnderTest._modify.dispatchEvent(new ModifyEvent('modifyend', null, new Event(MapBrowserEventType.POINTERDOWN)));
			expect(mapContainer.classList.contains('grabbing')).toBeTrue();
			classUnderTest._modify.dispatchEvent(new ModifyEvent('modifyend', null, new Event(MapBrowserEventType.POINTERUP)));
			expect(mapContainer.classList.contains('grabbing')).toBeFalse();
		});

		describe('when switching to modify', () => {
			const geometry = new LineString([[0, 0], [100, 0]]);
			const feature = new Feature({ geometry: geometry });

			it('pointer is not snapped on sketch', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();

				map.forEachFeatureAtPixel = jasmine.createSpy().and.callThrough();
				const drawStateSpy = jasmine.createSpy();

				classUnderTest.activate(map);
				classUnderTest._onDrawStateChanged(drawStateSpy);
				classUnderTest._select.getFeatures().push(feature);
				classUnderTest._modify.setActive(true);

				simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);

				expect(map.forEachFeatureAtPixel).toHaveBeenCalledWith([10, 0], jasmine.any(Function), jasmine.any(Object));
				expect(drawStateSpy).toHaveBeenCalledWith({ type: DrawStateType.MODIFY, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
			});

			it('pointer is snapped to sketch boundary', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();

				const drawStateSpy = jasmine.createSpy();
				const snappingFeatureMock = createSnappingFeatureMock([50, 0], feature);
				map.forEachFeatureAtPixel = jasmine.createSpy().and.callFake((pixel, callback) => {
					callback(snappingFeatureMock, undefined);
				});


				classUnderTest.activate(map);
				classUnderTest._onDrawStateChanged(drawStateSpy);
				classUnderTest._select.getFeatures().push(feature);
				classUnderTest._modify.setActive(true);
				simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 50, 0);

				expect(map.forEachFeatureAtPixel).toHaveBeenCalledWith([50, 0], jasmine.any(Function), jasmine.any(Object));
				expect(drawStateSpy).toHaveBeenCalledWith({ type: DrawStateType.MODIFY, snap: DrawSnapType.EGDE, coordinate: [50, 0], pointCount: jasmine.anything(), dragging: jasmine.any(Boolean) });
			});

			it('pointer is snapped to sketch vertex', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const drawStateSpy = jasmine.createSpy();

				const snappingFeatureMock = createSnappingFeatureMock([0, 0], feature);
				map.forEachFeatureAtPixel = jasmine.createSpy().and.callFake((pixel, callback) => {
					callback(snappingFeatureMock, undefined);
				});

				classUnderTest.activate(map);
				classUnderTest._onDrawStateChanged(drawStateSpy);
				classUnderTest._select.getFeatures().push(feature);
				classUnderTest._modify.setActive(true);
				simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 0, 0);

				expect(map.forEachFeatureAtPixel).toHaveBeenCalledWith([0, 0], jasmine.any(Function), jasmine.any(Object));
				expect(drawStateSpy).toHaveBeenCalledWith({ type: DrawStateType.MODIFY, snap: DrawSnapType.VERTEX, coordinate: [0, 0], pointCount: jasmine.anything(), dragging: jasmine.any(Boolean) });
			});

			it('adds/removes style for grabbing while modifying', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const mapContainer = map.getTarget();

				classUnderTest.activate(map);
				classUnderTest._modify.setActive(true);
				classUnderTest._modify.dispatchEvent(new ModifyEvent('modifystart', null, new Event(MapBrowserEventType.POINTERDOWN)));


				expect(mapContainer.classList.contains('grabbing')).toBeTrue();
				classUnderTest._modify.dispatchEvent(new ModifyEvent('modifyend', null, new Event(MapBrowserEventType.POINTERUP)));
				expect(mapContainer.classList.contains('grabbing')).toBeFalse();
			});
		});


	});

	describe('when pointer click', () => {
		let target;
		const setupMap = () => {
			target = document.createElement('div');
			target.style.height = '100px';
			target.style.width = '100px';
			const map = new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})],
				target: target,
				view: new View({
					center: [0, 0],
					zoom: 1
				})
			});

			map.renderSync();
			return map;

		};

		const simulateMapMouseEvent = (map, type, x, y, dragging) => {
			const eventType = type;

			const event = new Event(eventType);
			//event.target = map.getViewport().firstChild;
			event.clientX = x;
			event.clientY = y;
			event.pageX = x;
			event.pageY = y;
			event.shiftKey = false;
			event.preventDefault = function () { };


			const mapEvent = new MapBrowserEvent(eventType, map, event);
			mapEvent.coordinate = [x, y];
			mapEvent.dragging = dragging ? dragging : false;
			map.dispatchEvent(mapEvent);
		};


		it('deselect feature, if clickposition is disjoint to selected feature', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();

			classUnderTest.activate(map);
			setType('Symbol');

			const geometry = new Point([550, 550]);
			const feature = new Feature({ geometry: geometry });
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			feature.getGeometry().dispatchEvent('change');
			simulateDrawEvent('drawend', classUnderTest._draw, feature);
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 550, 550);
			expect(classUnderTest._select).toBeDefined();
			expect(classUnderTest._select.getFeatures().getLength()).toBe(1);

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 600, 0);
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 600, 0);
			expect(classUnderTest._select.getFeatures().getLength()).toBe(0);
		});


		it('select feature, if clickposition is in anyinteract to selected feature', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();

			classUnderTest.activate(map);
			setType('Symbol');
			const geometry = new Point([550, 550]);
			const feature = new Feature({ geometry: geometry });


			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			feature.getGeometry().dispatchEvent('change');
			simulateDrawEvent('drawend', classUnderTest._draw, feature);
			expect(classUnderTest._select).toBeDefined();


			// force deselect
			classUnderTest._select.getFeatures().clear();
			expect(classUnderTest._select.getFeatures().getLength()).toBe(0);

			map.forEachFeatureAtPixel = jasmine.createSpy().and.callFake((pixel, callback) => {
				callback(feature, classUnderTest._vectorLayer);
			});

			// re-select
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 500, 0);
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 250, 250);
			expect(classUnderTest._select.getFeatures().getLength()).toBe(1);
		});

	});

	describe('when using EnvironmentService for snapTolerance', () => {

		it('isTouch() resolves in higher snapTolerance', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const environmentSpy = spyOn(environmentServiceMock, 'isTouch').and.returnValue(true);

			expect(classUnderTest._getSnapTolerancePerDevice()).toBe(12);
			expect(environmentSpy).toHaveBeenCalled();
		});

		it('isTouch() resolves in lower snapTolerance', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const environmentSpy = spyOn(environmentServiceMock, 'isTouch').and.returnValue(false);

			expect(classUnderTest._getSnapTolerancePerDevice()).toBe(4);
			expect(environmentSpy).toHaveBeenCalled();
		});

	});

	describe('when using util _isInCollection', () => {

		it('finds a item', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const item = { id: 'foo' };
			const items = [item, { id: 'bar' }, { id: 'baz' }];
			const collection = new Collection(items);

			expect(classUnderTest._isInCollection(item, collection)).toBeTrue();
		});

		it('finds NOT a item', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const item = { id: '42' };
			const items = [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }];
			const collection = new Collection(items);

			expect(classUnderTest._isInCollection(item, collection)).toBeFalse();
		});


		it('finds NOT a item in empty collection', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const item = { id: '42' };
			const items = [];
			const collection = new Collection(items);

			expect(classUnderTest._isInCollection(item, collection)).toBeFalse();
		});

	});

});



