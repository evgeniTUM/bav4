import { DRAW_LAYER_ID, DRAW_TOOL_ID } from '../../../../store/DrawPlugin';
import { OlLayerHandler } from '../OlLayerHandler';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { $injector } from '../../../../../../injection';
import { DragPan, Draw, Modify, Select, Snap } from 'ol/interaction';
import { modifyStyleFunction, createSketchStyleFunction, createSelectStyleFunction } from '../../olStyleUtils';
import { StyleTypes } from '../../services/StyleService';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { observe } from '../../../../../../utils/storeUtils';

/**
 * Handler for draw-interaction with the map
 *
 * @class
 * @author thiloSchlemmer
 */
export class OlDrawHandler extends OlLayerHandler {
	constructor() {
		super(DRAW_LAYER_ID);
		const { TranslationService, MapService, EnvironmentService, StoreService, GeoResourceService, FileStorageService, OverlayService, StyleService } = $injector.inject('TranslationService', 'MapService', 'EnvironmentService', 'StoreService', 'GeoResourceService', 'FileStorageService', 'OverlayService', 'StyleService');
		this._translationService = TranslationService;
		this._mapService = MapService;
		this._environmentService = EnvironmentService;
		this._storeService = StoreService;
		this._geoResourceService = GeoResourceService;
		this._fileStorageService = FileStorageService;
		this._overlayService = OverlayService;
		this._styleService = StyleService;

		this._vectorLayer = null;
		this._drawType = null;
		this._draw = null;
		this._modify = null;
		this._snap = null;
		this._select = null;
		this._dragPan = null;
		this._activeSketch = null;
		this._registeredObservers = this._register(this._storeService.getStore());
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
			return layer;
		};
		if (!this._vectorLayer) {
			this._map = olMap;
			this._vectorLayer = createLayer();
			this._mapContainer = olMap.getTarget();
			const source = this._vectorLayer.getSource();
			this._drawTypes = this._createDrawTypes(source);
			this._select = this._createSelect();
			this._select.setActive(false);
			this._modify = this._createModify();
			this._modify.setActive(false);
			this._snap = new Snap({ source: source, pixelTolerance: this._getSnapTolerancePerDevice() });
			this._dragPan = new DragPan();
			this._dragPan.setActive(false);


			olMap.addInteraction(this._select);
			olMap.addInteraction(this._modify);
			olMap.addInteraction(this._snap);
			olMap.addInteraction(this._dragPan);

			// eslint-disable-next-line no-unused-vars
			for (const [key, draw] of Object.entries(this._drawTypes)) {
				//draw.on('change:active', (e) => console.log('change:active changes for ' + key + ' to: ', e));
				olMap.addInteraction(draw);
			}
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

		// eslint-disable-next-line no-unused-vars
		for (const [key, draw] of Object.entries(this._drawTypes)) {
			olMap.removeInteraction(draw);
		}

		this._map = null;
	}

	_createDrawTypes(source) {
		const drawTypes = {
			'Symbol': new Draw({
				source: source,
				type: 'Point',
				snapTolerance: this._getSnapTolerancePerDevice(),
				style: createSketchStyleFunction(this._styleService.getStyleFunction(StyleTypes.DRAW))
			}),
			'Text': new Draw({
				source: source,
				type: 'Point',
				minPoints: 1,
				snapTolerance: this._getSnapTolerancePerDevice(),
				style: createSketchStyleFunction(this._styleService.getStyleFunction(StyleTypes.DRAW))
			}),
			'Line': new Draw({
				source: source,
				type: 'LineString',
				snapTolerance: this._getSnapTolerancePerDevice(),
				style: createSketchStyleFunction(this._styleService.getStyleFunction(StyleTypes.DRAW))
			}),
			'Polygon': new Draw({
				source: source,
				type: 'Polygon',
				minPoints: 3,
				snapTolerance: this._getSnapTolerancePerDevice(),
				style: createSketchStyleFunction(this._styleService.getStyleFunction(StyleTypes.DRAW))
			})
		};


		// eslint-disable-next-line no-unused-vars
		for (const [key, draw] of Object.entries(drawTypes)) {
			draw.on('drawstart', event => {
				this._activeSketch = event.feature;
				this._pointCount = 1;
				this._isSnapOnLastPoint = false;

				this._activeSketch.setId(DRAW_TOOL_ID + '_' + new Date().getTime());
			});

			//draw.on('drawabort', event => this._overlayService.remove(event.feature, this._map));
			draw.on('drawend', event => this._activateModify(event.feature));
			draw.setActive(false);
		}
		return drawTypes;
	}


	_createSelect() {
		// TODO: implement layerFilter
		// TODO: implement featureFilter
		const options = {
			style: createSelectStyleFunction(this._styleService.getStyleFunction(StyleTypes.DRAW))
		};
		const select = new Select(options);
		select.getFeatures().on('change:length', this._updateStatistics);

		return select;
	}

	_createModify() {
		// TODO: implement deleteContition
		const options = {
			features: this._select.getFeatures(),
			style: modifyStyleFunction
		};

		const modify = new Modify(options);
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
		const currentDraw = this._getActiveDraw();

		if (currentDraw) {
			currentDraw.setActive(false);
		}

		this._modify.setActive(true);
		this._modifyActivated = true;
		if (feature) {
			this._select.getFeatures().push(feature);
		}
	}

	_init(type) {
		const setActiveDraw = (type) => {
			if (type in this._drawTypes) {
				const draw = this._drawTypes[type];
				draw.setActive(true);
			}
			else {
				console.warn('Unknown DrawType, deactivate only current draw');
			}
		};

		const currentDraw = this._getActiveDraw();

		if (currentDraw) {
			currentDraw.abortDrawing();
			currentDraw.setActive(false);
		}
		setActiveDraw(type);
	}

	_remove() {
		// TODO: Implement logic for removing feature or part of feature
	}

	_finish() {
		const activeDraw = this._getActiveDraw();
		if (activeDraw && activeDraw.getActive()) {
			if (this._activeSketch) {
				activeDraw.finishDrawing();
			}
			else {
				this._activateModify(null);
			}
		}
	}

	_startNew() {
		const activeDraw = this._getActiveDraw();
		if (activeDraw) {
			activeDraw.abortDrawing();
			this._select.getFeatures().clear();
			this._modify.setActive(false);
		}
	}


	_register(store) {
		return [
			observe(store, state => state.draw.type, (type) => this._init(type)),
			observe(store, state => state.draw.finish, () => this._finish()),
			observe(store, state => state.draw.reset, () => this._startNew()),
			observe(store, state => state.draw.remove, () => this._remove())];
	}

	_getActiveDraw() {
		// eslint-disable-next-line no-unused-vars
		for (const [key, draw] of Object.entries(this._drawTypes)) {
			if (draw.getActive()) {
				return draw;
			}
		}

		return null;
	}

	_getSnapTolerancePerDevice() {
		if (this._environmentService.isTouch()) {
			return 12;
		}
		return 4;
	}
}
