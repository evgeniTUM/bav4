export const provide = (lang) => {
	switch (lang) {
		case 'en':
			return {
				ea_notification_layer_not_visible: 'is not available for this zoom level',
				ea_mainmenu_layer_not_visible: 'This map is not available for this zoom level',
				ea_notification_coordinates_outside_bavaria: 'The selected position is outside of Bavaria.'
			};

		case 'de':
			return {
				ea_notification_layer_not_visible: 'ist in der aktuellen Zoomstufe nicht verfügbar',
				ea_mainmenu_layer_not_visible: 'Diese Karte ist in der aktuellen Zoomstufe nicht verfügbar',
				ea_notification_coordinates_outside_bavaria: 'Die ausgewählte Position liegt außerhalb von Bayern.'
			};

		default:
			return {};
	}
};
