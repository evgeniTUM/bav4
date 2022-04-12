import { GeoFeaturePlugin, GEO_FEATURE_LAYER_ID } from '../../../src/ea/plugins/GeoFeaturePlugin.js';
import { addGeoFeatureLayer, clearGeoFeatures } from '../../../src/ea/store/geofeature/geofeature.action.js';
import { geofeatureReducer } from '../../../src/ea/store/geofeature/geofeature.reducer.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('GeoFeaturePlugin', () => {
	const setup = (state) => {

		const store = TestUtils.setupStoreAndDi(state, {
			geofeature: geofeatureReducer,
			layers: layersReducer
		});

		return store;
	};

	it('adds/removes layer on geofeature active flag', async () => {
		const store = setup();

		const instanceUnderTest = new GeoFeaturePlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		addGeoFeatureLayer(42);

		expect(store.getState().layers.active.length).toBe(1);
		const layer = store.getState().layers.active[0];
		expect(layer.id).toBe(GEO_FEATURE_LAYER_ID);
		expect(layer.label).toBe("Verwaltungseinheiten");
		expect(layer.constraints.alwaysTop).toBeTrue();

		clearGeoFeatures();

		expect(store.getState().layers.active.length).toBe(0);
	});
});
