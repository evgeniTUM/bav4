import { Map, View } from 'ol';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import {
	OlSelectLocationHandler,
	SELECT_LOCATION_LAYER_ID
} from '../../../../../../../../src/ea/modules/map/components/olMap/handler/selection/OlSelectLocationHandler';
import { $injector } from '../../../../../../../../src/injection';
import { TestUtils } from '../../../../../../../test-utils.js';
import { initialState, locationSelection } from '../../../../../../../../src/ea/store/locationSelection/locationSelection.reducer';
import { setLocation, setTaggingMode, setTooltipText } from '../../../../../../../../src/ea/store/locationSelection/locationSelection.action';
import { eaReducer } from '../../../../../../../../src/ea/store/module/ea.reducer';
import { simulateMapBrowserEvent } from '../../../../../../../modules/olMap/mapTestUtils';
import { LevelTypes } from '../../../../../../../../src/store/notifications/notifications.action';
import { notificationReducer } from '../../../../../../../../src/store/notifications/notifications.reducer';

describe('OlSelectLocationHandler', () => {
	const translationServiceMock = { translate: (key) => key };
	const administrationServiceMock = { isOutOfBavaria: async (coordinate3857) => false };
	const defaultState = {
		locationSelection: initialState
	};
	const setup = (state = defaultState) => {
		const store = TestUtils.setupStoreAndDi(state, {
			locationSelection: locationSelection,
			ea: eaReducer,
			notifications: notificationReducer
		});
		$injector.registerSingleton('TranslationService', translationServiceMock);
		$injector.registerSingleton('AdministrationService', administrationServiceMock);
		return store;
	};

	it('instantiates handler', () => {
		setup();
		const handler = new OlSelectLocationHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(SELECT_LOCATION_LAYER_ID);
		expect(handler.options).toEqual({ preventDefaultClickHandling: false, preventDefaultContextClickHandling: false });
	});

	describe('when activated over olMap', () => {
		const initialCenter = fromLonLat([11.57245, 48.14021]);

		const setupMap = () => {
			const container = document.createElement('div');
			return new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})
				],
				target: container,
				view: new View({
					center: initialCenter,
					zoom: 1
				})
			});
		};

		it('creates a layer to draw', () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlSelectLocationHandler();
			const layer = classUnderTest.activate(map);

			expect(layer).toBeTruthy();
		});

		it('displays current selected location', () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setLocation([4, 2]);

			expect(classUnderTest._positionFeature.getGeometry().getCoordinates()).toEqual([4, 2]);
		});

		it('activates tooltip when tagging mode active', async () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);
			expect(classUnderTest._helpTooltip._map).not.toBeNull();

			setTaggingMode(false);
			expect(classUnderTest._helpTooltip._map).toBeNull();
		});

		it('sets mouseover tooltip on locationSeleciton.tooltipText change', async () => {
			const expectedText = 'tooltip text';
			const map = setupMap();
			setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTooltipText(expectedText);

			expect(classUnderTest._helpTooltip._tooltipMessageProvideFunction()).toEqual(expectedText);
		});

		it('sets mouse cursor over map to crosshair when tagging mode active', async () => {
			const map = setupMap();
			const store = setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);
			expect(store.getState().ea.mapCursorStyle).toEqual('crosshair');

			setTaggingMode(false);
			expect(store.getState().ea.mapCursorStyle).toEqual('auto');
		});

		it('prevents default click handling when tagging mode active', async () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);
			expect(classUnderTest._options.preventDefaultClickHandling).toEqual(true);
			expect(classUnderTest._options.preventDefaultContextClickHandling).toEqual(true);

			setTaggingMode(false);
			expect(classUnderTest._options.preventDefaultClickHandling).toEqual(false);
			expect(classUnderTest._options.preventDefaultContextClickHandling).toEqual(false);
		});

		it('sets new location on mouse click if coordiantes click inside bavaria', async () => {
			spyOn(administrationServiceMock, 'isOutOfBavaria').and.returnValue(false);

			const map = setupMap();
			const store = setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);

			simulateMapBrowserEvent(map, MapBrowserEventType.CLICK, 600, 0);
			await TestUtils.timeout();

			expect(store.getState().locationSelection.position).toEqual([600, 0]);
		});

		it('does not set location if click outside bavaria', async () => {
			spyOn(administrationServiceMock, 'isOutOfBavaria').and.returnValue(true);

			const map = setupMap();
			const store = setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);

			simulateMapBrowserEvent(map, MapBrowserEventType.CLICK, 600, 0);
			await TestUtils.timeout();

			expect(store.getState().locationSelection.position).toBeNull();
		});

		it('emits a user warning if click outside bavaria', async () => {
			spyOn(administrationServiceMock, 'isOutOfBavaria').and.returnValue(true);

			const map = setupMap();
			const store = setup();

			const classUnderTest = new OlSelectLocationHandler();
			classUnderTest.activate(map);

			setTaggingMode(true);

			simulateMapBrowserEvent(map, MapBrowserEventType.CLICK, 600, 0);
			await TestUtils.timeout();

			expect(store.getState().notifications.latest.payload.level).toEqual(LevelTypes.WARN);
			expect(store.getState().notifications.latest.payload.content).toBe('ea_notification_coordinates_outside_bavaria');
		});
	});
});
