export const provide = (lang) => {
	switch (lang) {
		case 'en':
			return {
				//the first part of the snake_case key should be the name of the related module
				layerManager_title: 'Layers',
				layerManager_change_visibility: 'toggle visibility',
				layerManager_opacity: 'Opacity',
				layerManager_collapse: 'collapse properties',
				layerManager_expand: 'expand properties',
				layerManager_move_up: 'move layer up',
				layerManager_move_down: 'move layer down',
				layerManager_remove: 'remove layer',
				layerManager_to_copy: 'Copy layer',
				layerManager_zoom_to_extent: 'Zoom to extent',
				layerManager_layer_copy: 'copy',
				layerManager_expand_all: 'expand all',
				layerManager_collapse_all: 'collapse all',
				layerManager_remove_all: 'remove all',
				layerManager_deactivate_all: 'deactivate all',
				layerManager_loading_hint: 'Loading',
				layerManager_info: 'Show layer information'
			};

		case 'de':
			return {
				//the first part of the snake_case key should be the name of the related module
				layerManager_title: 'Ausgewählte Karten',
				layerManager_change_visibility: 'Sichtbarkeit umschalten',
				layerManager_opacity: 'Transparenz',
				layerManager_collapse: 'Eigenschaften einklappen',
				layerManager_expand: 'Eigenschaften ausklappen',
				layerManager_move_up: 'Ebene anheben',
				layerManager_move_down: 'Ebene absenken',
				layerManager_remove: 'Ebene entfernen',
				layerManager_to_copy: 'Ebene kopieren',
				layerManager_zoom_to_extent: 'Auf Inhalt zoomen',
				layerManager_layer_copy: 'Kopie',
				layerManager_expand_all: 'Alle ausklappen',
				layerManager_collapse_all: 'Alle einklappen',
				layerManager_remove_all: 'Alle entfernen',
				layerManager_deactivate_all: 'Alle deaktivieren',
				layerManager_loading_hint: 'Wird geladen',
				layerManager_info: 'Ebeneninformation öffnen'
			};

		default:
			return {};
	}
};
