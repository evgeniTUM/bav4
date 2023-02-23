export const provide = (lang) => {
	switch (lang) {
		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_zoomButtons_in: 'Zoom in',
				map_zoomButtons_out: 'Zoom out',
				map_zoomButtons_extent: 'Zoom to full extent'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				map_zoomButtons_in: 'aus Zoomstufe {zoom} hineinzoomen',
				map_zoomButtons_out: 'aus Zoomstufe {zoom} herauszoomen',
				map_zoomButtons_extent: 'Ganz Bayern anzeigen'
			};

		default:
			return {};
	}
};
