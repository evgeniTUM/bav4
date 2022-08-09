import { activateGeoResource, activateLegend, activateTracking, clearPreviewGeoresourceId, deactivateAllGeoResources, deactivateGeoResource, deactivateLegend, deactivateTracking, setCurrentModule, setLegendItems, setMapResolution, setPreviewGeoresourceId } from '../../../../src/ea/store/module/ea.action';
import { eaReducer } from '../../../../src/ea/store/module/ea.reducer';
import { TestUtils } from '../../../test-utils';


describe('ea.reducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			ea: eaReducer
		});
	};

	it('has correct initial values', () => {
		const store = setup();
		expect(store.getState().ea.currentModule).toBe(null);
		expect(store.getState().ea.activeGeoResources).toEqual([]);
		expect(store.getState().ea.legendActive).toEqual(false);
		expect(store.getState().ea.legendGeoresourceId).toBeNull();
		expect(store.getState().ea.legendItems).toEqual([]);
		expect(store.getState().ea.mapResolution).toEqual(0.0);
		expect(store.getState().ea.trackingActive).toEqual(false);
	});

	it('sets the module id', () => {
		const store = setup();

		setCurrentModule('test-tag');
		expect(store.getState().ea.currentModule).toBe('test-tag');
	});

	it('adds a georesourceId', () => {
		const store = setup();

		activateGeoResource('id42');
		activateGeoResource('id24');
		// treat list as a set
		activateGeoResource('id42');

		expect(store.getState().ea.activeGeoResources).toEqual(['id42', 'id24']);
	});

	it('removes a georesourceId', () => {
		const store = setup();

		activateGeoResource('id42');
		deactivateGeoResource('id42');

		expect(store.getState().ea.activeGeoResources).toHaveSize(0);
	});

	it('removes all georesources', () => {
		const store = setup();

		activateGeoResource('id42');
		activateGeoResource('id24');
		deactivateAllGeoResources('id42');

		expect(store.getState().ea.activeGeoResources).toHaveSize(0);
	});

	it('activates/deactivates the legend', () => {
		const store = setup();

		activateLegend();

		expect(store.getState().ea.legendActive).toEqual(true);

		deactivateLegend();

		expect(store.getState().ea.legendActive).toEqual(false);
	});

	it('sets the georesource id for the legend', () => {
		const store = setup();

		setPreviewGeoresourceId('id42');

		expect(store.getState().ea.legendGeoresourceId).toEqual('id42');
	});

	it('clears the georesource id for the legend', () => {
		const store = setup();

		setPreviewGeoresourceId('id42');

		clearPreviewGeoresourceId();

		expect(store.getState().ea.legendGeoresourceId).toBeNull();
	});

	it('sets the legend items', () => {
		const store = setup();

		const legendItems1 = { title: 'title1', maxResolution: 100, minResolution: 0, legendUrl: 'url1' };
		const legendItems2 = { title: 'title2', maxResolution: 100, minResolution: 0, legendUrl: 'url2' };
		setLegendItems([legendItems1, legendItems2]);

		expect(store.getState().ea.legendItems).toEqual([legendItems1, legendItems2]);
	});

	it('sets the map resolution', () => {
		const store = setup();

		setMapResolution(42.24);

		expect(store.getState().ea.mapResolution).toEqual(42.24);
	});

	it('activates/deactivates the tracking', () => {
		const store = setup();

		activateTracking();

		expect(store.getState().ea.trackingActive).toEqual(true);

		deactivateTracking();

		expect(store.getState().ea.trackingActive).toEqual(false);
	});
});
