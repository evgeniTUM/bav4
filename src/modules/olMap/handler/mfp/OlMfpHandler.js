import { $injector } from '../../../../injection';
import { observe } from '../../../../utils/storeUtils';

import { setScale } from '../../../../store/mfp/mfp.action';

import { Point, Polygon } from 'ol/geom';

import { OlLayerHandler } from '../OlLayerHandler';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { createMapMaskFunction, mfpBoundaryStyleFunction, nullStyleFunction } from './styleUtils';
import { MFP_LAYER_ID } from '../../../../plugins/ExportMfpPlugin';
import { unByKey } from 'ol/Observable';



const Points_Per_Inch = 72; // PostScript points 1/72"
const MM_Per_Inches = 25.4;
const Units_Ratio = 39.37; // inches per meter

/**
 * @class
 * @author thiloSchlemmer
 */
export class OlMfpHandler extends OlLayerHandler {

	constructor() {
		super(MFP_LAYER_ID);
		const { StoreService: storeService, TranslationService: translationService, MapService: mapService, MfpService: mfpService }
			= $injector.inject('StoreService', 'TranslationService', 'MapService', 'MfpService');

		this._storeService = storeService;
		this._translationService = translationService;
		this._mapService = mapService;
		this._mfpService = mfpService;
		this._mfpLayer = null;
		this._mfpBoundaryFeature = new Feature();
		this._map = null;
		this._registeredObservers = [];
	}

	/**
	 * Activates the Handler.
	 * @override
	 */
	onActivate(olMap) {

		this._map = olMap;
		if (this._mfpLayer === null) {
			const source = new VectorSource({ wrapX: false, features: [this._mfpBoundaryFeature] });
			this._mfpLayer = new VectorLayer({
				source: source
			});
		}


		this._registeredObservers = this._register(this._storeService.getStore());

		const optimalScale = this._getOptimalScale(olMap);
		if (optimalScale) {
			setScale(optimalScale);
		}
		const mfpSettings = this._storeService.getStore().getState().mfp.current;
		const boundaryMask = createMapMaskFunction(this._map, this._mfpBoundaryFeature);
		this._mfpBoundaryFeature.setStyle(mfpBoundaryStyleFunction(this._getPageLabel(mfpSettings)));
		this._mfpLayer.on('postrender', boundaryMask);
		return this._mfpLayer;
	}

	/**
	 *  @override
	 *  @param {Map} olMap
	 */
	onDeactivate(/*eslint-disable no-unused-vars */olMap) {
		//use the map to unregister event listener, interactions, etc
		this._mfpBoundaryFeature.setStyle(nullStyleFunction);
		this._unregister(this._registeredObservers);
		this._listeners.forEach(l => unByKey(l));
		this._listeners = [];
		this._mfpLayer = null;
		this._map = null;
	}

	_register(store) {
		return [
			observe(store, state => state.mfp.current, (current) => this._updateMfpPreview(current)),
			observe(store, state => state.position.center, () => this._updateMfpPreview())
		];
	}

	_unregister(observers) {
		observers.forEach(unsubscribe => unsubscribe());
		observers = [];
	}

	_updateMfpPreview(mfpSettings = null) {
		const current = mfpSettings ? mfpSettings : this._storeService.getStore().getState().mfp.current;
		if (current) {
			const geometry = this._createMpfBoundary(current);
			this._mfpBoundaryFeature.setGeometry(geometry);

			this._mfpBoundaryFeature.setStyle(mfpBoundaryStyleFunction(this._getPageLabel(current)));
			this._map.renderSync();
		}
	}

	_getPageLabel(mfpSettings) {
		const translate = (key) => this._translationService.translate(key);
		const { id, scale } = mfpSettings;
		const layout = translate(`olMap_handler_mfp_id_${id}`);
		return `${layout}\n1:${scale}`;
	}

	_getOptimalScale(map) {
		const getEffectiveSizeFromPadding = (size, padding) => {
			//			return { width: padding.left - padding.right, height: padding.bottom - padding.top };
			return { width: size[0] - (padding.left + padding.right), height: size[1] - (padding.bottom + padding.top) };
		};
		const availableSize = getEffectiveSizeFromPadding(map.getSize(), this._mapService.getVisibleViewport(map.getTarget()));

		//const availableSize =
		const resolution = map.getView().getResolution();
		const width = resolution * (availableSize.width - 100);
		const height = resolution * (availableSize.height - 100);

		const { id, scale: fallbackScale } = this._storeService.getStore().getState().mfp.current;
		const layoutSize = this._mfpService.byId(id).mapSize;

		const scaleWidth = width * Units_Ratio * Points_Per_Inch / layoutSize.width;
		const scaleHeight = height * Units_Ratio * Points_Per_Inch / layoutSize.height;

		const testScale = Math.min(scaleWidth, scaleHeight);
		const scaleCandidates = [...this._mfpService.byId(id).scales].reverse();
		const findLast = (array, matcher) => {
			let last = null;
			array.forEach(e => {
				if (!last || matcher(e)) {
					last = e;
				}
			});
			return last;
		};

		// array.findLast() is experimental in Firefox
		const bestScale = findLast(scaleCandidates, (scale) => testScale > scale);
		// const bestScale = scaleCandidates.findLast(scale => testScale > scale);
		return bestScale ? bestScale : fallbackScale;
	}

	_createMpfBoundary(mfpSettings) {
		if (!mfpSettings) {
			return null;
		}
		const { id, scale } = mfpSettings;
		const layoutSize = this._mfpService.byId(id).mapSize;
		const currentScale = scale ? scale : this._mfpService.byId(id).scales[0];

		const w = layoutSize.width / Points_Per_Inch * MM_Per_Inches / 1000.0 * currentScale;
		const h = layoutSize.height / Points_Per_Inch * MM_Per_Inches / 1000.0 * currentScale;

		const getVisibleCenter = () => {
			const size = this._map.getSize();
			const padding = this._mapService.getVisibleViewport(this._map.getTarget());
			return [size[0] / 2 + (padding.left - padding.right) / 2, size[1] / 2 + (padding.top - padding.bottom) / 2];
		};

		const getCenter = () => {
			const size = this._map.getSize();
			return [size[0] / 2, size[1] / 2];
		};

		const center = new Point(this._map.getCoordinateFromPixel(getVisibleCenter()));

		const geodeticCenter = center.clone().transform('EPSG:' + this._mapService.getSrid(), 'EPSG:' + this._mapService.getDefaultGeodeticSrid());

		const geodeticCenterCoordinate = geodeticCenter.getCoordinates();
		const geodeticBoundingBox = {
			minX: geodeticCenterCoordinate[0] - (w / 2),
			minY: geodeticCenterCoordinate[1] - (h / 2),
			maxX: geodeticCenterCoordinate[0] + (w / 2),
			maxY: geodeticCenterCoordinate[1] + (h / 2)
		};
		const geodeticBoundary = new Polygon([[
			[geodeticBoundingBox.minX, geodeticBoundingBox.maxY],
			[geodeticBoundingBox.maxX, geodeticBoundingBox.maxY],
			[geodeticBoundingBox.maxX, geodeticBoundingBox.minY],
			[geodeticBoundingBox.minX, geodeticBoundingBox.minY],
			[geodeticBoundingBox.minX, geodeticBoundingBox.maxY]
		]]);
		return geodeticBoundary.clone().transform('EPSG:' + this._mapService.getDefaultGeodeticSrid(), 'EPSG:' + this._mapService.getSrid());
	}
}
