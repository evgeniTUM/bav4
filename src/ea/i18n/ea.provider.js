export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				ea_notification_layer_not_visible: ' cannot be shown in this resolution.'
			};

		case 'de':
			return {
				ea_notification_layer_not_visible: ' ist in dieser Kartenauflösung nicht darstellbar.'
			};

		default:
			return {};
	}
};
