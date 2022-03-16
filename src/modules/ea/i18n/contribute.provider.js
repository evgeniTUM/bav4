export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_contribute_desc: "Description",
				ea_contribute_button_tag: "Tag location",
				ea_contribute_button_select: "Set location",
				ea_contribute_coordinates_text: "Facility coordinates"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_contribute_desc: "Beschreibung",
				ea_contribute_button_tag: "Standort markieren",
				ea_contribute_button_select: "Standort festlegen",
				ea_contribute_coordinates_text: "Koordinaten der Anlage"
			};

		default:
			return {};
	}
};
