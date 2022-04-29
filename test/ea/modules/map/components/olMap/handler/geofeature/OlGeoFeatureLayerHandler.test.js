import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { GEO_FEATURE_LAYER_ID, OlGeoFeatureLayerHandler } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { addGeoFeatureLayer, addGeoFeatures, clearLayers } from '../../../../../../../../src/ea/store/geofeature/geofeature.action';
import { geofeatureReducer } from '../../../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { mapclickReducer } from '../../../../../../../../src/ea/store/mapclick/mapclick.reducer';
import { $injector } from '../../../../../../../../src/injection';
import { FIT_REQUESTED, positionReducer } from '../../../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../../../test-utils.js';

const GEOJSON_SAMPLE_DATA = {
	type: 'Feature',
	geometry: {
		'type': 'Polygon',
		'coordinates': [[
			[0, 0],
			[10, 10],

			[3, 5],
			[7, 6]
		]]
	}
};

describe('OlGeoFeatureLayerHandler', () => {

	const translationServiceMock = { translate: (key) => key };
	const coordinateServiceMock = {};
	const mapServiceMock = { getSrid: () => 4326 };

	const storeActions = [];

	const setup = (state) => {
		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			geofeature: geofeatureReducer,
			mapclick: mapclickReducer,
			position: positionReducer
		});
		$injector
			.registerSingleton('TranslationService', translationServiceMock)
			.registerSingleton('CoordinateService', coordinateServiceMock)
			.registerSingleton('MapService', mapServiceMock);
		return store;
	};

	it('has two methods', () => {
		setup();
		const handler = new OlGeoFeatureLayerHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(GEO_FEATURE_LAYER_ID);
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

			const classUnderTest = new OlGeoFeatureLayerHandler();
			const layer = classUnderTest.activate(map);

			expect(layer).toBeTruthy();
		});

		describe('when a layer exists', () => {
			const layerId = 42;

			const setupWithLayer = () => {
				const map = setupMap();
				setup();

				addGeoFeatureLayer(layerId);
				return map;
			};

			it('fits the map to the layer when a new feature is added (with zoom scale of 20%)', () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				classUnderTest.activate(map);

				addGeoFeatures(layerId, [GEOJSON_SAMPLE_DATA]);

				const setFitActions = storeActions.filter(a => a.type === FIT_REQUESTED);
				expect(setFitActions).toHaveSize(1);
				expect(setFitActions[0].payload._payload.extent).toEqual([-1, -1, 11, 11]);
			});

			it('shows features in store slice \'geofeatures\'', async () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				const layer = classUnderTest.activate(map);

				addGeoFeatures(layerId, [GEOJSON_SAMPLE_DATA]);

				const actualFeatures = layer.getSource().getFeatures();
				expect(actualFeatures.length).toEqual(1);
				expect(actualFeatures[0].getGeometry().getCoordinates())
					.toEqual(GEOJSON_SAMPLE_DATA.geometry.coordinates);

				clearLayers();

				expect(layer.getSource().getFeatures().length).toEqual(0);
			});

		});


	});
});
