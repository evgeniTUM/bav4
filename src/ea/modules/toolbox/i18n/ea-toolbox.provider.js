export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				toolbox_mixer_header: 'Mischpult "Energiemix Bayern vor Ort"',
				toolbox_analyse3d: '3D-Analyse Windenergieanlagen',
				toolbox_recherche_header: 'Daten-Recherche und Download',
				toolbox_geotherm: 'Standortcheck Oberflächennahe Geothermie',
				module_prevent_switching_tool: 'Please close the current tool first',
				toolbox_redesign_header: 'Mischpult "Redesign"',

				ea_contribution_additional_input: 'Additional text',
				ea_contribution_button_tag: 'Tag location',
				ea_contribution_button_tag_cancel: 'Cancel',
				ea_contribution_button_finish: 'Finish',
				ea_contribution_button_find: 'Find',
				ea_contribution_coordinates_text: 'Facility coordinates'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				toolbox_mixer_header: 'Mischpult "Energiemix Bayern vor Ort"',
				toolbox_analyse3d: '3D-Analyse Windenergieanlagen',
				toolbox_recherche_header: 'Daten-Recherche und Download',
				toolbox_geotherm: 'Standortcheck Oberflächennahe Geothermie',
				module_prevent_switching_tool: 'Module Bitte zuerst das aktuelle Werkzeug schließen/beenden',
				toolbox_redesign_header: 'Mischpult "Redesign"',

				ea_contribution_additional_input: 'Zusätzlicher Text',
				ea_contribution_button_tag: 'Standort markieren',
				ea_contribution_button_tag_cancel: 'Abbrechen',
				ea_contribution_button_finish: 'Beenden',
				ea_contribution_button_find: 'Finden',
				ea_contribution_coordinates_text: 'Koordinaten der Anlage'
			};

		default:
			return {};
	}
};
