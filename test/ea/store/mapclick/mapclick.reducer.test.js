import { mapclickReducer } from '../../../../src/ea/store/mapclick/mapclick.reducer';
import { activateMapClick, deactivateMapClick } from '../../../../src/ea/store/mapclick/mapclick.action';
import { TestUtils } from '../../../test-utils';


describe('mapclickReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			mapclick: mapclickReducer
		});
	};

	it('activate mapclick', () => {
		const store = setup({
			coordinate: null,
			active: false
		});
		activateMapClick();
		expect(store.getState().mapclick.active).toBe(true);
	});

	it('deactivate mapclick', () => {
		const store = setup({
			coordinate: null,
			active: false
		});
		deactivateMapClick();
		expect(store.getState().mapclick.active).toBe(false);
	});

});
