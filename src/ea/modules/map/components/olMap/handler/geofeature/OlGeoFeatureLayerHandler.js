import GeoJSON from 'ol/format/GeoJSON';
import { fromExtent } from 'ol/geom/Polygon';
import { Translate } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { unByKey } from 'ol/Observable';
import { Vector as VectorSource } from 'ol/source';
import { $injector } from '../../../../../../../injection';
import { OlLayerHandler } from '../../../../../../../modules/olMap/handler/OlLayerHandler';
import { HelpTooltip } from '../../../../../../../modules/olMap/tooltip/HelpTooltip';
import { fit } from '../../../../../../../store/position/position.action';
import { observe } from '../../../../../../../utils/storeUtils';
import { deactivateMapClick, requestMapClick } from '../../../../../../store/mapclick/mapclick.action';
import { createStyleFnFromJson } from './styleUtils';
import { setMapCursorStyle } from '../../../../../../store/module/ea.action';

export const GEO_FEATURE_LAYER_ID = 'geofeature_layer';

/**
 * Handler for displaying independent geojson features
 * @author kun
 */
export class OlGeoFeatureLayerHandler extends OlLayerHandler {
	constructor() {
		super(GEO_FEATURE_LAYER_ID, { preventDefaultClickHandling: false, preventDefaultContextClickHandling: false });
		const { StoreService, CoordinateService, MapService, TranslationService } = $injector.inject(
			'StoreService',
			'CoordinateService',
			'MapService',
			'TranslationService'
		);

		this._translationService = TranslationService;
		this._storeService = StoreService;
		this._coordinateService = CoordinateService;
		this._mapService = MapService;
		this._helpTooltip = new HelpTooltip();
		this._vectorLayer = null;

		this._registeredObservers = [];

		this._listeners = [];

		this._translateInteraction = new Translate({
			filter: (feature) => feature.draggable
		});
	}

	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {
		const createLayer = () => {
			const source = new VectorSource({ wrapX: false });
			const layer = new VectorLayer({
				source: source
			});
			layer.label = 'geofeatures-layer';
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

		this._setup(this._storeService.getStore());

		olMap.addInteraction(this._translateInteraction);

		return this._vectorLayer;
	}

	/**
	 *  @override
	 */
	onDeactivate(olMap) {
		olMap.removeInteraction(this._translateInteraction);

		deactivateMapClick();
		this._helpTooltip.deactivate();

		this._registeredObservers.forEach((unsubscribe) => unsubscribe());

		unByKey(this._listeners);

		this._map = null;
		this._vectorLayer = null;
	}

	_setup(store) {
		const onMapClick = (event) => {
			const state = store.getState();

			if (state.mapclick.active) {
				requestMapClick(event.coordinate);
			}
		};

		this._listeners.push(this._map.on(MapBrowserEventType.CLICK, onMapClick));

		const message = this._translationService.translate('ea_map_select_region');
		this._helpTooltip.messageProvideFunction = () => message;
		this._listeners.push(this._map.on(MapBrowserEventType.POINTERMOVE, (event) => this._helpTooltip.notify(event)));

		const onMapclickActivate = (active) => {
			if (active) {
				this._helpTooltip.activate(this._map);
				setMapCursorStyle('crosshair');
				this._options.preventDefaultClickHandling = true;
				this._options.preventDefaultContextClickHandling = true;
			} else {
				this._helpTooltip.deactivate();
				setMapCursorStyle('auto');
				this._options.preventDefaultClickHandling = false;
				this._options.preventDefaultContextClickHandling = false;
			}
		};

		const onChange = ({ layers }) => {
			const toOlFeature = (data, draggable) => {
				const feature = new GeoJSON().readFeature(data);
				feature.getGeometry().transform('EPSG:' + 4326, 'EPSG:' + this._mapService.getSrid());
				feature.set('srid', 4326, true);

				feature.setStyle(createStyleFnFromJson(data.style));
				feature.draggable = draggable;
				feature.expandTo = data.expandTo;

				return feature;
			};

			const zoomToLayer = (layer) => {
				const extentFeatures = layer
					.getSource()
					.getFeatures()
					.filter((f) => f.expandTo);
				if (extentFeatures.length === 0) {
					return;
				}

				const extentVector = new VectorSource();
				extentVector.addFeatures(extentFeatures);

				const polygon = fromExtent(extentVector.getExtent());
				polygon.scale(1.2);
				fit(polygon.getExtent());
			};

			this._vectorLayer.getSource().clear();

			const olFeatures = layers.map((l) => l.features.map((f) => toOlFeature(f, l.draggable))).flat();

			if (olFeatures.length === 0) {
				return;
			}

			this._vectorLayer.getSource().addFeatures(olFeatures);

			zoomToLayer(this._vectorLayer);
		};

		this._registeredObservers = [
			observe(store, (state) => state.geofeature, onChange),
			observe(store, (state) => state.mapclick.active, onMapclickActivate)
		];
	}
}
