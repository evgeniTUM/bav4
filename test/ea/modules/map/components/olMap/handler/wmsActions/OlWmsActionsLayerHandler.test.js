import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { OlWmsActionsLayerHandler, WMS_ACTIONS_LAYER_ID } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/wmsActions/OlWmsActionsLayerHandler';
import { addGeoFeatureLayer } from '../../../../../../../../src/ea/store/geofeature/geofeature.action';
import { moduleReducer } from '../../../../../../../../src/ea/store/module/module.reducer';
import { CLICK_CHANGED } from '../../../../../../../../src/store/pointer/pointer.reducer';
import { positionReducer } from '../../../../../../../../src/store/position/position.reducer';
import { simulateMapBrowserEvent } from '../../../../../../../modules/olMap/mapTestUtils';
import { TestUtils } from '../../../../../../../test-utils.js';



describe('OlWmsActionsLayerHandler', () => {

	const storeActions = [];

	const setup = (state) => {
		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			position: positionReducer,
			module: moduleReducer
		});
		return store;
	};

	it('instantiates the handler', () => {
		setup();
		const handler = new OlWmsActionsLayerHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(WMS_ACTIONS_LAYER_ID);
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

			const classUnderTest = new OlWmsActionsLayerHandler();
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


			it('triggers a \'CLICK_CHANGED\' event on mouse click', async () => {
				const map = setupWithLayer();

				const classUnderTest = new OlWmsActionsLayerHandler();
				classUnderTest.activate(map);

				const coordinate = [38, 75];

				simulateMapBrowserEvent(map, MapBrowserEventType.CLICK, ...coordinate);

				const mapclickRequestActions = storeActions.filter(a => a.type === CLICK_CHANGED);
				expect(mapclickRequestActions).toHaveSize(1);
				expect(mapclickRequestActions[0].payload.payload).toEqual({ coordinate });
			});
		});
	});
});
