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
				ea_contribution_button_tag_title: 'Report',
				ea_contribution_button_tag_text: 'Mark location',
				ea_contribution_button_tag_cancel: 'Cancel',
				ea_contribution_button_send: 'Send',
				ea_contribution_button_find_title: 'Find',
				ea_contribution_button_find_text: 'Go to research tab',
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
				ea_contribution_button_tag_title: 'Melden',
				ea_contribution_button_tag_text: 'Standort markieren',
				ea_contribution_button_tag_cancel: 'Abbrechen',
				ea_contribution_button_send: 'Senden',
				ea_contribution_button_find_title: 'Suchen',
				ea_contribution_button_find_text: 'Wechsel in Daten-Recherche',
				ea_contribution_coordinates_text: 'Koordinaten der Anlage'
			};

		default:
			return {};
	}
};
