export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				header_action_button_title : 'to startpage of Energie-Atlas',
				ea_header_tab_maps_button: 'layers',
				header_tab_additional_title : "additional functions for research, simulation and analysis",
				header_tab_additional_button : "analysis"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				header_action_button_title : 'zur Energie-Atlas-Startseite',
				ea_header_tab_maps_button: 'Ebenen',
				header_tab_additional_title : "Zusatzfunktionen für Recherche, Simulation und Analyse",
				header_tab_additional_button : "Analyse"
			};

		default:
			return {};
	}
};
