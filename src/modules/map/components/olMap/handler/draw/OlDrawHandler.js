import { DRAW_LAYER_ID, DRAW_TOOL_ID } from '../../../../store/DrawPlugin';
import { OlLayerHandler } from '../OlLayerHandler';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { $injector } from '../../../../../../injection';
import { DragPan, Draw, Modify, Select, Snap } from 'ol/interaction';
import { createSketchStyleFunction, getColorFrom, getDrawingTypeFrom, selectStyleFunction } from '../../olStyleUtils';
import { StyleTypes } from '../../services/StyleService';
import { StyleSizeTypes } from '../../../../../../services/domain/styles';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { observe } from '../../../../../../utils/storeUtils';
import { setSelectedStyle, setStyle, setType } from '../../../../store/draw.action';
import { unByKey } from 'ol/Observable';
import { create as createKML, readFeatures } from '../../formats/kml';
import { getModifyOptions, getSelectableFeatures, getSelectOptions, getSnapState, getSnapTolerancePerDevice, InteractionSnapType, InteractionStateType, removeSelectedFeatures } from '../../olInteractionUtils';
import { HelpTooltip } from '../../HelpTooltip';
import { provide as messageProvide } from './tooltipMessage.provider';
import { FileStorageServiceDataTypes } from '../../../../../../services/FileStorageService';
import { VectorGeoResource, VectorSourceType } from '../../../../../../services/domain/geoResources';
import { addLayer, removeLayer } from '../../../../../../store/layers/layers.action';
import { debounced } from '../../../../../../utils/timer';
import { setMode } from '../../../../store/measurement.action';
import { emitNotification } from '../../../../../../store/notifications/notifications.action';
import { LevelTypes } from '../../../../../../store/notifications/notifications.reducer';
import { isEmptyLayer } from '../../olMapUtils';
import { OlSketchHandler } from '../OlSketchHandler';


export const MAX_SELECTION_SIZE = 1;

const Debounce_Delay = 1000;

const Temp_Session_Id = 'temp_measure_id';


const defaultStyleOption = {
	symbolSrc: 'marker', // used by: Symbol
	scale: StyleSizeTypes.MEDIUM, // used by Symbol
	color: '#FF0000', // used by Symbol, Text, Line, Polygon
	text: '' // used by Text
};

/**
 * Handler for draw-interaction with the map
 *
 * @class
 * @author thiloSchlemmer
 */
