export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_menu_report: 'Mitmachen und Börsen',
				ea_menu_report_tooltip: 'Hier Korrekturen und neue Objekte melden',
				ea_menu_analyse3d: 'EN -3D-Analyse Windenergieanlagen',
				ea_menu_analyse3d_tooltip: 'EN -Hier eine realitätsnahe Darstellung von Windenergieanlagen in der Landschaft erstellen',
				ea_menu_recherche: 'EN -Daten-Recherche und Download',
				ea_menu_recherche_tooltip: 'EN -Hier Daten durchsuchen und exportieren',
				ea_menu_mixer: 'EN -Mischpult "Energiemix Bayern vor Ort"',
				ea_menu_mixer_tooltip: 'EN -Hier Strom- und Wärmemix, Potenziale und Szenarien einer Kommune abrufen',
				ea_menu_geotherm: 'EN -Standortcheck Oberflächennahe Geothermie',
				ea_menu_geotherm_short: 'EN -Standortcheck Oberfl. Geothermie',
				ea_menu_geotherm_tooltip: 'EN -Hier die Standorteignung für oberflächennahe Geothermie prüfen',
				ea_menu_redesign: 'Mischpult "Redesign"',
				ea_menu_redesign_tooltip: 'Dieses Modul dient zur Entwicklung und Redesign der Zusatzmodule',

				// misc menu
				ea_menu_misc_content_panel_ea: 'Energie-Atlas-Thementeil ',
				ea_menu_misc_content_panel_ea_tooltip: 'Wechsel zum Thementeil mit Infos zu Energiesparen, Energieeffizienz und erneuerbaren Energien'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_menu_boerse: 'Börsen (Abwärme/Solarflächen)',
				ea_menu_boerse_tooltip: 'Abwärmequellen-/senken oder Flächen zur PV-Nutzung melden',
				ea_menu_analyse3d: '3D-Analyse Windenergieanlagen',
				ea_menu_analyse3d_tooltip: 'Realitätsnahe Darstellungen von Windenergieanlagen in der Landschaft erstellen',
				ea_menu_recherche: 'Daten-Recherche und Download',
				ea_menu_recherche_tooltip: 'Daten durchsuchen und exportieren',
				ea_menu_mixer: 'Mischpult "Energiemix Bayern vor Ort"',
				ea_menu_mixer_tooltip: 'Energiemix, Potenziale und Szenarien einer Kommune abrufen',
				ea_menu_geotherm: 'Standortcheck Oberflächennahe Geothermie',
				ea_menu_geotherm_short: 'Standortcheck Oberfl. Geothermie',
				ea_menu_geotherm_tooltip: ' Standorteignung für oberflächennahe Geothermie prüfen',
				ea_menu_redesign: 'Mischpult "Redesign"',
				ea_menu_redesign_tooltip: 'Modul für Redesign der Zusatzmodule',

				//misc menu
				ea_menu_misc_content_panel_moreinfo: 'Weitere Informationen',
				ea_menu_misc_content_panel_aboutus: 'Über uns',
				ea_menu_misc_content_panel_legal: 'Rechtliches',
				ea_menu_misc_content_panel_links: 'Links',
				ea_menu_misc_content_panel_ea: 'Energie-Atlas-Thementeil',
				ea_menu_misc_content_panel_ea_tooltip: 'Wechsel zum Thementeil mit Infos zu Energiesparen, Energieeffizienz und erneuerbaren Energien',
				ea_menu_misc_content_panel_help: 'Hilfe',
				ea_menu_misc_content_panel_help_tooltip: 'zur Hilfe des Kartenteils',
				ea_menu_misc_content_panel_newsletter: 'Newsletter',
				ea_menu_misc_content_panel_newsletter_tooltip: 'zur Bestellung unseres Newsletters',
				ea_menu_misc_content_panel_contact: 'Kontakt',
				ea_menu_misc_content_panel_contact_tooltip: 'zum Energie-Atlas Bayern-Team Kontakt aufnehmen',
				ea_menu_misc_content_panel_imprint: 'Impressum',
				ea_menu_misc_content_panel_imprint_tooltip: 'zum Impressum',
				ea_menu_misc_content_panel_privacy_policy: 'Datenschutz',
				ea_menu_misc_content_panel_privacy_policy_tooltip: 'zur Seite Datenschutz',
				ea_menu_misc_content_panel_terms_of_use: 'Nutzungsbedingungen',
				ea_menu_misc_content_panel_terms_of_use_tooltip: 'zur Seite Nutzungsbedingungen',
				ea_menu_misc_content_panel_change_font: 'Schriftgröße ändern',
				ea_menu_misc_content_panel_change_font_tooltip: 'zur Seite Informationen zur Schriftgröße',
				ea_menu_misc_content_panel_ba_header: 'BayernAtlas',
				ea_menu_misc_content_panel_ba_text: 'Der BayernAtlas ist der Kartenviewer des Freistaates Bayern.'
			};

		default:
			return {};
	}
};
