import { addGeoFeatureLayer, addGeoFeatures, clearGeoFeatures, removeGeoFeaturesById } from '../../../../src/ea/store/geofeature/geofeature.action';
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

		expect(store.getState().geofeature.id).toBeNull();
		expect(store.getState().geofeature.features).toHaveSize(0);
		expect(store.getState().geofeature.active).toBeFalse(0);
	});

	it('adds a layer', () => {
		const store = setup();

		addGeoFeatureLayer(42);

		expect(store.getState().geofeature.features).toHaveSize(0);
		expect(store.getState().geofeature.active).toBeTrue();
	});

	it('adds a feature with given id', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		const feature = { id: 24, name: 'test-feature'};

		addGeoFeatures(feature);

		expect(store.getState().geofeature.features).toHaveSize(1);
		expect(store.getState().geofeature.features[0]).toBe(feature);
		expect(store.getState().geofeature.features[0].id).toBe(24);
	});
	
	it('adds a feature without id', () => {
		const store = setup();
		addGeoFeatureLayer(42);
		const feature = { name: 'test-feature'};

		addGeoFeatures(feature);

		expect(store.getState().geofeature.features).toHaveSize(1);
		expect(store.getState().geofeature.features[0]).toBe(feature);
		expect(store.getState().geofeature.features[0].id).toBeGreaterThan(0);
	});

	it('removes a feature by id', () => {
		const store = setup();
		addGeoFeatureLayer(24);
		const feature = { id: 42, name: 'test-feature'};
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
		addGeoFeatures({ name: "feature1"});
		addGeoFeatures({ name: "feature2"});

		clearGeoFeatures();

		expect(store.getState().geofeature.features).toHaveSize(0);
	});

});
