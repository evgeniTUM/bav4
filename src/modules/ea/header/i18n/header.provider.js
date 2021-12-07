export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				header_action_button_title : 'um Thementeil',
				ea_header_tab_maps_button: 'Layer',
				header_tab_additional_title : "Zusatzfunktionen für Recherche, Simulation und Analyse",
				header_tab_additional_button : "Analyse"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				header_action_button_title : 'Zum Thementeil',
				ea_header_tab_maps_button: 'Ebenen',
				header_tab_additional_title : "Zusatzfunktionen für Recherche, Simulation und Analyse",
				header_tab_additional_button : "Analyse"
			};

		default:
			return {};
	}
};