export class OlDrawHandler extends OlLayerHandler {
	constructor() {
		super(DRAW_LAYER_ID);
		const { TranslationService, MapService, EnvironmentService, StoreService, GeoResourceService, FileStorageService, OverlayService, StyleService, MeasurementStorageService } = $injector.inject('TranslationService', 'MapService', 'EnvironmentService', 'StoreService', 'GeoResourceService', 'FileStorageService', 'OverlayService', 'StyleService', 'MeasurementStorageService');
		this._translationService = TranslationService;
		this._mapService = MapService;
		this._environmentService = EnvironmentService;
		this._storeService = StoreService;
		this._geoResourceService = GeoResourceService;
		this._fileStorageService = FileStorageService;
		this._overlayService = OverlayService;
		this._styleService = StyleService;
		this._storageHandler = MeasurementStorageService;

		this._vectorLayer = null;
		this._draw = null;
		this._modify = null;
		this._snap = null;
		this._select = null;
		this._dragPan = null;


		this._storedContent = null;
		this._sketchHandler = new OlSketchHandler();
		this._listeners = [];

		this._projectionHints = { fromProjection: 'EPSG:' + this._mapService.getSrid(), toProjection: 'EPSG:' + this._mapService.getDefaultGeodeticSrid() };
		this._lastPointerMoveEvent = null;
		this._lastInteractionStateType = null;
		this._drawState = {
			type: null,
			snap: null,
			coordinate: null,
			pointCount: 0,
			dragging: false
		};

		this._helpTooltip = new HelpTooltip();
		this._helpTooltip.messageProvideFunction = messageProvide;
		this._drawStateChangedListeners = [];
		this._registeredObservers = this._register(this._storeService.getStore());
	}

	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {
		const getOldLayer = (map) => {
			return map.getLayers().getArray().find(l => l.get('id') && (
				this._storageHandler.isStorageId(l.get('id')) ||
				l.get('id') === Temp_Session_Id));
		};

		const createLayer = () => {
			const translate = (key) => this._translationService.translate(key);
			const source = new VectorSource({ wrapX: false });
			const layer = new VectorLayer({
				source: source
			});
			layer.label = translate('map_olMap_handler_measure_layer_label');
			return layer;
		};

		const addOldFeatures = async (layer, oldLayer) => {
			if (oldLayer) {

				const vgr = this._geoResourceService.byId(oldLayer.get('id'));
				if (vgr) {

					this._storageHandler.setStorageId(oldLayer.get('id'));
					vgr.getData().then(data => {
						const oldFeatures = readFeatures(data);
						const onFeatureChange = (event) => {
							this._styleService.updateStyle(event.target, olMap);
						};
						oldFeatures.forEach(f => {
							f.getGeometry().transform('EPSG:' + vgr.srid, 'EPSG:' + this._mapService.getSrid());
							f.set('srid', this._mapService.getSrid(), true);
							this._styleService.removeStyle(f, olMap);
							this._styleService.addStyle(f, olMap);
							layer.getSource().addFeature(f);
							f.on('change', onFeatureChange);
						});
					})
						.then(() => removeLayer(oldLayer.get('id')))
						.then(() => this._finish());
				}
			}
		};

		const getOrCreateLayer = () => {
			const oldLayer = getOldLayer(this._map);
			const layer = createLayer();
			addOldFeatures(layer, oldLayer);
			const saveDebounced = debounced(Debounce_Delay, () => this._save());
			this._listeners.push(layer.getSource().on('addfeature', () => this._save()));
			this._listeners.push(layer.getSource().on('changefeature', () => saveDebounced()));
			this._listeners.push(layer.getSource().on('removefeature', () => saveDebounced()));
			return layer;
		};

		const clickHandler = (event) => {
			const coordinate = event.coordinate;
			const dragging = event.dragging;
			const pixel = event.pixel;
			this._updateDrawState(coordinate, pixel, dragging);
			const selectableFeatures = getSelectableFeatures(this._map, this._vectorLayer, pixel);
			if (this._drawState.type === InteractionStateType.MODIFY && selectableFeatures.length === 0 && !this._modifyActivated) {
				this._select.getFeatures().clear();
				setSelectedStyle(null);
				this._setDrawState({ ...this._drawState, type: InteractionStateType.SELECT, snap: null });
			}

			if ([InteractionStateType.MODIFY, InteractionStateType.SELECT].includes(this._drawState.type) && selectableFeatures.length > 0) {
				selectableFeatures.forEach(f => {
					const hasFeature = this._select.getFeatures().getArray().includes(f);
					if (!hasFeature) {
						this._setSelected(f);
					}
				});
			}
			this._modifyActivated = false;
		};

		const pointerMoveHandler = (event) => {
			this._lastPointerMoveEvent = event;

			const coordinate = event.coordinate;
			const dragging = event.dragging;
			const pixel = event.pixel;
			this._updateDrawState(coordinate, pixel, dragging);
		};


		this._map = olMap;
		if (!this._vectorLayer) {
			this._vectorLayer = getOrCreateLayer();
			this._mapContainer = olMap.getTarget();
			const source = this._vectorLayer.getSource();
			this._select = this._createSelect();
			this._modify = this._createModify();
			this._select.setActive(false);
			this._modify.setActive(false);
			this._snap = new Snap({ source: source, pixelTolerance: getSnapTolerancePerDevice() });
			this._dragPan = new DragPan();
			this._dragPan.setActive(false);
			this._onDrawStateChanged((drawState) => this._updateDrawMode(drawState));
			if (!this._environmentService.isTouch()) {
				this._helpTooltip.activate(this._map);
				this._onDrawStateChanged((drawState) => {
					this._helpTooltip.notify(drawState);
					if (drawState.snap === InteractionSnapType.VERTEX) {
						this._mapContainer.classList.add('grab');
					}
					else {
						this._mapContainer.classList.remove('grab');
					}
				});
			}
			this._listeners.push(olMap.on(MapBrowserEventType.CLICK, clickHandler));
			this._listeners.push(olMap.on(MapBrowserEventType.POINTERMOVE, pointerMoveHandler));
			this._listeners.push(olMap.on(MapBrowserEventType.DBLCLICK, () => false));
			this._listeners.push(document.addEventListener('keyup', (e) => this._removeLast(e)));
		}
		this._map.addInteraction(this._select);
		this._map.addInteraction(this._modify);
		this._map.addInteraction(this._snap);
		this._map.addInteraction(this._dragPan);


		const preselectDrawType = this._storeService.getStore().getState().draw.type;
		if (preselectDrawType) {
			this._init(preselectDrawType);
		}

		return this._vectorLayer;
	}


	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	// eslint-disable-next-line no-unused-vars
	onDeactivate(olMap) {
		//use the map to unregister event listener, interactions, etc
		//olLayer currently undefined, will be fixed later
		olMap.removeInteraction(this._modify);
		olMap.removeInteraction(this._snap);
		olMap.removeInteraction(this._select);
		olMap.removeInteraction(this._dragPan);

		if (this._draw) {
			olMap.removeInteraction(this._draw);
		}

		this._helpTooltip.deactivate();

		this._unreg(this._listeners);
		this._unreg(this._registeredObservers);

		this._convertToPermanentLayer();
		this._vectorLayer.getSource().getFeatures().forEach(f => this._overlayService.remove(f, this._map));
		setStyle(null);
		setSelectedStyle(null);
		this._draw = null;
		this._modify = false;
		this._select = false;
		this._snap = false;
		this._dragPan = false;
		this._vectorLayer = null;
		this._map = null;
	}

