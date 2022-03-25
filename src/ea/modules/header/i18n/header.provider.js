export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				header_action_button_title : 'to startpage of Energie-Atlas',
				header_emblem_action_title : 'to site of Bavarian Goverment',
				ea_header_tab_topics_button : "Maps",
				ea_header_tab_topics_title: " Kartenauswahl öffnen",
				ea_header_tab_additional_button : "Analyse",
				ea_header_tab_additional_title : " Datenrecherche, Mischpult, 3D-Analyse Wind und mehr nutzen",
				ea_header_tab_maps_button: "Auswahl",
                                ea_header_tab_maps_title : "Ihre Kartenauswahl und Hintergrundkarte anzeigen",
                                ea_header_tab_more_title: 'Weitere Infos, Links und Hilfe finden'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				header_action_button_title : 'zur Energie-Atlas-Startseite',
				header_emblem_action_title : 'zur Bayerischen Staatsregierung',
				ea_header_tab_topics_button : "Karten",
				ea_header_tab_topics_title: " Kartenauswahl öffnen",
				ea_header_tab_additional_button : "Analyse",
				ea_header_tab_additional_title : " Datenrecherche, Mischpult, 3D-Analyse Wind und mehr nutzen",
				ea_header_tab_maps_button: "Auswahl",
				ea_header_tab_maps_title : "Ihre Kartenauswahl und Hintergrundkarte anzeigen",
				ea_header_tab_more_title: 'Weitere Infos, Links und Hilfe finden'
			};

		default:
			return {};
	}
};
