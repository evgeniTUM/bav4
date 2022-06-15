import { activateGeoResource, activateLegend, deactivateAllGeoResources, deactivateGeoResource, deactivateLegend, setCurrentModule } from '../../../../src/ea/store/module/module.action';
import { moduleReducer } from '../../../../src/ea/store/module/module.reducer';
import { TestUtils } from '../../../test-utils';


describe('module Reducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			module: moduleReducer
		});
	};

	it('has correct initial values', () => {
		const store = setup();
		expect(store.getState().module.current).toBe(null);
		expect(store.getState().module.activeGeoResources).toEqual([]);
		expect(store.getState().module.legendActive).toEqual(false);
	});

	it('sets the module id', () => {
		const store = setup();

		setCurrentModule('test-tag');
		expect(store.getState().module.current).toBe('test-tag');
	});

	it('adds a georesourceId', () => {
		const store = setup();

		activateGeoResource('id42');
		activateGeoResource('id24');
		// treat list as a set
		activateGeoResource('id42');

		expect(store.getState().module.activeGeoResources).toEqual(['id42', 'id24']);
	});

	it('removes a georesourceId', () => {
		const store = setup();

		activateGeoResource('id42');
		deactivateGeoResource('id42');

		expect(store.getState().module.activeGeoResources).toHaveSize(0);
	});

	it('removes all georesources', () => {
		const store = setup();

		activateGeoResource('id42');
		activateGeoResource('id24');
		deactivateAllGeoResources('id42');

		expect(store.getState().module.activeGeoResources).toHaveSize(0);
	});

	it('activates/deactivates the legend', () => {
		const store = setup();

		activateLegend();

		expect(store.getState().module.legendActive).toEqual(true);

		deactivateLegend();

		expect(store.getState().module.legendActive).toEqual(false);
	});

});