	_unreg(listeners) {
		unByKey(listeners);
		listeners = [];
	}

	_setDrawState(value) {
		if (value !== this._drawState) {
			this._drawState = value;
			this._drawStateChangedListeners.forEach(l => l(value));
		}
	}

	_onDrawStateChanged(listener) {
		this._drawStateChangedListeners.push(listener);
	}

	_register(store) {
		return [
			observe(store, state => state.draw.type, (type) => this._init(type)),
			observe(store, state => state.draw.style, () => this._updateStyle()),
			observe(store, state => state.draw.finish, () => this._finish()),
			observe(store, state => state.draw.reset, () => this._startNew()),
			observe(store, state => state.draw.remove, () => this._remove())];
	}

	_init(type) {
		const styleOption = this._getStyleOption();

		if (this._draw) {
			this._draw.abortDrawing();
			this._draw.setActive(false);
			this._map.removeInteraction(this._draw);
		}
		this._draw = this._createDrawByType(type, styleOption);
		this._select.getFeatures().clear();

		// we deactivate the modify-interaction only,
		// if the given drawType results in a valid draw-interaction
		// otherwise we must force the modify-interaction to be active
		if (this._modify.getActive() && this._draw) {
			this._modify.setActive(false);
		}
		else if (this._draw == null) {
			this._modify.setActive(true);
		}


		if (this._draw) {

			this._draw.on('drawstart', event => {
				this._sketchHandler.activate(event.feature);
				this._sketchHandler.active.setId(DRAW_TOOL_ID + '_' + type + '_' + new Date().getTime());
				const styleFunction = this._getStyleFunctionByDrawType(type, styleOption);
				const styles = styleFunction(this._sketchHandler.active);
				this._sketchHandler.active.setStyle(styles);
			});
			this._draw.on('drawend', event => {
				this._activateModify(event.feature);
				this._sketchHandler.deactivate();
			});

			this._map.addInteraction(this._draw);
			this._draw.setActive(true);
		}

	}

	_removeLast(event) {
		if ((event.which === 46 || event.keyCode === 46) && !/^(input|textarea)$/i.test(event.target.nodeName)) {
			this._remove();
		}
	}

	_remove() {
		if (this._draw && this._draw.getActive()) {

			this._draw.removeLastPoint();
			if (this._pointCount === 1) {
				this._startNew();
			}
			if (this._lastPointerMoveEvent) {
				this._draw.handleEvent(this._lastPointerMoveEvent);
			}
		}

		if (this._modify && this._modify.getActive()) {
			removeSelectedFeatures(this._select.getFeatures(), this._vectorLayer);
		}
	}

	_finish() {
		if (this._sketchHandler.isActive) {
			this._draw.finishDrawing();
		}
		else {
			this._activateModify(null);
		}
	}

