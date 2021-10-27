export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_menu_analyse3d : "EN -3D-Analyse Windenergieanlagen",
				ea_menu_analyse3d_tooltip : "EN -Hier eine realitätsnahe Darstellung von Windenergieanlagen in der Landschaft erstellen",
				ea_menu_recherche : "EN -Daten-Recherche und Download",
				ea_menu_recherche_tooltip : "EN -Hier Daten durchsuchen und exportieren",
				ea_menu_mixer : "EN -Mischpult \"Energiemix Bayern vor Ort\"",
				ea_menu_mixer_tooltip : "EN -Hier Strom- und Wärmemix, Potenziale und Szenarien einer Kommune abrufen",
				ea_menu_geotherm : "EN -Standortcheck Oberflächennahe Geothermie",
				ea_menu_geotherm_short : "EN -Standortcheck Oberfl. Geothermie",
				ea_menu_geotherm_tooltip : "EN -Hier die Standorteignung für oberflächennahe Geothermie prüfen"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_menu_analyse3d : "3D-Analyse Windenergieanlagen",
				ea_menu_analyse3d_tooltip : "Hier eine realitätsnahe Darstellung von Windenergieanlagen in der Landschaft erstellen",
				ea_menu_recherche : "Daten-Recherche und Download",
				ea_menu_recherche_tooltip : "Hier Daten durchsuchen und exportieren",
				ea_menu_mixer : "Mischpult \"Energiemix Bayern vor Ort\"",
				ea_menu_mixer_tooltip : "Hier Strom- und Wärmemix, Potenziale und Szenarien einer Kommune abrufen",
				ea_menu_geotherm : "Standortcheck Oberflächennahe Geothermie",
				ea_menu_geotherm_short : "Standortcheck Oberfl. Geothermie",
				ea_menu_geotherm_tooltip : "Hier die Standorteignung für oberflächennahe Geothermie prüfen"
			};

		default:
			return {};
	}
};
