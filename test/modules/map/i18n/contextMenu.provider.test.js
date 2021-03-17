import { provide } from '../../../../src/modules/map/i18n/contextMenu.provider';


describe('i18n for context menue', () => {

	it('provides translation for en', () => {

		const map = provide('en');
		
		expect(map.map_contextMenu_header).toBe('Location');		
		expect(map.map_contextMenu_close_button).toBe('Close');		
		expect(map.map_contextMenuContent_altitude_label).toBe('Altitude');
		expect(map.map_contextMenuContent_copy_icon).toBe('Copy to clipboard');			
	});


	it('provides translation for de', () => {

		const map = provide('de');

		expect(map.map_contextMenu_header).toBe('Position');		
		expect(map.map_contextMenu_close_button).toBe('Schließen');	
		expect(map.map_contextMenuContent_altitude_label).toBe('Höhe');
		expect(map.map_contextMenuContent_copy_icon).toBe('In die Zwischenablage kopieren');		
	});

	it('have the expected amount of translations', () => {
		const expectedSize = 4;
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