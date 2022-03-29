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
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import { unByKey } from 'ol/Observable';


/**
 * Handler for displaying independent geojson features
 * @author kun
 */
export class OlGeoFeatureLayerHandler extends OlLayerHandler {

	constructor() {
		super(GEO_FEATURE_LAYER_ID);
		const { StoreService } = $injector.inject('StoreService');
		this._storeService = StoreService;
		this._unregister = () => { };
		this._olMap = null;
		this._vectorLayer = null;

		this._animationListenerKeys = [];
		console.error('OlGeoFeatureLayerHandler was created');
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
		this._registeredObservers = this._register(this._storeService.getStore());
//		this._map.addInteraction(this._select);
//		this._map.addInteraction(this._modify);
//		this._map.addInteraction(this._snap);
//		this._map.addInteraction(this._dragPan);
//
//
//		const preselectDrawType = this._storeService.getStore().getState().draw.type;
//		if (preselectDrawType) {
//			this._init(preselectDrawType);
//		}

		return this._vectorLayer;
	}

	/**
		 *  @override
		 *  @param {Map} olMap
		 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		this._unregister();
		this._olMap = null;
		this._vectorLayer = null;
	}



	_appendStyle(feature, olFeature) {
		const { data } = feature;
		//we have a HighlightCoordinate
		olFeature.setStyle(highlightCoordinateFeatureStyleFunction);
		return olFeature;
	}


	_toOlFeature(feature) {
		const { data } = feature;
		let geojson = data.features[0];
		console.log(geojson);
		
		//we have a HighlightCoordinate
		if (geojson.coordinate) {
			return this._appendStyle(geojson, new Feature(new Point(geojson.coordinate)));
		}

		//we have a GeoFeatureGeometryTypes
		return this._appendStyle(feature, new GeoJSON().readFeature(geojson));
	}


	_register(store) {

		const onChange = ({ features }) => {

			this._vectorLayer.getSource().clear();
console.log('OlGeoFeatureLayerHandler onChange --> features');
			this._vectorLayer.getSource().addFeatures(
				features
					.map(this._toOlFeature, this) );
//					.filter(olFeature => !!olFeature));
		};

		return observe(store, state => state.geofeature, onChange, false);
	}
}
