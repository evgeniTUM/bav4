export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				ea_dsgvo_text: 'Das ist ein Text'
			};

		case 'de':
			return {
				ea_dsgvo_text: 'Text'
			};

		default:
			return {};
	}
};
