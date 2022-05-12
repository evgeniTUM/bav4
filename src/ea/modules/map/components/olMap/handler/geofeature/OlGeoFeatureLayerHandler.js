import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import { fromExtent } from 'ol/geom/Polygon';
import { Vector as VectorLayer } from 'ol/layer';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { unByKey } from 'ol/Observable';
import { Vector as VectorSource } from 'ol/source';
import { $injector } from '../../../../../../../injection';
import { OlLayerHandler } from '../../../../../../../modules/map/components/olMap/handler/OlLayerHandler';
import { HelpTooltip } from '../../../../../../../modules/map/components/olMap/HelpTooltip';
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

		this._unsubscribeMapClickObserver = () => { };
		this._listeners = [];
		this._mapClickListener;
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

		return this._vectorLayer;
	}

	/**
	 *  @override
	 */
	onDeactivate() {
		deactivateMapClick();
		this._helpTooltip.deactivate();
		this._map = null;
		this._registeredObservers.forEach(obs => obs.unsubscribe());
		unByKey(this._listeners);

		this._unsubscribeMapClickObserver();
		this._unsubscribeMapClickObserver = () => { };

		if (this._mapClickListener) {
			unByKey(this._mapClickListener);
			this._mapClickListener = null;
		}
		this._vectorLayer = null;
	}

	_toOlFeature(data) {
		const _features = new GeoJSON().readFeature(data);
		_features.getGeometry().transform('EPSG:' + 4326, 'EPSG:' + this._mapService.getSrid());
		_features.set('srid', 4326, true);

		const f = new Feature();
		f.setGeometry(_features.getGeometry());
		f.setStyle(createStyleFnFromJson(data.style));

		return f;
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

			const features = layers.map(l => l.features).flat();
			if (features === undefined || features.length === 0) {
				return;
			}

			this._vectorLayer.getSource().addFeatures(
				features.map(this._toOlFeature, this).filter(olFeature => !!olFeature));

			const polygon = fromExtent(this._vectorLayer.getSource().getExtent());
			polygon.scale(1.2);
			fit(polygon.getExtent());


			this._map.renderSync();
		};

		this._registeredObservers = [
			observe(store, state => state.geofeature, onChange, false),
			observe(store, state => state.mapclick.active, onMapclickActivate, false)
		];
	}
}
