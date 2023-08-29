import { Map, View } from 'ol';
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
import { setLocation, setTaggingMode } from '../../../../../../../../src/ea/store/locationSelection/locationSelection.action';
import { eaReducer } from '../../../../../../../../src/ea/store/module/ea.reducer';

describe('OlSelectLocationHandler', () => {
	const translationServiceMock = { translate: (key) => key };
	const defaultState = {
		contribution: initialState
	};
	const setup = (state = defaultState) => {
		const store = TestUtils.setupStoreAndDi(state, {
			locationSelection: locationSelection,
			ea: eaReducer
		});
		$injector.registerSingleton('TranslationService', translationServiceMock);
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
	});
});
