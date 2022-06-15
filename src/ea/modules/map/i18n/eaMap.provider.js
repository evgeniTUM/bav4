export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_map_select_region: 'select region',
				map_legendButton_title_activate: 'activate legend',
				map_legendButton_title_deactivate: 'deactivate legend'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				ea_map_select_region: 'Gebiet auswählen',
				map_legendButton_title_activate: 'Legende aktivieren',
				map_legendButton_title_deactivate: 'Legende deaktivieren'
			};

		default:
			return {};
	}
};
