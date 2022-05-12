export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_map_select_region: 'select region'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_map_select_region: 'Gebiet auswählen'
			};

		default:
			return {};
	}
};
