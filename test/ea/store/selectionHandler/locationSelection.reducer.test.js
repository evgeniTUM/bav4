import { setLocation, setTaggingMode } from '../../../../src/ea/store/locationSelection/locationSelection.action';
import { locationSelection } from '../../../../src/ea/store/locationSelection/locationSelection.reducer';
import { TestUtils } from '../../../test-utils';

describe('locationSelection', () => {
	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			locationSelection: locationSelection
		});
	};

	it('has corrent initial state', () => {
		const store = setup();

		const locationSelection = store.getState().locationSelection;
		expect(locationSelection.tagging).toBe(false);
		expect(locationSelection.position).toBe(null);
	});

	it('sets the tagging mode', () => {
		const store = setup();

		setTaggingMode(true);
		expect(store.getState().locationSelection.tagging).toBe(true);
	});

	it('sets the location', () => {
		const store = setup();

		setLocation([42, 24]);
		expect(store.getState().locationSelection.position).toEqual([42, 24]);
	});
});
