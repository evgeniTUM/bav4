import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { unByKey } from 'ol/Observable';
import { Vector as VectorSource } from 'ol/source';
import { $injector } from '../../../../../../../injection';
import { highlightCoordinateFeatureStyleFunction } from '../../../../../../../modules/olMap/handler/highlight/styleUtils';
import { OlLayerHandler } from '../../../../../../../modules/olMap/handler/OlLayerHandler';
import { setClick } from '../../../../../../../store/pointer/pointer.action';
import { observe } from '../../../../../../../utils/storeUtils';

export const WMS_ACTIONS_LAYER_ID = 'wms_actions_layer';

/**
 * Handler for displaying independent geojson features
 * @author kun
 */
export class OlWmsActionsLayerHandler extends OlLayerHandler {

	constructor() {
		super(WMS_ACTIONS_LAYER_ID);
		const { StoreService } = $injector
			.inject('StoreService');

		this._storeService = StoreService;
		this._marker = new Feature();
		this._marker.setStyle(highlightCoordinateFeatureStyleFunction);
		this._vectorLayer = null;

		this._registeredObservers = [];

		this._listeners = [];
	}

	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {

		const createLayer = () => {
			const source = new VectorSource({ wrapX: false, features: [this._marker] });
			const layer = new VectorLayer({
				source: source
			});
			layer.label = 'wms-actions';
			return layer;
		};


		const getOrCreateLayer = () => {
			const layer = createLayer();
			return layer;
		};

		this._map = olMap;

		if (!this._vectorLayer) {
			this._vectorLayer = getOrCreateLayer();
		}

		this._listeners.push(this._map.on(MapBrowserEventType.CLICK,
			(event) => setClick({ coordinate: event.coordinate })));

		const store = this._storeService.getStore();
		this._registeredObservers = [
			observe(store, state => state.pointer.click,
				event => this._marker.setGeometry(new Point(event._payload.coordinate)))
		];

		return this._vectorLayer;
	}

	/**
	 *  @override
	 */
	onDeactivate() {
		this._registeredObservers.forEach(unsubscribe => unsubscribe());

		unByKey(this._listeners);

		this._map = null;
		this._vectorLayer = null;
	}

}