	_startNew() {
		if (this._draw) {
			this._draw.abortDrawing();
			this._select.getFeatures().clear();
			this._modify.setActive(false);
			setSelectedStyle(null);

			const currenType = this._storeService.getStore().getState().draw.type;
			this._init(currenType);
		}

	}

	_createDrawByType(type, styleOption) {
		if (type == null) {
			return null;
		}

		if (this._vectorLayer == null) {
			return null;
		}
		const source = this._vectorLayer.getSource();
		const snapTolerance = getSnapTolerancePerDevice();

		switch (type) {
			case StyleTypes.MARKER:
			case StyleTypes.TEXT:
				return new Draw({
					source: source,
					type: 'Point',
					minPoints: 1,
					snapTolerance: snapTolerance,
					style: this._getStyleFunctionByDrawType(type, styleOption)
				});
			case StyleTypes.LINE:
				return new Draw({
					source: source,
					type: 'LineString',
					snapTolerance: snapTolerance,
					style: createSketchStyleFunction(this._getStyleFunctionByDrawType('line', styleOption))
				});
			case StyleTypes.POLYGON:
				return new Draw({
					source: source,
					type: 'Polygon',
					minPoints: 3,
					snapTolerance: snapTolerance,
					style: createSketchStyleFunction(this._getStyleFunctionByDrawType('polygon', styleOption))
				});
			default:
				console.warn('unknown Drawtype: ' + type);
		}
	}

	_createSelect() {
		const select = new Select(getSelectOptions(this._vectorLayer));
		select.getFeatures().on('add', (e) => {
			const feature = e.element;
			const styleFunction = selectStyleFunction();
			const styles = styleFunction(feature);
			e.element.setStyle(styles);
		});
		select.getFeatures().on('remove', (e) => {
			const feature = e.element;
			const styles = feature.getStyle();
			styles.pop();
			feature.setStyle(styles);
		});

		return select;
	}

	_createModify() {
		const modify = new Modify(getModifyOptions(this._select.getFeatures()));
		modify.on('modifystart', (event) => {
			if (event.mapBrowserEvent.type !== MapBrowserEventType.SINGLECLICK) {
				this._mapContainer.classList.add('grabbing');
			}
		});
		modify.on('modifyend', event => {
			if (event.mapBrowserEvent.type === MapBrowserEventType.POINTERUP || event.mapBrowserEvent.type === MapBrowserEventType.CLICK) {
				this._mapContainer.classList.remove('grabbing');
			}
		});
		return modify;
	}

	_activateModify(feature) {
		if (this._draw) {
			this._draw.setActive(false);
			setType(null);

		}
		this._modify.setActive(true);
		this._modifyActivated = true;

		this._setSelected(feature);
	}

	_getStyleOption() {
		const currentStyleOptions = this._storeService.getStore().getState().draw.style;
		if (currentStyleOptions == null) {
			setStyle(defaultStyleOption);
			return defaultStyleOption;
		}

		return currentStyleOptions;
	}

	_getStyleFunctionFrom(feature) {
		const type = getDrawingTypeFrom(feature);
		return type != null ? this._getStyleFunctionByDrawType(type, this._getStyleOption()) : null;
	}

	_getStyleFunctionByDrawType(drawType, styleOption) {
		const drawTypes = [StyleTypes.MARKER, StyleTypes.TEXT, StyleTypes.LINE, StyleTypes.POLYGON];
		if (drawTypes.includes(drawType)) {
			const styleFunction = this._styleService.getStyleFunction(drawType);
			return () => styleFunction(styleOption);
		}
		return this._styleService.getStyleFunction(StyleTypes.DRAW);
	}

	_updateDrawState(coordinate, pixel, dragging) {
		const pointCount = this._sketchHandler.pointCount;
		const drawState = {
			type: null,
			snap: null,
			coordinate: coordinate,
			pointCount: pointCount
		};

		drawState.snap = getSnapState(this._map, this._vectorLayer, pixel);

		if (this._draw) {
			drawState.type = InteractionStateType.ACTIVE;
			if (this._sketchHandler.isActive) {
				drawState.type = InteractionStateType.DRAW;

				if (this._sketchHandler.isFinishOnFirstPoint) {
					drawState.snap = InteractionSnapType.FIRSTPOINT;
				}
				else if (this._sketchHandler.isSnapOnLastPoint) {
					drawState.snap = InteractionSnapType.LASTPOINT;
				}
			}
		}

		if (this._modify.getActive()) {
			drawState.type = this._select.getFeatures().getLength() === 0 ? InteractionStateType.SELECT : InteractionStateType.MODIFY;
		}

		drawState.dragging = dragging;
		this._setDrawState(drawState);
	}

