import { HighlightGeometryTypes } from '../../../src/ea/store/fnModuleComm/fnModuleComm.action';

describe('fnModuleCommAction', () => {

	it('exports a enum for HighlightGeometryTypes', () => {
		expect(Object.keys(HighlightGeometryTypes).length).toBe(2);
		expect(HighlightGeometryTypes.GEOJSON).toBe(0);
		expect(HighlightGeometryTypes.WKT).toBe(1);
	});
});