export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				toolbox_mixer_header : "Mischpult \"Energiemix Bayern vor Ort\"",
				toolbox_analyse3d : "3D-Analyse Windenergieanlagen",
				toolbox_recherche : "Daten-Recherche und Download",
				toolbox_geotherm : "Standortcheck Oberflächennahe Geothermie"
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				toolbox_mixer_header : "Mischpult \"Energiemix Bayern vor Ort\"",
				toolbox_analyse3d : "3D-Analyse Windenergieanlagen",
				toolbox_recherche : "Daten-Recherche und Download",
				toolbox_geotherm : "Standortcheck Oberflächennahe Geothermie"
		};

		default:
			return {};
	}
};