	_updateDrawMode(drawState) {
		if (this._lastInteractionStateType !== drawState.type && drawState.type !== InteractionStateType.OVERLAY) {
			this._lastInteractionStateType = drawState.type;
			setMode(this._lastInteractionStateType);
		}
	}

	_updateStyle() {
		if (this._drawState.type === InteractionStateType.ACTIVE || this._drawState.type === InteractionStateType.SELECT) {
			const currenType = this._storeService.getStore().getState().draw.type;
			this._init(currenType);
		}

		if (this._drawState.type === InteractionStateType.MODIFY) {
			const feature = this._select.getFeatures().item(0);
			const styleFunction = this._getStyleFunctionFrom(feature);
			const newStyles = styleFunction(feature);

			const currentStyles = feature.getStyle();
			if (currentStyles.length > 1) {
				currentStyles[0] = newStyles[0];
			}
			feature.setStyle(currentStyles);
			setSelectedStyle({ type: getDrawingTypeFrom(feature), style: this._getStyleOption() });
		}

		if (this._drawState.type === InteractionStateType.DRAW) {
			if (this._sketchHandler.isActive) {
				const styleFunction = this._getStyleFunctionFrom(this._sketchHandler.active);
				const newStyles = styleFunction(this._sketchHandler.active);
				this._sketchHandler.active.setStyle(newStyles);
			}
		}

		if (this._drawState.type == null) {
			this._startNew();
		}


	}

	_setSelected(feature) {
		if (feature) {
			const selectionSize = this._select.getFeatures().getLength();
			if (MAX_SELECTION_SIZE <= selectionSize) {
				this._select.getFeatures().clear();
			}
			this._select.getFeatures().push(feature);
			const currentStyleOption = this._getStyleOption();
			const featureColor = getColorFrom(feature);
			const color = featureColor ? featureColor : currentStyleOption.color;
			const style = { ...currentStyleOption, color: color };
			const selectedStyle = { type: getDrawingTypeFrom(feature), style: style };
			setSelectedStyle(selectedStyle);
		}
	}

	/**
	 * todo: redundant with OlMeasurementHandler, possible responsibility of a statefull _storageHandler
	 */
	async _save() {
		const newContent = createKML(this._vectorLayer, 'EPSG:3857');
		this._storageHandler.store(newContent, FileStorageServiceDataTypes.KML);
		this._storedContent = newContent;
	}

	/**
	 *
	 * todo: redundant with OlMeasurementHandler, possible responsibility of a statefull _storageHandler
	 */
	async _convertToPermanentLayer() {
		const translate = (key) => this._translationService.translate(key);
		const label = translate('map_olMap_handler_measure_layer_label');

		if (isEmptyLayer(this._vectorLayer)) {
			console.warn('Cannot store empty layer');
			return;
		}


		if (!this._storageHandler.isValid()) {
			await this._save();
		}

		const createTempIdAndWarn = () => {
			// TODO: offline-support is needed to properly working with temporary ids
			console.warn('Could not store layer-data. The data will get lost after this session.');
			emitNotification(translate('map_olMap_handler_storage_offline'), LevelTypes.WARN);
			return Temp_Session_Id;
		};

		// todo: enable full storage-functionality, after complete implementation of backend-functions to manage and store symbols
		//const id = this._storageHandler.getStorageId() ? this._storageHandler.getStorageId() : createTempIdAndWarn();
		const id = createTempIdAndWarn();

		const getOrCreateVectorGeoResource = () => {
			const fromService = this._geoResourceService.byId(id);
			return fromService ? fromService : new VectorGeoResource(id, label, VectorSourceType.KML);
		};
		const vgr = getOrCreateVectorGeoResource();
		vgr.setSource(this._storedContent, 4326);

		//register georesource
		this._geoResourceService.addOrReplace(vgr);
		//add a layer that displays the georesource in the map
		addLayer(id, { label: label });
	}
}
