import { $injector } from '../../../../../../../src/injection';
import { TestUtils } from '../../../../../../test-utils.js';
import { DRAW_LAYER_ID } from '../../../../../../../src/modules/map/store/DrawPlugin';
import { drawReducer } from '../../../../../../../src/modules/map/store/draw.reducer';
import { layersReducer } from '../../../../../../../src/store/layers/layers.reducer';
import { OverlayService } from '../../../../../../../src/modules/map/components/olMap/services/OverlayService';
import { Style } from 'ol/style';
import { OlDrawHandler } from '../../../../../../../src/modules/map/components/olMap/handler/draw/OlDrawHandler';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { OSM, TileDebug } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { DragPan, Modify, Select, Snap } from 'ol/interaction';
import { finish, reset, remove, setType, setStyle } from '../../../../../../../src/modules/map/store/draw.action';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { ModifyEvent } from 'ol/interaction/Modify';
import { LineString, Point, Polygon } from 'ol/geom';
import { Collection, Feature, MapBrowserEvent } from 'ol';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import { InteractionSnapType, InteractionStateType } from '../../../../../../../src/modules/map/components/olMap/olInteractionUtils';
import { VectorGeoResource, VectorSourceType } from '../../../../../../../src/services/domain/geoResources';
import { FileStorageServiceDataTypes } from '../../../../../../../src/services/FileStorageService';




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

	const measurementStorageServiceMock = {
		async store() { },
		isValid() {
			return false;
		},
		isStorageId() {
			return false;
		},
		setStorageId() { },
		getStorageId() {
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
			.registerSingleton('MeasurementStorageService', measurementStorageServiceMock)
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

	const simulateKeyEvent = (keyCode) => {
		const keyEvent = new KeyboardEvent('keyup', { keyCode: keyCode, which: keyCode });

		document.dispatchEvent(keyEvent);
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

		it('creates a layer to draw ONLY once', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const spy = spyOn(classUnderTest, '_createSelect').and.callThrough();
			const map = setupMap();

			const layer = classUnderTest.activate(map);
			classUnderTest.activate(map);

			expect(layer).toBeTruthy();
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('adds a label to the session vectorlayer', () => {
			setup();
			const map = setupMap();
			const classUnderTest = new OlDrawHandler();
			classUnderTest.activate(map);

			expect(classUnderTest._vectorLayer.label).toBe('map_olMap_handler_draw_layer_label');
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
				setType('line');
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
				setType('marker');

				expect(classUnderTest._draw).toBeTruthy();
				expect(initSpy).toHaveBeenCalledWith('marker');
			});

			it('register observer for style-changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				map.addInteraction = jasmine.createSpy();
				const styleSpy = spyOn(classUnderTest, '_updateStyle').and.callThrough();

				classUnderTest.activate(map);
				setStyle(null);

				expect(styleSpy).toHaveBeenCalledTimes(1);
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
				const state = { ...initialState, type: 'marker' };
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

				setType('line');
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
				setType('marker');
				const abortSpy = spyOn(classUnderTest._draw, 'abortDrawing').and.callThrough();
				expect(classUnderTest._draw.getActive()).toBeTrue();
				setType('line');
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
				setType('marker');
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

				setType('line');
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

				setType('line');
				expect(classUnderTest._draw.getActive()).toBeTrue();

				finish();

				expect(startNewSpy).toHaveBeenCalled();
				expect(classUnderTest._modify.getActive()).toBeTrue();
				expect(classUnderTest._draw).toBeNull();
			});

			it('re-inits the drawing with new style, when store changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const style = { symbolSrc: null, color: '#badA55', scale: 0.5 };
				const drawStateFake = {
					type: InteractionStateType.ACTIVE
				};


				classUnderTest.activate(map);
				classUnderTest._drawState = drawStateFake;
				setType('line');

				const initSpy = spyOn(classUnderTest, '_init').and.callThrough();
				setStyle(style);

				expect(initSpy).toHaveBeenCalledWith('line');
				expect(initSpy).toHaveBeenCalledTimes(1);
			});

			it('updates drawing feature with new style, when store changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const style = { symbolSrc: null, color: '#badA55', scale: 0.5 };
				const feature = new Feature({ geometry: new LineString([[0, 0], [1, 1]]) });
				feature.setId('draw_line_1234');
				feature.setStyle([new Style(), new Style()]);
				const drawStateFake = {
					type: InteractionStateType.DRAW
				};
				classUnderTest.activate(map);
				classUnderTest._drawState = drawStateFake;
				classUnderTest._activeSketch = feature;

				setType('line');

				const styleSpy = spyOn(feature, 'setStyle').and.callThrough();
				setStyle(style);

				expect(styleSpy).toHaveBeenCalledTimes(1);
			});

			it('updates not until drawing feature is present, when store changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const style = { symbolSrc: null, color: '#badA55', scale: 0.5 };
				const feature = new Feature({ geometry: new LineString([[0, 0], [1, 1]]) });
				feature.setId('draw_line_1234');
				feature.setStyle([new Style(), new Style()]);
				const drawStateFake = {
					type: InteractionStateType.DRAW
				};
				classUnderTest.activate(map);
				classUnderTest._drawState = drawStateFake;


				setType('line');

				const styleSpy = spyOn(feature, 'setStyle').and.callThrough();
				setStyle(style);

				expect(styleSpy).toHaveBeenCalledTimes(0);
			});

			it('updates selected feature (modify) with new style, when store changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const style = { symbolSrc: null, color: '#badA55', scale: 0.5 };
				const feature = new Feature({ geometry: new Point([0, 0]) });
				feature.setId('draw_Symbol_1234');
				feature.setStyle([new Style(), new Style()]);
				const drawStateFake = {
					type: InteractionStateType.MODIFY
				};
				classUnderTest.activate(map);
				classUnderTest._drawState = drawStateFake;
				spyOn(classUnderTest._select, 'getFeatures').and.callFake(() => new Collection([feature]));
				setType('marker');

				const styleSpy = spyOn(feature, 'setStyle').and.callThrough();
				setStyle(style);

				expect(styleSpy).toHaveBeenCalledTimes(1);
			});

			it('updates NOT selected unstyled feature (modify) with new style, when store changes', () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				const style = { symbolSrc: null, color: '#badA55', scale: 0.5 };
				const feature = new Feature({ geometry: new Point([0, 0]) });
				feature.setId('draw_Symbol_1234');
				feature.setStyle([]);
				const drawStateFake = {
					type: InteractionStateType.MODIFY
				};
				classUnderTest.activate(map);
				classUnderTest._drawState = drawStateFake;
				spyOn(classUnderTest._select, 'getFeatures').and.callFake(() => new Collection([feature]));
				setType('marker');

				const styleSpy = spyOn(feature, 'setStyle').and.callThrough();
				setStyle(style);

				expect(styleSpy).toHaveBeenCalledWith([]);
			});
		});

		it('looks for measurement-layer and adds the feature for update/copy on save', (done) => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const lastData = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"><Placemark id="draw_line_1620710146878"><Style><LineStyle><color>ff0000ff</color><width>3</width></LineStyle><PolyStyle><color>660000ff</color></PolyStyle></Style><ExtendedData><Data name="area"/><Data name="measurement"/><Data name="partitions"/></ExtendedData><Polygon><outerBoundaryIs><LinearRing><coordinates>10.66758401,50.09310529 11.77182103,50.08964948 10.57062661,49.66616988 10.66758401,50.09310529</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></kml>';
			const map = setupMap();
			const vectorGeoResource = new VectorGeoResource('a_lastId', 'foo', VectorSourceType.KML).setSource(lastData, 4326);

			spyOn(map, 'getLayers').and.returnValue({ getArray: () => [{ get: () => 'a_lastId' }] });
			spyOn(measurementStorageServiceMock, 'isStorageId').and.callFake(() => true);
			spyOn(classUnderTest._overlayService, 'add').and.callFake(() => { });

			const geoResourceSpy = spyOn(geoResourceServiceMock, 'byId').and.returnValue(vectorGeoResource);
			const storageSpy = spyOn(classUnderTest._storageHandler, 'setStorageId').and.callFake(() => { });
			classUnderTest.activate(map);
			const addFeatureSpy = spyOn(classUnderTest._vectorLayer.getSource(), 'addFeature');


			setTimeout(() => {
				expect(geoResourceSpy).toHaveBeenCalledWith('a_lastId');
				expect(storageSpy).toHaveBeenCalledWith('a_lastId');
				expect(addFeatureSpy).toHaveBeenCalledTimes(1);
				done();
			});
		});

		it('looks for measurement-layer and gets no georesource', (done) => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();


			spyOn(map, 'getLayers').and.returnValue({ getArray: () => [{ get: () => 'a_lastId' }] });
			spyOn(measurementStorageServiceMock, 'isStorageId').and.callFake(() => true);
			spyOn(classUnderTest._overlayService, 'add').and.callFake(() => { });

			const geoResourceSpy = spyOn(geoResourceServiceMock, 'byId').and.returnValue(null);
			const storageSpy = spyOn(classUnderTest._storageHandler, 'setStorageId').and.callFake(() => { });
			classUnderTest.activate(map);
			const addFeatureSpy = spyOn(classUnderTest._vectorLayer.getSource(), 'addFeature');


			setTimeout(() => {
				expect(geoResourceSpy).toHaveBeenCalledWith('a_lastId');
				expect(storageSpy).not.toHaveBeenCalled();
				expect(addFeatureSpy).not.toHaveBeenCalled();
				done();
			});
		});

		it('looks for temporary measurement-layer and adds the feature to session-layer', (done) => {
			const state = { ...initialState, fileSaveResult: null };
			setup(state);
			const classUnderTest = new OlDrawHandler();
			const lastData = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"><Placemark id="draw_line_1620710146878"><Style><LineStyle><color>ff0000ff</color><width>3</width></LineStyle><PolyStyle><color>660000ff</color></PolyStyle></Style><ExtendedData><Data name="area"/><Data name="measurement"/><Data name="partitions"/></ExtendedData><Polygon><outerBoundaryIs><LinearRing><coordinates>10.66758401,50.09310529 11.77182103,50.08964948 10.57062661,49.66616988 10.66758401,50.09310529</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></kml>';
			const map = setupMap();
			const vectorGeoResource = new VectorGeoResource('temp_draw_id', 'foo', VectorSourceType.KML).setSource(lastData, 4326);

			spyOn(map, 'getLayers').and.returnValue({ getArray: () => [{ get: () => 'temp_draw_id' }] });
			spyOn(classUnderTest._overlayService, 'add').and.callFake(() => { });
			const spy = spyOn(geoResourceServiceMock, 'byId').and.returnValue(vectorGeoResource);

			classUnderTest.activate(map);
			const addFeatureSpy = spyOn(classUnderTest._vectorLayer.getSource(), 'addFeature');

			setTimeout(() => {
				expect(spy).toHaveBeenCalledWith('temp_draw_id');
				expect(addFeatureSpy).toHaveBeenCalledTimes(1);
				done();
			});
		});

		describe('_createDrawByType', () => {
			const defaultStyleOption = { symbolSrc: null, color: '#FFDAFF', scale: 0.5 };
			it('returns a draw-interaction for \'Symbol\'', async () => {

				setup();
				const classUnderTest = new OlDrawHandler();
				const map = setupMap();
				classUnderTest.activate(map);

				expect(classUnderTest._createDrawByType('marker', defaultStyleOption)).toEqual(jasmine.any(Draw));
				expect(classUnderTest._createDrawByType('text', defaultStyleOption)).toEqual(jasmine.any(Draw));
				expect(classUnderTest._createDrawByType('line', defaultStyleOption)).toEqual(jasmine.any(Draw));
				expect(classUnderTest._createDrawByType('polygon', defaultStyleOption)).toEqual(jasmine.any(Draw));

				classUnderTest._vectorLayer = null;
				expect(classUnderTest._createDrawByType('Any', defaultStyleOption)).toBeNull();

			});
		});

		describe('_getStyleFunctionFrom', () => {

			it('returns a styleFunction for a feature with valid featureId', async () => {
				const styleFunctionMock = () => { };
				setup();
				const classUnderTest = new OlDrawHandler();
				const featureMock = { getId: () => 'foo_bar_12345' };
				const typeSpy = spyOn(classUnderTest, '_getStyleFunctionByDrawType').and.callFake(() => styleFunctionMock);


				const styleFunction = classUnderTest._getStyleFunctionFrom(featureMock);

				expect(styleFunction).toBe(styleFunctionMock);
				expect(typeSpy).toHaveBeenCalledWith('bar', jasmine.any(Object));
			});

			it('returns null for a INVALID featureId', async () => {
				setup();
				const classUnderTest = new OlDrawHandler();
				const featureMock = { getId: () => 'foo' };
				const typeSpy = spyOn(classUnderTest, '_getStyleFunctionByDrawType');


				const styleFunction = classUnderTest._getStyleFunctionFrom(featureMock);

				expect(styleFunction).toBeNull();
				expect(typeSpy).not.toHaveBeenCalled();
			});


		});

		describe('_getStyleFunctionByDrawType', () => {
			const defaultStyleOption = { symbolSrc: null, color: '#FFDAFF', scale: 0.5 };
			it('returns a styleFunction', async () => {
				setup();
				const classUnderTest = new OlDrawHandler();

				expect(classUnderTest._getStyleFunctionByDrawType('marker', defaultStyleOption)()).toContain(jasmine.any(Style));
				expect(classUnderTest._getStyleFunctionByDrawType('text', defaultStyleOption)()).toContain(jasmine.any(Style));
				expect(classUnderTest._getStyleFunctionByDrawType('line', defaultStyleOption)()).toContain(jasmine.any(Style));
				expect(classUnderTest._getStyleFunctionByDrawType('polygon', defaultStyleOption)()).toContain(jasmine.any(Style));
				expect(classUnderTest._getStyleFunctionByDrawType('foo', defaultStyleOption)()).toContain(jasmine.any(Style));
			});
		});


	});

	describe('when deactivated over olMap', () => {

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
				target: 'map',
				view: new View({
					center: initialCenter,
					zoom: 1
				})
			});

		};

		const createFeature = () => {
			const feature = new Feature({ geometry: new Polygon([[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]) });
			return feature;
		};

		it('writes features to kml format for persisting purpose', (done) => {
			const state = { ...initialState, fileSaveResult: { fileId: 'barId', adminId: null } };
			setup(state);
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const feature = createFeature();
			const storageSpy = spyOn(measurementStorageServiceMock, 'store');

			classUnderTest.activate(map);
			classUnderTest._vectorLayer.getSource().addFeature(feature);
			classUnderTest.deactivate(map);

			setTimeout(() => {
				expect(storageSpy).toHaveBeenCalledWith(jasmine.any(String), FileStorageServiceDataTypes.KML);
				done();
			});
		});

		it('uses already written features for persisting purpose', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const saveSpy = spyOn(classUnderTest, '_save');
			spyOn(measurementStorageServiceMock, 'isValid').and.callFake(() => true);
			spyOn(classUnderTest, '_isEmpty').and.returnValue(false);

			classUnderTest.activate(map);
			classUnderTest.deactivate(map);

			expect(saveSpy).not.toHaveBeenCalled();
		});


		it('adds a vectorGeoResource for persisting purpose', (done) => {
			const state = { ...initialState, fileSaveResult: { fileId: null, adminId: null } };
			setup(state);
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const feature = createFeature();
			const addOrReplaceSpy = spyOn(geoResourceServiceMock, 'addOrReplace');
			spyOn(measurementStorageServiceMock, 'getStorageId').and.returnValue('f_ooBarId');
			const storageSpy = spyOn(measurementStorageServiceMock, 'store');
			classUnderTest.activate(map);
			classUnderTest._vectorLayer.getSource().addFeature(feature);
			classUnderTest.deactivate(map);

			setTimeout(() => {
				expect(storageSpy).toHaveBeenCalledWith(jasmine.any(String), FileStorageServiceDataTypes.KML);
				expect(addOrReplaceSpy).toHaveBeenCalledTimes(1);
				expect(addOrReplaceSpy).toHaveBeenCalledWith(jasmine.objectContaining({
					id: 'f_ooBarId',
					label: 'map_olMap_handler_draw_layer_label'
				}));
				done();
			});

		});

		it('adds layer with temporaryId while persisting layer failed', (done) => {
			const state = { ...initialState, fileSaveResult: null };
			const store = setup(state);
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const feature = createFeature();

			classUnderTest.activate(map);
			expect(classUnderTest._vectorLayer).toBeTruthy();
			classUnderTest._vectorLayer.getSource().addFeature(feature);
			classUnderTest.deactivate(map);

			setTimeout(() => {
				expect(store.getState().layers.active.length).toBe(1);
				expect(store.getState().layers.active[0].id).toBe('temp_draw_id');
				done();
			});

		});

		it('adds no layer when empty', (done) => {
			const store = setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const warnSpy = spyOn(console, 'warn');

			classUnderTest.activate(map);
			expect(classUnderTest._vectorLayer).toBeTruthy();
			classUnderTest.deactivate(map);

			setTimeout(() => {
				expect(store.getState().layers.active.length).toBe(0);
				expect(warnSpy).toHaveBeenCalledWith('Cannot store empty layer');
				done();
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
			setType('line');

			simulateDrawEvent('drawstart', classUnderTest._draw, feature);

			const id = feature.getId();

			expect(id).toBeTruthy();
			expect(id).toMatch(/draw_line_[0-9]{13}/g);
		});

		it('switches to modify after drawend', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new LineString([[0, 0], [1, 0]]);
			const feature = new Feature({ geometry: geometry });

			classUnderTest.activate(map);
			setType('line');
			expect(classUnderTest._modify.getActive()).toBeFalse();
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			simulateDrawEvent('drawend', classUnderTest._draw, feature);

			expect(classUnderTest._modify.getActive()).toBeTrue();
		});

		it('removes last point if keypressed', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new Polygon([[[0, 0], [500, 0], [550, 550], [0, 500], [0, 500]]]);
			const feature = new Feature({ geometry: geometry });
			const deleteKeyCode = 46;

			classUnderTest.activate(map);
			setType('line');
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			classUnderTest._draw.removeLastPoint = jasmine.createSpy();
			classUnderTest._draw.handleEvent = jasmine.createSpy().and.callThrough();
			feature.getGeometry().dispatchEvent('change');
			expect(classUnderTest._modify.getActive()).toBeFalse();

			simulateKeyEvent(deleteKeyCode);
			expect(classUnderTest._draw.removeLastPoint).toHaveBeenCalled();
		});

		it('removes NOT last point if other keypressed', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new Polygon([[[0, 0], [500, 0], [550, 550], [0, 500], [0, 500]]]);
			const feature = new Feature({ geometry: geometry });
			const deleteKeyCode = 42;

			classUnderTest.activate(map);
			setType('line');
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			classUnderTest._draw.removeLastPoint = jasmine.createSpy();
			feature.getGeometry().dispatchEvent('change');

			simulateKeyEvent(deleteKeyCode);
			expect(classUnderTest._draw.removeLastPoint).not.toHaveBeenCalled();
		});

		it('removes currently drawing two-point feature if keypressed', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const startNewSpy = spyOn(classUnderTest, '_startNew');
			const map = setupMap();
			const geometry = new Polygon([[[0, 0], [0, 0]]]);
			const feature = new Feature({ geometry: geometry });
			const deleteKeyCode = 46;

			classUnderTest.activate(map);
			setType('line');
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			feature.getGeometry().dispatchEvent('change');
			expect(classUnderTest._modify.getActive()).toBeFalse();

			simulateKeyEvent(deleteKeyCode);
			expect(startNewSpy).toHaveBeenCalled();
		});

		it('removes drawn feature if keypressed', (done) => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const deleteKeyCode = 46;

			classUnderTest.activate(map);
			setType('line');
			const geometry = new Polygon([[[0, 0], [500, 0], [550, 550], [0, 500], [0, 500]]]);
			const feature = new Feature({ geometry: geometry });
			const removeFeatureSpy = spyOn(classUnderTest._vectorLayer.getSource(), 'removeFeature').and.callFake(() => { });

			classUnderTest._vectorLayer.getSource().addFeature(feature);
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			simulateDrawEvent('drawend', classUnderTest._draw, feature);

			expect(classUnderTest._vectorLayer.getSource().getFeatures().length).toBe(1);
			simulateKeyEvent(deleteKeyCode);


			setTimeout(() => {
				expect(removeFeatureSpy).toHaveBeenCalledWith(feature);
				done();
			});
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

		it('creates and activates helpTooltip', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();

			classUnderTest.activate(map);

			expect(classUnderTest._helpTooltip).toBeDefined();
			expect(classUnderTest._helpTooltip.active).toBeTrue();
		});

		it('creates and NOT activates helpTooltip', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const environmentSpy = spyOn(environmentServiceMock, 'isTouch').and.returnValue(true);
			const map = setupMap();

			classUnderTest.activate(map);
			expect(classUnderTest._helpTooltip).toBeDefined();
			expect(classUnderTest._helpTooltip.active).toBeFalse();
			expect(environmentSpy).toHaveBeenCalled();
		});

		it('change drawState, when sketch is changing', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const drawStateSpy = jasmine.createSpy();
			classUnderTest.activate(map);
			classUnderTest._onDrawStateChanged(drawStateSpy);

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: null, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });

			setType('marker');
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 15, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.ACTIVE, snap: null, coordinate: [15, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
			classUnderTest._activeSketch = new Feature({ geometry: new Point([1, 0]) });
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 20, 0);
			expect(drawStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.DRAW, snap: null, coordinate: [20, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
		});

		it('change drawState, when sketch is snapping to first point', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const snappedGeometry = new LineString([[0, 0], [500, 0], [550, 550], [0, 500], [0, 500]]);
			const feature = new Feature({ geometry: snappedGeometry });

			const map = setupMap();

			classUnderTest.activate(map);
			setType('line');
			const measureStateSpy = spyOn(classUnderTest._helpTooltip, 'notify');

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			expect(measureStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.ACTIVE, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });

			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			snappedGeometry.setCoordinates([[0, 0], [500, 0], [550, 550], [0, 500], [0, 0], [0, 0]]);
			feature.getGeometry().dispatchEvent('change');

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 0, 0);
			expect(measureStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.DRAW, snap: InteractionSnapType.FIRSTPOINT, coordinate: [0, 0], pointCount: 6, dragging: jasmine.any(Boolean) });
		});

		it('change drawState, when sketch is snapping to last point', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const snappedGeometry = new LineString([[0, 0], [500, 0], [550, 550], [0, 500], [0, 500]]);
			const feature = new Feature({ geometry: snappedGeometry });
			const map = setupMap();

			classUnderTest.activate(map);
			setType('line');
			const measureStateSpy = spyOn(classUnderTest._helpTooltip, 'notify');

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			expect(measureStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.ACTIVE, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });

			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			snappedGeometry.setCoordinates([[0, 0], [500, 0], [550, 550], [0, 500], [0, 500], [0, 500]]);
			feature.getGeometry().dispatchEvent('change');
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 0, 500);
			expect(measureStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.DRAW, snap: InteractionSnapType.LASTPOINT, coordinate: [0, 500], pointCount: 6, dragging: jasmine.any(Boolean) });
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

		it('uses _lastPointerMoveEvent on removeLast if keypressed', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();
			const geometry = new Polygon([[[50, 0], [500, 0], [550, 550], [0, 500], [0, 500]]]);
			const feature = new Feature({ geometry: geometry });
			const deleteKeyCode = 46;

			classUnderTest.activate(map);
			setType('line');
			simulateDrawEvent('drawstart', classUnderTest._draw, feature);
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			classUnderTest._draw.removeLastPoint = jasmine.createSpy();
			classUnderTest._draw.handleEvent = jasmine.createSpy().and.callThrough();
			feature.getGeometry().dispatchEvent('change');
			expect(classUnderTest._modify.getActive()).toBeFalse();

			simulateKeyEvent(deleteKeyCode);
			expect(classUnderTest._drawState.type).toBe(InteractionStateType.DRAW);
			expect(classUnderTest._draw.removeLastPoint).toHaveBeenCalled();
			expect(classUnderTest._draw.handleEvent).toHaveBeenCalledWith(jasmine.any(MapBrowserEvent));
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
				expect(drawStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.MODIFY, snap: null, coordinate: [10, 0], pointCount: 0, dragging: jasmine.any(Boolean) });
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
				expect(drawStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.MODIFY, snap: InteractionSnapType.EGDE, coordinate: [50, 0], pointCount: jasmine.anything(), dragging: jasmine.any(Boolean) });
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
				expect(drawStateSpy).toHaveBeenCalledWith({ type: InteractionStateType.MODIFY, snap: InteractionSnapType.VERTEX, coordinate: [0, 0], pointCount: jasmine.anything(), dragging: jasmine.any(Boolean) });
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
			setType('marker');

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
			setType('marker');
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
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 550, 550);
			expect(classUnderTest._select.getFeatures().getLength()).toBe(1);
		});

		it('select only ONE feature (no multiselect; preselected feature is deselected)', () => {
			setup();
			const classUnderTest = new OlDrawHandler();
			const map = setupMap();

			classUnderTest.activate(map);
			setType('marker');
			const geometry = new Point([50, 50]);
			const feature1 = new Feature({ geometry: new Point([0, 0]) });
			const feature2 = new Feature({ geometry: geometry });


			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			simulateDrawEvent('drawstart', classUnderTest._draw, feature1);
			feature1.getGeometry().dispatchEvent('change');
			simulateDrawEvent('drawend', classUnderTest._draw, feature1);
			expect(classUnderTest._select).toBeDefined();

			setType('marker');
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);
			simulateDrawEvent('drawstart', classUnderTest._draw, feature2);
			feature2.getGeometry().dispatchEvent('change');
			simulateDrawEvent('drawend', classUnderTest._draw, feature2);
			expect(classUnderTest._select).toBeDefined();


			// force deselect
			classUnderTest._select.getFeatures().clear();
			expect(classUnderTest._select.getFeatures().getLength()).toBe(0);

			map.forEachFeatureAtPixel = jasmine.createSpy().and.callFake((pixel, callback) => {
				if (pixel[0] === 0 && pixel[1] === 0) {
					callback(feature1, classUnderTest._vectorLayer);
				}
				if (pixel[0] === 50 && pixel[1] === 50) {
					callback(feature2, classUnderTest._vectorLayer);
				}
			});

			// re-select
			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 50, 0);
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 0, 0);
			expect(classUnderTest._select.getFeatures().getLength()).toBe(1);

			simulateMapMouseEvent(map, MapBrowserEventType.POINTERMOVE, 50, 0);
			simulateMapMouseEvent(map, MapBrowserEventType.CLICK, 50, 50);
			expect(classUnderTest._select.getFeatures().getLength()).toBe(1);
		});
	});

	describe('_getDrawingTypeFrom', () => {
		it('get the DrawingType from valid feature', () => {

			setup();
			const classUnderTest = new OlDrawHandler();
			const feature = new Feature({ geometry: new Point([0, 0]) });

			expect(classUnderTest._getDrawingTypeFrom(null)).toBeNull();
			feature.setId('draw_marker_1234');
			expect(classUnderTest._getDrawingTypeFrom(feature)).toBe('marker');
			feature.setId('draw_Foo_1234');
			expect(classUnderTest._getDrawingTypeFrom(feature)).toBe('Foo');
			feature.setId('draw_1234');
			expect(classUnderTest._getDrawingTypeFrom(feature)).toBe(null);
		});
	});

	describe('_setDrawState', () => {
		it('left the current drawState as it is, when value not changes', () => {
			setup();
			const drawStateSpy = jasmine.createSpy();
			const classUnderTest = new OlDrawHandler();

			classUnderTest._onDrawStateChanged(drawStateSpy);

			const newDrawState = { ...classUnderTest._drawState };
			classUnderTest._setDrawState(newDrawState);
			classUnderTest._setDrawState(newDrawState);

			expect(drawStateSpy).toHaveBeenCalledTimes(1);
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



