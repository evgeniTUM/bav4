export const infoPopupProvider = (lang) => {
	switch (lang) {

		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				help_infoPopup_check_label: 'Diese Meldung nicht mehr anzeigen',
				help_infoPopup_notification_close: 'No thanks',
				help_infoPopup_check_title: 'after confirm reading this message won\'t pop up in your browser once more'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				help_infoPopup_check_label: 'Diese Meldung nicht mehr anzeigen',
				help_infoPopup_notification_close: 'Nein danke',
				help_infoPopup_check_title: 'Nach Lesebestätigung wird diese Nachricht nicht noch einmal angezeigt'
			};

		default:
			return {};
	}
};
