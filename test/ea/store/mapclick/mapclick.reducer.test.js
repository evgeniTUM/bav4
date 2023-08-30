import { activateMapClick, deactivateMapClick, requestMapClick } from '../../../../src/ea/store/mapclick/mapclick.action';
import { mapclickReducer } from '../../../../src/ea/store/mapclick/mapclick.reducer';
import { TestUtils } from '../../../test-utils';

describe('mapclickReducer', () => {
	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			mapclick: mapclickReducer
		});
	};

	it('has corrent initial state', () => {
		const store = setup();

		const mapclick = store.getState().mapclick;
		expect(mapclick.active).toBe(false);
		expect(mapclick.coordinate).toBe(null);
		expect(mapclick.listener_id).toBe(null);
	});

	it('activate mapclick', () => {
		const store = setup();

		activateMapClick(42);

		expect(store.getState().mapclick.active).toBe(true);
		expect(store.getState().mapclick.listener_id).toBe(42);
	});

	it('deactivate mapclick', () => {
		const store = setup();

		deactivateMapClick();

		expect(store.getState().mapclick.active).toBe(false);
	});

	it('request mapclick', () => {
		const store = setup();

		requestMapClick([1, 2]);

		expect(store.getState().mapclick.coordinate.payload).toEqual([1, 2]);
	});
});
