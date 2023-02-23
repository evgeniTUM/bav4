import {
	addGeoFeatureLayer,
	addGeoFeatures,
	clearLayer,
	clearMap,
	removeGeoFeatureLayer,
	removeGeoFeatures
} from '../../../../src/ea/store/geofeature/geofeature.action';
import { geofeatureReducer, initialState } from '../../../../src/ea/store/geofeature/geofeature.reducer';
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

	it('adds a non-draggable layer', () => {
		const store = setup();

		addGeoFeatureLayer({ id: 42 });

		const geofeature = store.getState().geofeature;
		expect(geofeature.layers).toHaveSize(1);
		expect(geofeature.layers[0].id).toEqual(42);
		expect(geofeature.layers[0].draggable).toBeFalse();
		expect(geofeature.active).toBeTrue();
	});

	it('adds a draggable layer', () => {
		const store = setup();

		addGeoFeatureLayer({ id: 42, draggable: true });

		const geofeature = store.getState().geofeature;
		expect(geofeature.layers).toHaveSize(1);
		expect(geofeature.layers[0].id).toEqual(42);
		expect(geofeature.layers[0].draggable).toBeTrue();
		expect(geofeature.active).toBeTrue();
	});

	it('removes a layer', () => {
		const store = setup();
		addGeoFeatureLayer({ id: 42 });

		removeGeoFeatureLayer(42);

		const geofeature = store.getState().geofeature;
		expect(geofeature.layers).toHaveSize(0);
		expect(geofeature.active).toBeFalse();
	});

	it('adds a feature', () => {
		const store = setup();
		addGeoFeatureLayer({ id: 42 });
		const feature = { id: 24, name: 'test-feature', some_property: 'test' };

		addGeoFeatures(42, [feature]);

		expect(store.getState().geofeature.layers[0].features).toHaveSize(1);
		expect(store.getState().geofeature.layers[0].features[0]).toBe(feature);
	});

	it('removes a feature by id', () => {
		const store = setup();
		addGeoFeatureLayer({ id: 42 });
		const feature = { id: 24, name: 'test-feature' };
		addGeoFeatures(42, [feature]);

		// try non existant id
		removeGeoFeatures(42, [1234]);
		expect(store.getState().geofeature.layers[0].features).toHaveSize(1);

		// try actual id
		removeGeoFeatures(42, [24]);
		expect(store.getState().geofeature.layers[0].features).toHaveSize(0);
	});

	it('clears specific layer', () => {
		const store = setup();
		addGeoFeatureLayer({ id: 42 });
		addGeoFeatures(42, [{ name: 'feature1' }, { name: 'feature2' }]);
		addGeoFeatureLayer({ id: 43 });
		addGeoFeatures(43, [{ name: 'feature3' }]);

		clearLayer(42);

		expect(store.getState().geofeature.layers).toHaveSize(2);
		const layer42 = store.getState().geofeature.layers.filter((l) => l.id === 42)[0];
		expect(layer42.features).toHaveSize(0);
	});

	it('clears map', () => {
		const store = setup();
		addGeoFeatureLayer({ id: 42 });
		addGeoFeatures(42, [{ name: 'feature1' }, { name: 'feature2' }]);
		addGeoFeatureLayer({ id: 43 });
		addGeoFeatures(43, [{ name: 'feature3' }]);

		clearMap();

		expect(store.getState().geofeature).toEqual(initialState);
	});
});
