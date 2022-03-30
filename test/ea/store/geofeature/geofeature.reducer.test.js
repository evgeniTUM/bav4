import { geofeatureReducer } from '../../../../src/ea/store/geofeature/geofeature.reducer';
import { addGeoFeatures }  from '../../../../src/ea/store/geofeature/geofeature.action';
import { TestUtils } from '../../../test-utils.js';


describe('geofeatureReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			geofeature: geofeatureReducer
		});
	};

	it('initiales the store with default values', () => {
		const store = setup();
		expect(store.getState().geofeature.features).toHaveSize(0);
	});

	it('display \'geojson\' and \'active\' by adding geofeature', () => {
		const store = setup();

		addGeoFeatures('mixer', window, window.location.origin );
		expect(store.getState().geofeature.active).toBeTrue();
		expect(store.getState().geofeature.features).toHaveSize(0);
		
	});

});
