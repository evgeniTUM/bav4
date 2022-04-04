export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_contribute_desc: "Description",
				ea_contribute_button_tag: "Tag location",
				ea_contribute_button_tag_cancel: "Cancel",
				ea_contribute_button_finish: "Finish",
				ea_contribute_coordinates_text: "Facility coordinates"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_contribute_desc: "Beschreibung",
				ea_contribute_button_tag: "Standort markieren",
				ea_contribute_button_tag_cancel: "Abbrechen",
				ea_contribute_button_finish: "Beenden",
				ea_contribute_coordinates_text: "Koordinaten der Anlage"
			};

		default:
			return {};
	}
};
