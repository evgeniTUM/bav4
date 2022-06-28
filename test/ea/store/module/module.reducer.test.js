import { activateGeoResource, activateLegend, addLegendGeoresourceId, clearLegendGeoresourceIds, deactivateAllGeoResources, deactivateGeoResource, deactivateLegend, removeLegendGeoresourceId, setCurrentModule } from '../../../../src/ea/store/module/module.action';
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
		expect(store.getState().module.legendGeoresourceIds).toEqual([]);
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

	it('adds georesource id to the legend', () => {
		const store = setup();

		addLegendGeoresourceId('id42');
		addLegendGeoresourceId('id43');

		expect(store.getState().module.legendGeoresourceIds).toEqual(['id42', 'id43']);
	});

	it('adds georesource id from the legend', () => {
		const store = setup();

		addLegendGeoresourceId('id42');
		removeLegendGeoresourceId('id42');

		expect(store.getState().module.legendGeoresourceIds).toEqual([]);
	});

	it('clears all georesource ids from the legend', () => {
		const store = setup();

		addLegendGeoresourceId('id42');
		addLegendGeoresourceId('id43');

		clearLegendGeoresourceIds();

		expect(store.getState().module.legendGeoresourceIds).toEqual([]);
	});
});
