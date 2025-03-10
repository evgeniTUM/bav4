/**
 * @module services/ShareService
 */
import { $injector } from '../injection';
import { round } from '../utils/numberUtils';
import { QueryParameters } from '../domain/queryParameters';
import { GlobalCoordinateRepresentations } from '../domain/coordinateRepresentation';
import { EaModulesQueryParameters } from '../ea/domain/moduleTypes';

/**
 * @class
 */
export class ShareService {
	constructor() {
		const { EnvironmentService: environmentService, ConfigService: configService } = $injector.inject('EnvironmentService', 'ConfigService');
		this._environmentService = environmentService;
		this._configService = configService;
	}

	/**
	 * @public
	 * @param {string} textToCopy
	 * @returns {Promise<undefined>}
	 */
	async copyToClipboard(textToCopy) {
		if (this._environmentService.getWindow().isSecureContext) {
			return this._environmentService.getWindow().navigator.clipboard.writeText(textToCopy);
		}
		throw new Error('Clipboard API is not available');
	}

	_mergeExtraParams(extractedState, extraParams) {
		for (const [key, value] of Object.entries(extraParams)) {
			//when a parameter is already present and denotes an array, value(s) will be appended
			if (Object.keys(extractedState).includes(key)) {
				if (Array.isArray(extractedState[key])) {
					const values = Array.isArray(value) ? [...value] : [value];
					extractedState[key] = [...extractedState[key], ...values];
				}
			}
			//we add non-existing extra params
			else {
				extractedState[key] = value;
			}
		}
		return extractedState;
	}

	/**
	 * Encodes the current state to a URL.
	 * The generated URL is based on the `FRONTEND_URL` config parameter.
	 * @param {object} [extraParams] Additional parameters. Non-existing entries will be added. Existing values will be ignored except for values that are an array.
	 * In this case, existing values will be concatenated with the additional values.
	 * @param {array} [pathParameters] Optional path parameters. Will be appended to the current pathname without further checks
	 * @returns {string} url
	 */
	encodeState(extraParams = {}, pathParameters = []) {
		return this.encodeStateForPosition({}, extraParams, pathParameters);
	}

	/**
	 * A combination of zoom and center and rotation. All properties are optional. Missing properties are replaced with the current state.
	 * @typedef {Object} Position
	 * @property {module:domain/coordinateTypeDef~Coordinate} [center] coordinate in map projection
	 * @property {number} [zoom] zoom level
	 * @property {number} [rotation] rotation in radians
	 */

	/**
	 * Same as {@link ShareService#encodeState} but for a designated position.
	 * @param {module:services/ShareService~Position} position The position
	 * @param {object} [extraParams] Additional parameters. Non-existing entries will be added. Existing values will be ignored except for values that are an array.
	 * In this case, existing values will be concatenated with the additional values.
	 * @param {array} [pathParameters] Optional path parameters. Will be appended to the current pathname without further checks
	 * @returns {string} url
	 */
	encodeStateForPosition(position, extraParams = {}, pathParameters = []) {
		const { center, zoom, rotation } = position;
		const extractedState = this._mergeExtraParams(
			{
				...this._extractPosition(center, zoom, rotation),
				...this._extractLayers(),
				...this._extractTopic(),
				...this._extractEaModule(),
				...this._extractRoute()
			},
			extraParams
		);

		const baseUrl = this._configService.getValueAsPath('FRONTEND_URL').replace('/index.html', '');
		const searchParams = new URLSearchParams(extractedState);
		const mergedPathParameters = pathParameters.length ? [...pathParameters] : [];
		return `${baseUrl}${mergedPathParameters.join('/')}?${decodeURIComponent(searchParams.toString())}`;
	}

