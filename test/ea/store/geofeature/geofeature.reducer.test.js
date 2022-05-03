import { addGeoFeatureLayer, addGeoFeatures, clearMap, removeGeoFeatureLayer, removeGeoFeatures } from '../../../../src/ea/store/geofeature/geofeature.action';
import { geofeatureReducer } from '../../../../src/ea/store/geofeature/geofeature.reducer';
import { TestUtils } from '../../../test-utils';


describe('geofeatureReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			geofeature: geofeatureReducer
		});
	};

	it('initiales the store with default values', () => {
		const store = setup();

		expect(store.getState().geofeature.layers).toHaveSize(0);
		expect(store.getState().geofeature.active).toBeFalse(0);
	});

	it('adds a layer', () => {
		const store = setup();

		addGeoFeatureLayer(42);

		const geofeature = store.getState().geofeature;
		expect(geofeature.layers).toHaveSize(1);
		expect(geofeature.layers[0].id).toEqual(42);
		expect(geofeature.active).toBeTrue();
	});

	it('removes a layer', () => {
		const store = setup();
		addGeoFeatureLayer(42);

		removeGeoFeatureLayer(42);

		const geofeature = store.getState().geofeature;
		expect(geofeature.layers).toHaveSize(0);
		expect(geofeature.active).toBeFalse();
	});

	it('adds a feature', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		const feature = { id: 24, name: 'test-feature' };

		addGeoFeatures(42, [feature]);

		expect(store.getState().geofeature.layers[0].features).toHaveSize(1);
		expect(store.getState().geofeature.layers[0].features[0]).toBe(feature);
	});

	it('removes a feature by id', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		const feature = { id: 24, name: 'test-feature' };
		addGeoFeatures(42, [feature]);

		// try non existant id
		removeGeoFeatures(42, [1234]);
		expect(store.getState().geofeature.layers[0].features).toHaveSize(1);

		// try actual id
		removeGeoFeatures(42, [24]);
		expect(store.getState().geofeature.layers[0].features).toHaveSize(0);
	});

	it('clears all layers', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		addGeoFeatures([{ name: 'feature1' }, { name: 'feature2' }]);

		clearMap();

		expect(store.getState().geofeature.layers[0].features).toHaveSize(0);
	});

});
