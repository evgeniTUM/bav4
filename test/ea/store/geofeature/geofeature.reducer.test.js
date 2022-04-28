import { addGeoFeatureLayer, addGeoFeatures, clearGeoFeatures, removeGeoFeatureLayer, removeGeoFeaturesById } from '../../../../src/ea/store/geofeature/geofeature.action';
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
		expect(store.getState().geofeature.features).toHaveSize(0);
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

		addGeoFeatures(feature);

		expect(store.getState().geofeature.features).toHaveSize(1);
		expect(store.getState().geofeature.features[0]).toBe(feature);
	});

	it('removes a feature by id', () => {
		const store = setup();
		addGeoFeatureLayer(24);
		const feature = { id: 42, name: 'test-feature' };
		addGeoFeatures(feature);

		// try non existant id
		removeGeoFeaturesById(1234);
		expect(store.getState().geofeature.features).toHaveSize(1);

		// try actual id
		removeGeoFeaturesById(42);
		expect(store.getState().geofeature.features).toHaveSize(0);
	});

	it('clears all features', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		addGeoFeatures({ name: 'feature1' });
		addGeoFeatures({ name: 'feature2' });

		clearGeoFeatures();

		expect(store.getState().geofeature.features).toHaveSize(0);
	});

});
