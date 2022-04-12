import { OlLayerHandler } from '../../../../../../../modules/map/components/olMap/handler/OlLayerHandler';
import { $injector } from '../../../../../../../injection';
import { observe } from '../../../../../../../utils/storeUtils';
import { GEO_FEATURE_LAYER_ID } from '../../../../../../plugins/GeoFeaturePlugin';
import Feature from 'ol/Feature';
import { createAnimation, highlightAnimatedCoordinateFeatureStyleFunction, highlightCoordinateFeatureStyleFunction, highlightGeometryFeatureStyleFunction, highlightTemporaryCoordinateFeatureStyleFunction, highlightTemporaryGeometryFeatureStyleFunction } from './styleUtils';
import { HighlightFeatureTypes, HighlightGeometryTypes } from '../../../../../../../store/highlight/highlight.action';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Point } from 'ol/geom';
import { GeoFeatureTypes, GeoFeatureGeometryTypes } from '../../../../../../store/geofeature/geofeature.action';
import { deactivateMapClick } from '../../../../../../store/mapclick/mapclick.action';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import { unByKey } from 'ol/Observable';
import MapBrowserEventType from 'ol/MapBrowserEventType';


/**
 * Handler for displaying independent geojson features
 * @author kun
 */
export class OlGeoFeatureLayerHandler extends OlLayerHandler {

	constructor() {
		super(GEO_FEATURE_LAYER_ID, {preventDefaultClickHandling: false, preventDefaultContextClickHandling: false});
		const {StoreService, CoordinateService, MapService} = $injector.inject('StoreService', 'CoordinateService', 'MapService');


		this._storeService = StoreService;
		this.coordinateService = CoordinateService;
		this.mapService = MapService;

		this._positionFeature = new Feature();
		this._unregister = () => {
		};
		this._vectorLayer = null;

		this._unsubscribeMapClickObserver = () => {};
		this._listeners = [];
		this._mapClickListener;


		console.error('OlGeoFeatureLayerHandler was created');
	}

	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {

		const createLayer = () => {

			const source = new VectorSource({wrapX: false, features: [this._positionFeature]});
			const layer = new VectorLayer({
				source: source
			});
			layer.label = 'keine Ahnung';//translate('map_olMap_handler_draw_layer_label');
			return layer;
		};


		const getOrCreateLayer = () => {
//			const oldLayer = getOldLayer(this._map);
			const layer = createLayer();
//			addOldFeatures(layer, oldLayer);
//			const saveDebounced = debounced(Debounce_Delay, () => this._save());
//			const setSelectedAndSave = (event) => {
//				if (this._drawState.type === InteractionStateType.DRAW) {
//					setSelection([event.feature.getId()]);
//				}
//				this._save();
//			};
//			this._listeners.push(layer.getSource().on('addfeature', setSelectedAndSave));
//			this._listeners.push(layer.getSource().on('changefeature', () => saveDebounced()));
//			this._listeners.push(layer.getSource().on('removefeature', () => saveDebounced()));
			return layer;
		};

		this._map = olMap;

		if (!this._vectorLayer) {
			this._vectorLayer = getOrCreateLayer();
//			this._mapContainer = olMap.getTarget();
//			const source = this._vectorLayer.getSource();
//			this._select = this._createSelect();
//			this._modify = this._createModify();
//			this._select.setActive(false);
//			this._modify.setActive(false);
//			this._snap = new Snap({ source: source, pixelTolerance: getSnapTolerancePerDevice() });
//			this._dragPan = new DragPan();
//			this._dragPan.setActive(false);
//			this._onDrawStateChanged((drawState) => this._updateDrawMode(drawState));
//			if (!this._environmentService.isTouch()) {
//				this._helpTooltip.activate(this._map);
//				this._onDrawStateChanged((drawState) => {
//					this._helpTooltip.notify(drawState);
//					if (drawState.snap === InteractionSnapType.VERTEX) {
//						this._mapContainer.classList.add('grab');
//					}
//					else {
//						this._mapContainer.classList.remove('grab');
//					}
//				});
//			}
//			this._listeners.push(olMap.on(MapBrowserEventType.CLICK, clickHandler));
//			this._listeners.push(olMap.on(MapBrowserEventType.POINTERMOVE, pointerMoveHandler));
//			this._listeners.push(olMap.on(MapBrowserEventType.DBLCLICK, () => false));
//			this._listeners.push(document.addEventListener('keyup', (e) => this._removeLast(e)));
		}
		this._unregister = this._register(this._storeService.getStore());
//		this._map.addInteraction(this._select);
//		this._map.addInteraction(this._modify);
//		this._map.addInteraction(this._snap);
//		this._map.addInteraction(this._dragPan);
//

		return this._vectorLayer;
	}

	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		deactivateMapClick();
		this._map = null;
		this._unregister();
		unByKey(this._listeners);
		
		this._unsubscribeMapClickObserver();
		this._unsubscribeMapClickObserver = () => {};
		
		if ( this._mapClickListener ) {
			unByKey(this._mapClickListener);
			this._mapClickListener = null;
		}
		this._vectorLayer = null;
	}

	_updateStyle(olFeature, olLayer, olMap) {
		const {StyleService: styleService} = $injector.inject('StyleService');
		styleService.updateStyle(olFeature, olMap, {
			visible: olLayer.getVisible(),
			top: olMap.getLayers().item(olMap.getLayers().getLength() - 1) === olLayer,
			opacity: olLayer.getOpacity()
		});
	}

	_toOlFeature(feature) {
		console.log('_toOlFeature');
//		console.log(feature);

		let geojson = feature.data.features[0];
		console.log(geojson);
		let _features = new GeoJSON().readFeature(geojson);
		_features.getGeometry().transform('EPSG:' + 4326, 'EPSG:' + this.mapService.getSrid());
		_features.set('srid', 4326, true);
		
		let f = new Feature();
		f.setGeometry(_features.getGeometry());
		return f;
	}

	_register(store) {
		
		const getOldLayer = (map) => {
			return map.getLayers().getArray().find(l => l.get('id') && (
					l.get('id') === GEO_FEATURE_LAYER_ID));
		};




//		this._listeners.push(this._map.on(MapBrowserEventType.CLICK, onClick));

		const onChange = ({ features }) => {

		console.log('OlGeoFeatureLayerHandler onChange --> features');
		console.log(features);

		if ( features == undefined || features.length == 0 ) return;
		
			const {StyleService: styleService} = $injector.inject('StyleService');
			let georesources = features;
			this._vectorLayer.getSource().addFeatures(
			features.map(this._toOlFeature, this).filter(olFeature => !!olFeature));
		
			if (features.length > 0) {
				this._map.renderSync();
		}
		};

		return observe(store, state => state.geofeature, onChange, false);
	}
}
