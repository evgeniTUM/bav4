import Feature from 'ol/Feature';
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
import { deactivateMapClick, requestMapClick, setMapCursorStyle } from '../../../../../../store/mapclick/mapclick.action';
import { createStyleFnFromJson } from './styleUtils';

export const GEO_FEATURE_LAYER_ID = 'geofeature_layer';

/**
 * Handler for displaying independent geojson features
 * @author kun
 */
export class OlGeoFeatureLayerHandler extends OlLayerHandler {

	constructor() {
		super(GEO_FEATURE_LAYER_ID);
		const { StoreService, CoordinateService, MapService, TranslationService } = $injector
			.inject('StoreService', 'CoordinateService', 'MapService', 'TranslationService');

		this._translationService = TranslationService;
		this._storeService = StoreService;
		this._coordinateService = CoordinateService;
		this._mapService = MapService;
		this._helpTooltip = new HelpTooltip();
		this._positionFeature = new Feature();
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

			const source = new VectorSource({ wrapX: false, features: [this._positionFeature] });
			const layer = new VectorLayer({
				source: source
			});
			layer.label = 'keine Ahnung';//translate('map_olMap_handler_draw_layer_label');
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

		this._registeredObservers.forEach(unsubscribe => unsubscribe());

		unByKey(this._listeners);

		this._map = null;
		this._vectorLayer = null;
	}


	_setup(store) {

		this._listeners.push(this._map.on(MapBrowserEventType.CLICK, (event) => requestMapClick(event.coordinate)));

		const message = this._translationService.translate('ea_map_select_region');
		this._helpTooltip.messageProvideFunction = () => message;
		this._listeners.push(this._map.on(MapBrowserEventType.POINTERMOVE, (event) => this._helpTooltip.notify(event)));

		const onMapclickActivate = (active) => {
			if (active) {
				this._helpTooltip.activate(this._map);
				setMapCursorStyle('crosshair');
			}
			else {
				this._helpTooltip.deactivate();
				setMapCursorStyle('auto');
			}
		};

		const onChange = ({ layers }) => {
			this._vectorLayer.getSource().clear();

			const toOlFeature = (data, draggable) => {
				const _features = new GeoJSON().readFeature(data);
				_features.getGeometry().transform('EPSG:' + 4326, 'EPSG:' + this._mapService.getSrid());
				_features.set('srid', 4326, true);

				const f = new Feature();
				f.setGeometry(_features.getGeometry());
				f.setStyle(createStyleFnFromJson(data.style));
				f.draggable = draggable;

				return f;
			};

			const olFeatures = layers.map(l => l.features.map(f => toOlFeature(f, l.draggable)))
				.flat();

			if (olFeatures.length === 0) {
				return;
			}

			this._vectorLayer.getSource().addFeatures(olFeatures);

			const polygon = fromExtent(this._vectorLayer.getSource().getExtent());
			polygon.scale(1.2);
			fit(polygon.getExtent());

			this._map.renderSync();
		};

		this._registeredObservers = [
			observe(store, state => state.geofeature, onChange),
			observe(store, state => state.mapclick.active, onMapclickActivate)
		];
	}
}
