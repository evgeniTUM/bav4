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

				ea_contribution_additional_input: 'Zusätzlicher Text',
				ea_contribution_button_tag_title: 'Neumeldung',
				ea_contribution_button_tag_subtext: 'Standort markieren',
				ea_contribution_button_tag_subtext_tagging: 'Bitte in die Karte klicken.',
				ea_contribution_button_tag_tooltip:
					'Nach Klick auf "Melden" markieren Sie bitte einen Standort in der Karte. Die Koordinaten werden automatisch übernommen.',
				ea_contribution_button_tag_cancel: 'Abbrechen',
				ea_contribution_button_correction_title: 'Korrektur',
				ea_contribution_button_correction_tooltip:
					'Nach Klick auf "Korrektur" markieren Sie bitte einen Standort in der Karte. Die Koordinaten werden automatisch übernommen.',
				ea_contribution_button_send: 'Senden',
				ea_contribution_button_back: 'Zurück',
				ea_contribution_button_find_title: 'Suchen',
				ea_contribution_button_find_text: 'Wechsel in Daten-Recherche',
				ea_contribution_button_find_tooltip:
					'Nach Klick auf "Suchen" öffnet sich die Daten-Recherche, in der Sie nach bestehenden Börseneinträgen (Abwärmequellen/-senken und Dach-/Freiflächen zur PV-Nutzung) recherchieren können.',
				ea_contribution_coordinates_text: 'Koordinaten des Standorts',
				ea_contribution_coordinates_tooltip_1: 'Bitte klicken Sie auf "Neumeldung" oder "Korrektur" und markieren dann einen Standort.',
				ea_contribution_coordinates_tooltip_2: 'Bitte klicken Sie in die Karte.',
				ea_contribution_coordinates_placeholder: 'Bitte klicken Sie in die Karte'
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
				ea_contribution_button_tag_title: 'Neumeldung',
				ea_contribution_button_tag_subtext: 'Standort markieren',
				ea_contribution_button_tag_subtext_tagging: 'Bitte in die Karte klicken.',
				ea_contribution_button_tag_tooltip:
					'Nach Klick auf "Neumeldung" markieren Sie bitte einen Standort in der Karte. Die Koordinaten werden automatisch übernommen.',
				ea_contribution_button_tag_cancel: 'Abbrechen',
				ea_contribution_button_correction_title: 'Korrektur',
				ea_contribution_button_correction_tooltip:
					'Nach Klick auf "Korrektur" markieren Sie bitte einen Standort in der Karte. Die Koordinaten werden automatisch übernommen.',
				ea_contribution_button_send: 'Senden',
				ea_contribution_button_back: 'Zurück',
				ea_contribution_button_find_title: 'Suchen',
				ea_contribution_button_find_text: 'Wechsel in Daten-Recherche',
				ea_contribution_button_find_tooltip:
					'Nach Klick auf "Suchen" öffnet sich die Daten-Recherche, in der Sie nach bestehenden Börseneinträgen (Abwärmequellen/-senken und Dach-/Freiflächen zur PV-Nutzung) recherchieren können.',
				ea_contribution_coordinates_text: 'Koordinaten des Standorts',
				ea_contribution_coordinates_tooltip_1: 'Bitte klicken Sie auf "Neumeldung" oder "Korrektur" und markieren dann einen Standort.',
				ea_contribution_coordinates_tooltip_2: 'Bitte klicken Sie in die Karte.',
				ea_contribution_coordinates_placeholder: 'Bitte klicken Sie in die Karte'
			};

		default:
			return {};
	}
};
