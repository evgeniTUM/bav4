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

		let state = [];

		const onActiveLayersChange = async (layers) => {
			const wmsLayers = await Promise.all(
				layers
					.filter(l => l.visible)
					.map(l => this._wmsCapabilitiesService.getWmsLayers(l.geoResourceId)));


			const resolution = store.getState().module.mapResolution;
			state = wmsLayers
				.flat(1)
				.map(l => ({
					...l,
					isDisplayed: resolution > l.maxResolution && resolution < l.minResolution
				}));
		};

		const onResolutionChange = (resolution) => {
			const newState = state
				.map(l => ({
					...l,
					isDisplayed: resolution > l.maxResolution && resolution < l.minResolution
				}));

			const oldDisplayedIds = state.filter(l => l.isDisplayed).map(l => l.title);
			const newNotDisplayedIds = newState.filter(l => !l.isDisplayed).map(l => l.title);

			const delta = newNotDisplayedIds.filter(l => oldDisplayedIds.includes(l));

			const titles = [...new Set(delta)];
			const msg = translate('ea_notification_layer_not_visible');
			titles.forEach(title => emitNotification(`"${title}" ${msg}`, LevelTypes.INFO));

			state = newState;
		};

		observe(store, state => state.layers.active, onActiveLayersChange);
		observe(store, state => state.module.mapResolution, onResolutionChange);
	}
}
