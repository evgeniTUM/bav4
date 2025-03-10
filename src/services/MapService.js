/**
 * @module services/MapService
 */
import { $injector } from '../injection';
import { calc3857MapResolution } from '../utils/mapUtils';
import { findAllBySelector, REGISTER_FOR_VIEWPORT_CALCULATION_ATTRIBUTE_NAME } from '../utils/markup';
import { calculateVisibleViewport } from '../utils/viewport';
import { getBvvMapDefinitions } from './provider/mapDefinitions.provider';

/**
 * A function that provides map releated meta data
 * {@link MapDefinitions}
 *
 * @typedef {function():(MapDefinitions)} mapDefinitionProvider
 */

/**
 * Service for managing map related meta data.
 * @class
 * @author taulinger
 */
export class MapService {
	/**
	 *
	 * @param {mapDefinitionProvider} [provider=getBvvMapDefinitions]
	 */
	constructor(mapDefinitionProvider = getBvvMapDefinitions) {
		const { CoordinateService } = $injector.inject('CoordinateService');
		this._coordinateService = CoordinateService;
		this._definitions = mapDefinitionProvider();
	}

	/**
	 * Returns the internal srid of the map (typically 3857)
	 * @returns {number} srid
	 */
	getSrid() {
		return this._definitions.srid;
	}

	/**
	 * Returns a list with all available CoordinateRepresentation.
	 *
	 * When a coordinate is given the list contains
	 * suitable CoordinateRepresentation regarding this coordinate,
	 * which means the returned list is dependent on whether this coordinate is inside or outside the extent
	 * of the supported local projected system (if definded).
	 *
	 * If no coordinate is provided the list contains all globally available CoordinateRepresentations.
	 *
	 * Note: The first entry of the list should be considered as the current "default" CoordinateRepresentation.
	 *
	 * @param {Coordinate} [coordinateInMapProjection] - coordinate in map projection
	 * @returns {Array<CoordinateRepresentation>} srids
	 */
	getCoordinateRepresentations(coordinateInMapProjection) {
		// we have no projected extent defined or no coordinate is provided
		if (!this.getLocalProjectedSridExtent() || !coordinateInMapProjection) {
			return this._definitions.globalCoordinateRepresentations;
		}
		// we are outside the projected extent
		else if (!this._coordinateService.containsCoordinate(this.getLocalProjectedSridExtent(), coordinateInMapProjection)) {
			return this._definitions.globalCoordinateRepresentations;
		}

		return this._definitions.localProjectedCoordinateRepresentations(coordinateInMapProjection);
	}

	/**
	 * Returns the SRID of the supported local projected system.
	 * For the corresponding extent call {@link MapService#getLocalProjectedSridExtent}.
	 * @returns {number|null} SRID or `null` when no local projected SRID is supported
	 */
	getLocalProjectedSrid() {
		return this._definitions.localProjectedSrid;
	}

	/**
	 * Returns the extent of the supported local projected system.
	 * For the corresponding SRID call {@link MapService#getLocalProjectedSrid}.
	 * Within this extent all calculations can be done in the euclidean space.
	 * Outside of this extent all calculations should be done geodesically.
	 * Can be `null` when no extent is defined.
	 * @param {number} srid the desired SRID of the returned extent
	 * @returns {Extent|null} extent
	 * @throws Unsupported SRID error
	 */
	getLocalProjectedSridExtent(srid = this.getSrid()) {
		switch (srid) {
			case 3857:
				return this._coordinateService.fromLonLatExtent(this._definitions.localProjectedSridExtent);
			case 4326:
				return this._definitions.localProjectedSridExtent;
		}
		throw new Error('Unsupported SRID ' + srid);
	}

	/**
	 * Returns the default extent of the map.
	 * @param {number} srid the desired SRID of the returned extent
	 * @returns {Extent} extent
	 * @throws Unsupported SRID error
	 */
	getDefaultMapExtent(srid = this.getSrid()) {
		switch (srid) {
			case 3857:
				return this._definitions.defaultExtent;
			case 4326:
				return this._coordinateService.toLonLatExtent(this._definitions.defaultExtent);
		}
		throw new Error('Unsupported SRID ' + srid);
	}

	/**
	 * Returns the minimal zoom level the map supports
	 * @returns {Number} zoom level
	 */
	getMinZoomLevel() {
		return this._definitions.minZoomLevel;
	}

	/**
	 * Returns the maximal zoom level the map supports
	 * @returns {Number} zoom level
	 */
	getMaxZoomLevel() {
		return this._definitions.maxZoomLevel;
	}

	/**
	 * Returns the minimal angle in radians when rotation of the map should be accepted and applied.
	 * @returns threshold value for rotating the map in radians.
	 */
	getMinimalRotation() {
		return 0.3;
	}

	/**
	 * Calculates the resolution at a specific degree of latitude in meters per pixel.
	 * @param {number} zoom  Zoom level to calculate resolution at
	 * @param {Coordinate} [coordinate] Coordinate to calculate a resolution (required for global map projections like `3857`)
	 * @param {number} [srid] Spatial Reference Id. Default is `3857`
	 * @param {number} [tileSize] tileSize The size of the tiles in the tile pyramid. Default is `256`
	 */
	calcResolution(zoom, coordinateInMapProjection = null, srid = this.getSrid(), tileSize = 256) {
		switch (srid) {
			case 3857:
				if (!coordinateInMapProjection) {
					throw new Error(`Parameter 'coordinateInMapProjection' must not be Null when using SRID ${srid}`);
				}
				return calc3857MapResolution(this._coordinateService.toLonLat(coordinateInMapProjection)[1], zoom, tileSize);
		}
		throw new Error(`Unsupported SRID ${srid}`);
	}

	/**
	 * Returns an HTMLElement acting as a container for a scale line component.
	 * @returns {HTMLElement|null} element or `null`;
	 */
	getScaleLineContainer() {
		const rootElement = document.querySelector('ea-page-container')?.shadowRoot ?? document;
		const element = rootElement.querySelector('ba-footer')?.shadowRoot.querySelector('.scale');
		return element ?? null;
	}

	/**
	 * Additional padding of a viewport in pixel.
	 * @typedef ViewportPadding
	 * @property {number} top
	 * @property {number} right
	 * @property {number} button
	 * @property {number} left
	 */

	/**
	 * Returns a  {@link ViewportPadding} describing the visible part of the specified map
	 * (which means the part of the map that is not overlapped by any other UI element)
	 * @param {HTMLElement} mapElement the map containing element
	 * @returns {ViewportPadding}
	 */
	getVisibleViewport(mapElement) {
		const overlappingElements = findAllBySelector(document, `[${REGISTER_FOR_VIEWPORT_CALCULATION_ATTRIBUTE_NAME}]`);
		const visibleRectangle = calculateVisibleViewport(mapElement, overlappingElements);

		const baseRectangle = mapElement.getBoundingClientRect();
		return {
			top: visibleRectangle.top - baseRectangle.top,
			right: baseRectangle.right - visibleRectangle.right,
			bottom: baseRectangle.bottom - visibleRectangle.bottom,
			left: visibleRectangle.left - baseRectangle.left
		};
	}
}
