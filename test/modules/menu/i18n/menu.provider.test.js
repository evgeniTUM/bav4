import { provide } from '../../../../src/modules/menu/i18n/menu.provider';


describe('i18n for menu module', () => {

	it('provides translation for de', () => {

		const map = provide('de');

		expect(map.menu_main_open_button).toBe('Menü öffnen');
		expect(map.misc_content_panel_settings).toBe('Einstellungen');
		expect(map.misc_content_panel_dark_mode).toBe('Dark mode');
		expect(map.misc_content_panel_fullscreen).toBe('Vollbild');
		expect(map.misc_content_panel_language).toBe('Sprache');
		expect(map.misc_content_panel_information).toBe('Information');
		expect(map.misc_content_panel_help).toBe('Hilfe');
		expect(map.misc_content_panel_Contact).toBe('Kontakt');
		expect(map.misc_content_panel_github).toBe('GitHub');
		expect(map.misc_content_panel_terms_of_use).toBe('Nutzungsbedingungen');
		expect(map.misc_content_panel_privacy_policy).toBe('Datenschutzerklärung');
		expect(map.misc_content_panel_imprint).toBe('Impressum');
		expect(map.misc_content_panel_more_links).toBe('weitere Links');
		expect(map.misc_content_panel_gdo_header).toBe('Geodaten Online');
		expect(map.misc_content_panel_gdo_text).toBe('Online digitale Daten bestellen und sofort downloaden');
		expect(map.misc_content_panel_gp_header).toBe('Geoportal Bayern');
		expect(map.misc_content_panel_gp_text).toBe('Zentraler Zugang zu Geodaten und Geodatendiensten');
	});

	it('provides translation for en', () => {

		const map = provide('en');

		expect(map.menu_main_open_button).toBe('Open Menu');
		expect(map.misc_content_panel_settings).toBe('Settings');
		expect(map.misc_content_panel_dark_mode).toBe('Dark mode');
		expect(map.misc_content_panel_fullscreen).toBe('Fullscreen');
		expect(map.misc_content_panel_language).toBe('Language');
		expect(map.misc_content_panel_information).toBe('Information');
		expect(map.misc_content_panel_help).toBe('Help');
		expect(map.misc_content_panel_Contact).toBe('Contact');
		expect(map.misc_content_panel_github).toBe('GitHub');
		expect(map.misc_content_panel_terms_of_use).toBe('Terms of Use');
		expect(map.misc_content_panel_privacy_policy).toBe('Privacy Policy');
		expect(map.misc_content_panel_imprint).toBe('Imprint');
		expect(map.misc_content_panel_more_links).toBe('more Links');
		expect(map.misc_content_panel_gdo_header).toBe('Geodaten Online');
		expect(map.misc_content_panel_gdo_text).toBe('Online digitale Daten bestellen und sofort downloaden');
		expect(map.misc_content_panel_gp_header).toBe('Geoportal Bayern');
		expect(map.misc_content_panel_gp_text).toBe('Zentraler Zugang zu Geodaten und Geodatendiensten');

	});

	it('have the expected amount of translations', () => {
		const expectedSize = 17;
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
