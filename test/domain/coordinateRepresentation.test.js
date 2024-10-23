import { BvvCoordinateRepresentations, GlobalCoordinateRepresentations } from '../../src/domain/coordinateRepresentation';

describe('GlobalCoordinateRepresentations', () => {
	it('provides an enum of all available types', () => {
		expect(Object.keys(GlobalCoordinateRepresentations).length).toBe(4);
		expect(GlobalCoordinateRepresentations.WGS84).toEqual({
			key: 'cr_global_wgs84',
			label: 'global_cr_global_wgs84',
			code: 4326,
			digits: 5,
			global: true,
			group: 'wgs84'
		});
		expect(GlobalCoordinateRepresentations.UTM).toEqual({ key: 'cr_global_utm', label: 'UTM', code: null, digits: 0, global: true, group: 'utm' });
		expect(GlobalCoordinateRepresentations.MGRS).toEqual({
			key: 'cr_global_mgrs',
			label: 'MGRS',
			code: null,
			digits: 0,
			global: true,
			group: 'mgrs'
		});
		expect(GlobalCoordinateRepresentations.SphericalMercator).toEqual({
			key: 'cr_global_3857',
			label: '3857',
			code: 3857,
			digits: 6,
			global: true,
			group: 'sm'
		});
	});
});

describe('BvvCoordinateRepresentations', () => {
	it('provides an enum of all available types', () => {
		expect(Object.keys(BvvCoordinateRepresentations).length).toBe(2);
		expect(BvvCoordinateRepresentations.UTM32).toEqual({
			key: 'cr_local_utm32',
			label: 'UTM32',
			code: 25832,
			digits: 0,
			global: false,
			group: 'utm'
		});
		expect(BvvCoordinateRepresentations.UTM33).toEqual({
			key: 'cr_local_utm33',
			label: 'UTM33',
			code: 25833,
			digits: 0,
			global: false,
			group: 'utm'
		});
	});
});
