export const provide = (lang) => {
	switch (lang) {
		case 'en':
			return {
				ea_legend_title: 'Legend'
			};

		case 'de':
			return {
				ea_legend_title: 'Legende'
			};

		default:
			return {};
	}
};
