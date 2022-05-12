import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { GEO_FEATURE_LAYER_ID, OlGeoFeatureLayerHandler } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/geofeature/OlGeoFeatureLayerHandler';
import { styleTemplates } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/geofeature/styleTemplates';
import { addGeoFeatureLayer, addGeoFeatures, clearLayer } from '../../../../../../../../src/ea/store/geofeature/geofeature.action';
import { geofeatureReducer } from '../../../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { activateMapClick, deactivateMapClick } from '../../../../../../../../src/ea/store/mapclick/mapclick.action';
import { mapclickReducer, MAPCLICK_REQUEST } from '../../../../../../../../src/ea/store/mapclick/mapclick.reducer';
import { $injector } from '../../../../../../../../src/injection';
import { FIT_REQUESTED, positionReducer } from '../../../../../../../../src/store/position/position.reducer';
import { simulateMapBrowserEvent } from '../../../../../../../modules/map/components/olMap/mapTestUtils';
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

	it('instantiates the handler', () => {
		setup();
		const handler = new OlGeoFeatureLayerHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(GEO_FEATURE_LAYER_ID);
		expect(handler.options).toEqual({ preventDefaultClickHandling: true, preventDefaultContextClickHandling: true });
	});

	describe('when activated over olMap,', () => {
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

		describe('with existing layer,', () => {
			const layerId = 42;

			const setupWithLayer = () => {
				const map = setupMap();
				setup();

				addGeoFeatureLayer({ id: layerId });
				return map;
			};

			it('fits the map to the layer when a new feature is added (with zoom scale of 20%)', () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				classUnderTest.activate(map);

				addGeoFeatures(layerId, [GEOJSON_SAMPLE_DATA]);

				const fitActions = storeActions.filter(a => a.type === FIT_REQUESTED);
				expect(fitActions).toHaveSize(1);
				expect(fitActions[0].payload._payload.extent).toEqual([-1, -1, 11, 11]);
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

				clearLayer(layerId);

				expect(layer.getSource().getFeatures().length).toEqual(0);
			});

			it('sets style for a feature', async () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				const layer = classUnderTest.activate(map);

				const feature = {
					...GEOJSON_SAMPLE_DATA,
					style: { template: 'geolocation' }
				};
				addGeoFeatures(layerId, [feature]);

				const actualFeatures = layer.getSource().getFeatures();
				expect(actualFeatures.length).toEqual(1);
				expect(actualFeatures[0].getStyle()()).toEqual(styleTemplates['geolocation']);
			});


			it('sends a \'mapclick/request\' event on pointer click', async () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				classUnderTest.activate(map);

				const coordinate = [38, 75];

				simulateMapBrowserEvent(map, MapBrowserEventType.CLICK, ...coordinate);

				const mapclickRequestActions = storeActions.filter(a => a.type === MAPCLICK_REQUEST);
				expect(mapclickRequestActions).toHaveSize(1);
				expect(mapclickRequestActions[0].payload.payload).toEqual(coordinate);
			});

			it('help tooltip is not active on init', () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();

				classUnderTest.activate(map);

				expect(classUnderTest._helpTooltip.active).toBeFalse();
			});

			it('help tooltip is active when mapclick.active is true', () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				classUnderTest.activate(map);

				activateMapClick();
				expect(classUnderTest._helpTooltip.active).toBeTrue();

				deactivateMapClick();
				expect(classUnderTest._helpTooltip.active).toBeFalse();
			});

			it('help tooltip shows message on mousemove', () => {
				const map = setupWithLayer();

				const classUnderTest = new OlGeoFeatureLayerHandler();
				classUnderTest.activate(map);
				activateMapClick();

				expect(classUnderTest._helpTooltip._tooltipMessageProvideFunction()).toEqual('ea_map_select_region');

				const notifySpy = spyOn(classUnderTest._helpTooltip, 'notify');
				simulateMapBrowserEvent(map, MapBrowserEventType.POINTERMOVE, 10, 0);

				expect(notifySpy).toHaveBeenCalledWith(jasmine.objectContaining({ coordinate: [10, 0] }));
			});


		});


	});
});
