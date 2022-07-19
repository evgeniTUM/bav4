import { setMapCursorStyle } from '../../../../src/ea/store/mapclick/mapclick.action';
import { activateGeoResource, activateLegend, clearPreviewGeoresourceId, deactivateAllGeoResources, deactivateGeoResource, deactivateLegend, setCurrentModule, setLegendItems, setMapResolution, setPreviewGeoresourceId } from '../../../../src/ea/store/module/module.action';
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
		expect(store.getState().module.legendGeoresourceId).toBeNull();
		expect(store.getState().module.legendItems).toEqual([]);
		expect(store.getState().module.mapResolution).toEqual(0.0);
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

	it('sets the georesource id for the legend', () => {
		const store = setup();

		setPreviewGeoresourceId('id42');

		expect(store.getState().module.legendGeoresourceId).toEqual('id42');
	});

	it('clears the georesource id for the legend', () => {
		const store = setup();

		setPreviewGeoresourceId('id42');

		clearPreviewGeoresourceId();

		expect(store.getState().module.legendGeoresourceId).toBeNull();
	});

	it('sets the legend items', () => {
		const store = setup();

		const legendItems1 = { title: 'title1', maxResolution: 100, minResolution: 0, legendUrl: 'url1' };
		const legendItems2 = { title: 'title2', maxResolution: 100, minResolution: 0, legendUrl: 'url2' };
		setLegendItems([legendItems1, legendItems2]);

		expect(store.getState().module.legendItems).toEqual([legendItems1, legendItems2]);
	});

	it('sets the map resolution', () => {
		const store = setup();

		setMapResolution(42.24);

		expect(store.getState().module.mapResolution).toEqual(42.24);
	});
});
