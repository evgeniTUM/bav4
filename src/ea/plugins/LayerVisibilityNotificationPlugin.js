import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { emitNotification, LevelTypes } from '../../store/notifications/notifications.action';
import { observe } from '../../utils/storeUtils';

export class LayerVisibilityNotificationPlugin extends BaPlugin {

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {

		const { WmsCapabilitiesService, TranslationService } = $injector
			.inject('WmsCapabilitiesService', 'TranslationService');

		const translate = (key) => TranslationService.translate(key);

		this._wmsCapabilitiesService = WmsCapabilitiesService;

		let wmsLayers = [];
		let displayState = [];

		const getDisplayState = (wmsLayers, resolution) => {
			const res = wmsLayers
				.map(entry => ({
					...entry,
					isDisplayed: entry.layers.some(
						l => resolution > l.maxResolution && resolution < l.minResolution
					)
				}));

			return res;
		};

		const onActiveLayersChange = async (layers) => {
			wmsLayers = await Promise.all(
				layers
					.filter(l => l.visible)
					.map(async l => ({
						label: l.label,
						layers: await this._wmsCapabilitiesService.getWmsLayers(l.geoResourceId)
					})));

			const resolution = store.getState().module.mapResolution;
			displayState = getDisplayState(wmsLayers, resolution);
		};

		const onResolutionChange = (resolution) => {
			const newDisplayState = getDisplayState(wmsLayers, resolution);

			const delta = newDisplayState
				.filter(wms => !wms.isDisplayed)
				.filter(wms => {
					const oldWms = displayState.find(w => w.label === wms.label);
					return oldWms && oldWms.isDisplayed;
				});

			const uniqueTitles = [...new Set(delta.map(wms => wms.label))];
			const msg = translate('ea_notification_layer_not_visible');
			uniqueTitles.forEach(title => emitNotification(`"${title}" ${msg}`, LevelTypes.INFO));

			displayState = newDisplayState;
		};

		observe(store, state => state.layers.active, onActiveLayersChange);
		observe(store, state => state.module.mapResolution, onResolutionChange);
	}
}