	/**
	 * @private
	 * @returns {object} extractedState
	 */
	_extractPosition(_center, _zoom, _rotation) {
		const {
			StoreService: storeService,
			CoordinateService: coordinateService,
			MapService: mapService
		} = $injector.inject('StoreService', 'CoordinateService', 'MapService');

		const extractedState = {};

		const state = storeService.getStore().getState();
		const center = _center ?? state.position.center;
		const zoom = _zoom ?? state.position.zoom;
		const rotation = _rotation ?? state.position.rotation;

		// we use the defined SRID for local projected tasks (if available) otherwise WGS84
		const { digits, code } =
			mapService
				.getCoordinateRepresentations(center)
				.filter((cr) => cr.code)
				.filter((cr) => cr.code === mapService.getLocalProjectedSrid())[0] ?? GlobalCoordinateRepresentations.WGS84;

		const transformedCenter = coordinateService.transform(center, mapService.getSrid(), code).map((n) => n.toFixed(digits));

		const roundedZoom = round(zoom, ShareService.ZOOM_LEVEL_PRECISION);
		const roundedRotation = round(rotation, ShareService.ROTATION_VALUE_PRECISION);

		extractedState[QueryParameters.CENTER] = transformedCenter;
		extractedState[QueryParameters.ZOOM] = roundedZoom;
		if (rotation !== 0) {
			extractedState[QueryParameters.ROTATION] = roundedRotation;
		}
		return extractedState;
	}

	/**
	 * @private
	 * @returns {object} extractedState
	 */
	_extractLayers() {
		const { StoreService: storeService, GeoResourceService: geoResourceService } = $injector.inject('StoreService', 'GeoResourceService');

		const state = storeService.getStore().getState();

		const extractedState = {};

		const {
			layers: { active: activeLayers }
		} = state;
		const geoResourceIds = [];
		let layer_visibility = [];
		let layer_opacity = [];
		activeLayers
			.filter((l) => !l.constraints.hidden)
			.filter((l) => !geoResourceService.byId(l.geoResourceId).hidden)
			.forEach((l) => {
				geoResourceIds.push(l.geoResourceId);
				layer_visibility.push(l.visible);
				layer_opacity.push(l.opacity);
			});
		//remove if it contains only default values
		if (layer_visibility.filter((lv) => lv === false).length === 0) {
			layer_visibility = null;
		}
		//remove if it contains only default values
		if (layer_opacity.filter((lo) => lo !== 1).length === 0) {
			layer_opacity = null;
		}
		extractedState[QueryParameters.LAYER] = geoResourceIds.map((grId) => encodeURIComponent(grId)); //an GeoResource id may contain also an URL, so we encode it
		if (layer_visibility) {
			extractedState[QueryParameters.LAYER_VISIBILITY] = layer_visibility;
		}
		if (layer_opacity) {
			extractedState[QueryParameters.LAYER_OPACITY] = layer_opacity;
		}
		return extractedState;
	}

	/**
	 * @private
	 * @returns {object} extractedState
	 */
	_extractTopic() {
		const { StoreService: storeService } = $injector.inject('StoreService');

		const state = storeService.getStore().getState();
		const extractedState = {};

		//current topic
		const {
			topics: { current }
		} = state;

		extractedState[QueryParameters.TOPIC] = current;
		return extractedState;
	}

	/**
	 * @private
	 * @returns {object} extractedState
	 */
	_extractEaModule() {
		const { StoreService: storeService } = $injector.inject('StoreService');

		const state = storeService.getStore().getState();
		const extractedState = {};

		const module = state.ea.currentModule;
		if (module) {
			const value = EaModulesQueryParameters.find((e) => e.name === module).parameter;
			extractedState[QueryParameters.EA_MODULE] = value;
		}

		return extractedState;
	}

	/**
	 * @private
	 * @returns {object} extractedState
	 */
	_extractRoute() {
		const { StoreService: storeService } = $injector.inject('StoreService');

		const state = storeService.getStore().getState();
		const extractedState = {};

		const {
			routing: { waypoints, categoryId }
		} = state;

		if (waypoints.length > 0) {
			extractedState[QueryParameters.ROUTE_WAYPOINTS] = waypoints;
			extractedState[QueryParameters.ROUTE_CATEGORY] = categoryId;
		}
		return extractedState;
	}

	static get ZOOM_LEVEL_PRECISION() {
		return 3;
	}

	static get ROTATION_VALUE_PRECISION() {
		return 4;
	}
}
