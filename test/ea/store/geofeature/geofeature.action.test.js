import { GeoFeatureTypes } from '../../../../src/ea/store/geofeature/geofeature.action';

describe('geofeature action', () => {

	it('exports a GeoFeatureTypes enum', () => {
		expect(Object.keys(GeoFeatureTypes).length).toBe(3);
		expect(GeoFeatureTypes.DEFAULT).toBe(0);
		expect(GeoFeatureTypes.TEMPORARY).toBe(1);
		expect(GeoFeatureTypes.ANIMATED).toBe(2);
	});
});
