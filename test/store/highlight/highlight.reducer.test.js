import { highlightReducer } from '../../../src/store/highlight/highlight.reducer';
import { removeHighlightFeatures, clearHighlightFeatures, HighlightFeatureTypes, addHighlightFeatures, removeHighlightFeaturesById } from '../../../src/store/highlight/highlight.action';
import { TestUtils } from '../../test-utils.js';


describe('highlightReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			highlight: highlightReducer
		});
	};

	it('initiales the store with default values', () => {
		const store = setup();
		expect(store.getState().highlight.features).toHaveSize(0);
		expect(store.getState().highlight.active).toBeFalse();
	});

	it('changes the \'features\' and \'active\' property by adding features', () => {
		const store = setup();
		const highlightFeature = { type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] }, id: 'id' };

		addHighlightFeatures([]);

		expect(store.getState().highlight.features).toHaveSize(0);
		expect(store.getState().highlight.active).toBeFalse();

		addHighlightFeatures(highlightFeature);

		expect(store.getState().highlight.features).toEqual([highlightFeature]);
		expect(store.getState().highlight.active).toBeTrue();

		removeHighlightFeatures();

		expect(store.getState().highlight.features).toHaveSize(0);
		expect(store.getState().highlight.active).toBeFalse();

		addHighlightFeatures(highlightFeature);
		addHighlightFeatures(highlightFeature);

		expect(store.getState().highlight.features).toHaveSize(2);
		expect(store.getState().highlight.active).toBeTrue();

		removeHighlightFeatures();
		addHighlightFeatures([highlightFeature]);

		expect(store.getState().highlight.features).toEqual([highlightFeature]);
		expect(store.getState().highlight.active).toBeTrue();

		removeHighlightFeatures();
		addHighlightFeatures([highlightFeature, highlightFeature]);

		expect(store.getState().highlight.features).toHaveSize(2);
		expect(store.getState().highlight.active).toBeTrue();
	});

	it('changes the \'features\' and \'active\' property by clearing all features', () => {
		const store = setup();
		const highlightFeature = { type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] } };

		addHighlightFeatures(highlightFeature);

		expect(store.getState().highlight.features).toEqual([highlightFeature]);
		expect(store.getState().highlight.active).toBeTrue();

		clearHighlightFeatures();

		expect(store.getState().highlight.features).toHaveSize(0);
		expect(store.getState().highlight.active).toBeFalse();
	});

	it('sets an feature id if missing', () => {
		const store = setup();
		const highlightFeature = { type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] } };

		addHighlightFeatures(highlightFeature);

		expect(store.getState().highlight.features[0].id).toBeInstanceOf(Number);

		clearHighlightFeatures();

		addHighlightFeatures(highlightFeature);

		expect(store.getState().highlight.features[0].id).toBeInstanceOf(Number);
	});

	it('changes the \'features\' and \'active\' property by removing a features by id', () => {
		const id = 'foo';
		const store = setup();
		const highlightFeature0 = { type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] }, id: id };
		//a second feature with the same id
		const highlightFeature1 = { type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [44, 55] }, id: id };

		addHighlightFeatures(highlightFeature0);

		removeHighlightFeaturesById(id);

		expect(store.getState().highlight.features).toHaveSize(0);
		expect(store.getState().highlight.active).toBeFalse();

		addHighlightFeatures([highlightFeature0, highlightFeature1]);
		addHighlightFeatures({ type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] } });

		removeHighlightFeaturesById(id);

		expect(store.getState().highlight.features).toHaveSize(1);
		expect(store.getState().highlight.features[0].id).not.toBe(id);
		expect(store.getState().highlight.active).toBeTrue();

		clearHighlightFeatures();
		addHighlightFeatures([highlightFeature0, highlightFeature1]);
		addHighlightFeatures({ id: 'bar', type: HighlightFeatureTypes.DEFAULT, data: { coordinate: [21, 42] } });

		removeHighlightFeaturesById([id, 'bar']);

		expect(store.getState().highlight.features).toHaveSize(0);
	});
});
