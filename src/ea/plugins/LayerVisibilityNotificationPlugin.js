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

		const { WmsCapabilitiesService, MapService, TranslationService } = $injector
			.inject('WmsCapabilitiesService', 'MapService', 'TranslationService');

		const translate = (key) => TranslationService.translate(key);

		this._wmsCapabilitiesService = WmsCapabilitiesService;
		this._mapService = MapService;

		let state = [];

		const onActiveLayersChange = async (layers) => {
			const wmsLayers = await Promise.all(
				layers
					.filter(l => l.visible)
					.map(l => this._wmsCapabilitiesService.getWmsLayers(l.geoResourceId)));


			const zoom = store.getState().position.zoom;
			const center = store.getState().position.center;
			const resolution = this._mapService.calcResolution(zoom, center);
			state = wmsLayers
				.flat(1)
				.map(l => ({
					...l,
					isDisplayed: resolution > l.maxResolution && resolution < l.minResolution
				}));


		};

		const onZoomChange = (zoom) => {
			const center = store.getState().position.center;
			const resolution = this._mapService.calcResolution(zoom, center);

			const newState = state
				.map(l => ({
					...l,
					isDisplayed: resolution > l.maxResolution && resolution < l.minResolution
				}));

			const oldDisplayedIds = state.filter(l => l.isDisplayed).map(l => l.title);
			const newNotDisplayedIds = newState.filter(l => !l.isDisplayed).map(l => l.title);

			const delta = newNotDisplayedIds.filter(l => oldDisplayedIds.includes(l));

			const msg = translate('ea_notification_layer_not_visible');
			delta.forEach(title => emitNotification(title + msg, LevelTypes.INFO));

			state = newState;
		};

		observe(store, state => state.layers.active, onActiveLayersChange);
		observe(store, state => state.position.zoom, onZoomChange);
	}
}
