/**
 * @module modules/routing/components/waypoints/WaypointItem
 */
import { html } from 'lit-html';
import { MvuElement } from '../../../MvuElement';
import { classMap } from 'lit-html/directives/class-map.js';
import css from './waypointItem.css';
import { $injector } from '../../../../injection/index';
import { toLonLat } from '../../../../../node_modules/ol/proj';
import { round } from '../../../../utils/numberUtils';
import { nothing } from '../../../../../node_modules/lit-html/lit-html';

const Update_Waypoint = 'update_waypoint';
const Update_Category = 'update_category';
const Category_Color_Default = 'cadetblue';

/**
 * Options to display a waypoint.
 * @typedef WaypointOption
 * @property {number} index
 * @property {number} listIndex
 * @property {Coordinate} point
 * @property {boolean} isStart
 * @property {boolean} isDestination
 */

/**
 *
 * @param {*} index
 * @param {*} listIndex
 * @returns {WaypointOption}
 */
export const getPlaceholder = (index, listIndex) => {
	return { index: index, listIndex: listIndex, point: null, isStart: false, isDestination: false };
};

/**
 * Checks whether or not the options defines a draggable waypoint
 * @param {WaypointOption} waypoint
 * @returns {boolean}
 */
export const isDraggable = (waypoint) => {
	return waypoint.point !== null;
};

/**
 * Checks whether or not the options defines a placeholder for a waypoint
 * @param {WaypointOption} waypoint
 * @returns {boolean}
 */
export const isPlaceholder = (waypoint) => {
	return waypoint.point === null;
};

export class WaypointItem extends MvuElement {
	constructor() {
		super({
			waypoint: null,
			categoryId: null
		});

		const { TranslationService, RoutingService } = $injector.inject('TranslationService', 'RoutingService');
		this._translationService = TranslationService;
		this._routingService = RoutingService;

		this.observe(
			(state) => state.routing.categoryId,
			(categoryId) => this.signal(Update_Category, categoryId)
		);
	}

	update(type, data, model) {
		switch (type) {
			case Update_Waypoint:
				return { ...model, waypoint: data };
			case Update_Category:
				return { ...model, categoryId: data };
		}
	}

	createView(model) {
		const { waypoint, categoryId } = model;
		const translate = (key) => this._translationService.translate(key);

		const classes = {
			start: waypoint?.isStart,
			destination: waypoint?.isDestination
		};

		const getCategoryColor = (categoryId) => {
			const category = this._routingService.getCategoryById(categoryId);
			return category?.color ?? Category_Color_Default;
		};

		const getLabel = (waypoint) => {
			return waypoint?.isDestination ? translate('routing_waypoints_destination') : waypoint?.isStart ? translate('routing_waypoints_start') : null;
		};
		const label = getLabel(waypoint) ?? `${translate('routing_waypoints_waypoint')} ${waypoint?.index}`;
		const coordinate = waypoint ? toLonLat(waypoint.point) : [0, 0];
		return waypoint
			? html`<style>
						${css}
					</style>
					<div class="container" title="${label} [${round(coordinate[0], 3)} ${round(coordinate[1], 3)}]">
						<div class="icon-bg ${classMap(classes)}">
							<div class="icon" style=${`background:${getCategoryColor(categoryId)};`}></div>
						</div>
						<div class="line" style=${`background:${getCategoryColor(categoryId)};`}></div>
						<span class="text"><b>${label} - [${round(coordinate[0], 3)} ${round(coordinate[1], 3)}]</b></span>
					</div>`
			: nothing;
	}

	set waypoint(value) {
		this.signal(Update_Waypoint, value);
	}

	static get tag() {
		return 'ba-routing-waypoint-item';
	}
}
