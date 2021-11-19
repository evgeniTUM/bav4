import { provide } from '../../../../src/modules/layerInfo/i18n/layerInfo.provider';


describe('i18n for layerinfo', () => {

	it('provides translation for en', () => {

		const map = provide('en');

		expect(map.layerinfo_empty_layerInfo).toBe('No information for the layer found');
		expect(map.layerinfo_layerInfo_response_error).toBe('The layer-information could not be loaded');
	});


	it('provides translation for de', () => {

		const map = provide('de');

		expect(map.layerinfo_empty_layerInfo).toBe('Keine Informationen für die Ebene gefunden');
		expect(map.layerinfo_layerInfo_response_error).toBe('Die Ebenen-Information konnte nicht geladen werden');
	});

	it('have the expected amount of translations', () => {
		const expectedSize = 2;
		const deMap = provide('de');
		const enMap = provide('en');

		const actualSize = (o) => Object.keys(o).length;

		expect(actualSize(deMap)).toBe(expectedSize);
		expect(actualSize(enMap)).toBe(expectedSize);
	});

	it('provides an empty map for a unknown lang', () => {

		const map = provide('unknown');

		expect(map).toEqual({});
	});
});
