import { $injector } from '../../../../../../../../src/injection';
import { EaMiscContentPanel } from '../../../../../../../../src/ea/modules/menu/components/mainMenu/content/misc/EaMiscContentPanel';
import { AbstractMvuContentPanel } from '../../../../../../../../src/modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { ThemeToggle } from '../../../../../../../../src/modules/uiTheme/components/toggle/ThemeToggle';
import { TestUtils } from '../../../../../../../test-utils';

window.customElements.define(EaMiscContentPanel.tag, EaMiscContentPanel);

describe('EaMiscContentPanel', () => {
	const setup = () => {
		TestUtils.setupStoreAndDi();
		$injector.registerSingleton('TranslationService', { translate: (key) => key });
		return TestUtils.render(EaMiscContentPanel.tag);
	};

	describe('class', () => {
		it('inherits from AbstractContentPanel', async () => {
			const element = await setup();

			expect(element instanceof AbstractMvuContentPanel).toBeTrue();
		});

		it('has the tag "ea-misc-content-panel"', async () => {
			expect(EaMiscContentPanel.tag).toEqual('ea-misc-content-panel');
		});
	});

	describe('when initialized', () => {
		it('renders the view', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelectorAll(ThemeToggle.tag)).toHaveSize(0);
		});

		it('checks the list ', async () => {
			const element = await setup();
			expect(element.shadowRoot.querySelectorAll('collapsable-content').length).toBe(5);
			expect(element.shadowRoot.querySelectorAll('a').length).toBe(11);
			expect(element.shadowRoot.querySelectorAll('[href]').length).toBe(11);
		});

		it('checks all links', async () => {
			const element = await setup();

			const links = element.shadowRoot.querySelectorAll('a');

			expect(links[0].href).toEqual('https://www.energieatlas.bayern.de/');
			expect(links[0].target).toEqual('_blank');
			expect(links[0].title).toEqual('ea_menu_misc_content_panel_ea_tooltip');
			expect(links[0].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_ea');

			expect(links[1].href).toEqual('https://www.energieatlas.bayern.de/hilfe/karten');
			expect(links[1].target).toEqual('_blank');
			expect(links[1].title).toEqual('ea_menu_misc_content_panel_help_tooltip');
			expect(links[1].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_help');

			expect(links[2].href).toEqual('https://www.lfu.bayern.de/publikationen/newsletter/eab_nl_anmeldung/anmeldung.htm');
			expect(links[2].target).toEqual('_blank');
			expect(links[2].title).toEqual('ea_menu_misc_content_panel_newsletter_tooltip');
			expect(links[2].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_newsletter');

			expect(links[3].href).toEqual('https://www.energieatlas.bayern.de/service/kontakt.html');
			expect(links[3].target).toEqual('_blank');
			expect(links[3].title).toEqual('ea_menu_misc_content_panel_contact_tooltip');
			expect(links[3].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_contact');

			expect(links[4].href).toEqual('https://www.energieatlas.bayern.de/service/impressum.html');
			expect(links[4].target).toEqual('_blank');
			expect(links[4].title).toEqual('ea_menu_misc_content_panel_imprint_tooltip');
			expect(links[4].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_imprint');

			expect(links[5].href).toEqual('https://www.energieatlas.bayern.de/service/datenschutz.html');
			expect(links[5].target).toEqual('_blank');
			expect(links[5].title).toEqual('ea_menu_misc_content_panel_privacy_policy_tooltip');
			expect(links[5].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_privacy_policy');

			expect(links[6].href).toEqual('https://www.energieatlas.bayern.de/hilfe/karten/HilfeTech/HilfeNutzung');
			expect(links[6].target).toEqual('_blank');
			expect(links[6].title).toEqual('ea_menu_misc_content_panel_terms_of_use_tooltip');
			expect(links[6].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_terms_of_use');

			expect(links[7].href).toEqual('https://www.energieatlas.bayern.de/infos_schriftgroesse');
			expect(links[7].target).toEqual('_blank');
			expect(links[7].title).toEqual('ea_menu_misc_content_panel_change_font_tooltip');
			expect(links[7].querySelector('.ba-list-item__text').innerText).toEqual('ea_menu_misc_content_panel_change_font');

			expect(links[8].href).toEqual('https://geoportal.bayern.de/bayernatlas/?lang=de&topic=ba&bgLayer=atkis');
			expect(links[8].target).toEqual('_blank');
			expect(links[8].querySelector('.ba-list-item__primary-text').innerText).toEqual('ea_menu_misc_content_panel_ba_header');
			expect(links[8].querySelector('.ba-list-item__secondary-text').innerText).toEqual('ea_menu_misc_content_panel_ba_text');

			expect(links[9].href).toEqual('https://geodatenonline.bayern.de/geodatenonline');
			expect(links[9].target).toEqual('_blank');
			expect(links[9].querySelector('.ba-list-item__primary-text').innerText).toEqual('menu_misc_content_panel_gdo_header');
			expect(links[9].querySelector('.ba-list-item__secondary-text').innerText).toEqual('menu_misc_content_panel_gdo_text');

			expect(links[10].href).toEqual('https://www.geoportal.bayern.de/geoportalbayern');
			expect(links[10].target).toEqual('_blank');
			expect(links[10].querySelector('.ba-list-item__primary-text').innerText).toEqual('menu_misc_content_panel_gp_header');
			expect(links[10].querySelector('.ba-list-item__secondary-text').innerText).toEqual('menu_misc_content_panel_gp_text');
		});
		it('collapses all sections init', async () => {
			const element = await setup();

			const sections = element.shadowRoot.querySelectorAll('.collapse-content');
			sections.forEach((section) => {
				expect(section.classList).toContain('iscollapse');
			});
		});
	});
});
