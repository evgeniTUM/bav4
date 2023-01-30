import { Feature, Map, View } from 'ol';
import { Geometry, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { SELECT_LOCATION_LAYER_ID, OlSelectLocationHandler } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/selection/OlSelectLocationHandler';
import { setLocation } from '../../../../../../../../src/ea/store/contribution/contribution.action';
import { contributionReducer, initialState } from '../../../../../../../../src/ea/store/contribution/contribution.reducer';
import { $injector } from '../../../../../../../../src/injection';
import { TestUtils } from '../../../../../../../test-utils.js';




describe('OlSelectLocationHandler', () => {

	const translationServiceMock = { translate: (key) => key };
	const defaultState = {
		contribution: initialState
	};
	const setup = (state = defaultState) => {
		const store = TestUtils.setupStoreAndDi(state, { contribution: contributionReducer });
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
		expect(handler.options).toEqual({ preventDefaultClickHandling: true, preventDefaultContextClickHandling: true });
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
					})],
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
	});
});
