/**
 * @module modules/routing/components/waypoints/Waypoints
 */
import { html, nothing } from '../../../../../node_modules/lit-html/lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { RoutingStatusCodes } from '../../../../domain/routing';
import { $injector } from '../../../../injection/index';
import { MvuElement } from '../../../MvuElement';
import css from './waypoints.css';
import { setWaypoints } from '../../../../store/routing/routing.action';
import { getPlaceholder, isDraggable, isPlaceholder } from './WaypointItem';
import arrowUpSvg from '../assets/arrow-up-short.svg';
import arrowDownSvg from '../assets/arrow-down-short.svg';
import removeSvg from '../assets/trash.svg';

const Update_Status = 'update_status';
const Update_Waypoints = 'update_waypoints';
const Update_Dragged_Item = 'update_dragged_item';
const Update_Collapsed_Waypoints = 'update_show_waypoints';

export class Waypoints extends MvuElement {
	constructor() {
		super({ status: null, waypoints: [], draggedItem: false, collapsedWaypoints: false });
		const { TranslationService, EnvironmentService } = $injector.inject('TranslationService', 'EnvironmentService');
		this._translationService = TranslationService;
		this._environmentService = EnvironmentService;

		this.observe(
			(store) => store.routing.status,
			(status) => this.signal(Update_Status, status)
		);

		this.observe(
			(store) => store.routing.waypoints,
			(waypoints) => this.signal(Update_Waypoints, waypoints)
		);
	}

	update(type, data, model) {
		switch (type) {
			case Update_Status:
				return { ...model, status: data };
			case Update_Waypoints:
				return {
					...model,
					waypoints: [...data]
				};
			case Update_Dragged_Item:
				return { ...model, draggedItem: data };
			case Update_Collapsed_Waypoints:
				return { ...model, collapsedWaypoints: data };
		}
	}

	createView(model) {
		const { status, collapsedWaypoints } = model;
		const translate = (key) => this._translationService.translate(key);
		const isVisible = status === RoutingStatusCodes.Ok;

		const toggleCollapseWayPoints = () => {
			this.signal(Update_Collapsed_Waypoints, !collapsedWaypoints);
		};

		const bodyCollapseClassInfo = {
			iscollapse: !collapsedWaypoints
		};
		const iconCollapseInfoClass = {
			iconexpand: collapsedWaypoints
		};

		const title = translate(collapsedWaypoints ? 'routing_waypoints_show' : 'routing_waypoints_hide');

		const buttons = this._getButtons(model);
		const waypointItems = this._getWaypoints(model);
		return isVisible
			? html`<style>
						${css}
					</style>
					<div class="container">
						<hr />
						<div class="details-selector" title=${title} @click="${toggleCollapseWayPoints}">
							<span class="sub-header-text">${translate('routing_waypoints_title')}</span>
							<i class="icon chevron ${classMap(iconCollapseInfoClass)}"></i>
						</div>
						<div class="${classMap(bodyCollapseClassInfo)}">
							<div class="overflow-container">
								<ul class="waypoints">
									${waypointItems}
								</ul>
								${buttons}
							</div>
						</div>
					</div>`
			: nothing;
	}

	_getButtons(model) {
		const translate = (key) => this._translationService.translate(key);
		const { waypoints } = model;

		const removeAll = () => {
			setWaypoints([]);
		};

		const reverse = () => {
			setWaypoints([...waypoints].reverse());
		};

		return waypoints.length > 0
			? html`<div class="waypoints__actions">
					<ba-button id="button_remove_all" .label=${translate('routing_waypoints_remove_all')} .type=${'secondary'} @click=${removeAll}></ba-button>
					<ba-button id="button_remove_all" .label=${translate('routing_waypoints_reverse')} .type=${'secondary'} @click=${reverse}></ba-button>
					<div></div>
			  </div>`
			: nothing;
	}

	_getWaypoints(model) {
		const { waypoints, draggedItem } = model;
		const translate = (key) => this._translationService.translate(key);
		const draggableItems = this._createDraggableItems(waypoints);

		const isNeighbor = (index, otherIndex) => {
			return index === otherIndex || index - 1 === otherIndex || index + 1 === otherIndex;
		};

		const isValidDropTarget = (draggedItem, dropItemCandidate) => {
			return isPlaceholder(dropItemCandidate) && !isNeighbor(dropItemCandidate.listIndex, draggedItem.listIndex);
		};

		const createPlaceholderElement = (waypoint) => {
			return html`<div id=${'placeholder_' + waypoint.listIndex} class="placeholder"></div>`;
		};

		const createIndexNumberForPlaceholder = (listIndex, waypoint) => {
			const isHigherThenDrag = waypoint.listIndex >= listIndex ? 1 : 0;
			return listIndex / 2 + isHigherThenDrag;
		};

		const createOptionalFlag = (listIndex) => {
			return listIndex === 0
				? ` - ${translate('routing_waypoints_as_start')}`
				: listIndex / 2 === waypoints.length
				? ` - ${translate('routing_waypoints_as_destination')}`
				: '';
		};

		const onDragStart = (e, waypoint) => {
			if (this._environmentService.isTouch()) {
				return;
			}

			this.signal(Update_Dragged_Item, waypoint);

			e.target.classList.add('isdragged');
			e.dataTransfer.dropEffect = 'move';
			e.dataTransfer.effectAllowed = 'move';
			this.shadowRoot.querySelectorAll('.placeholder').forEach((p) => {
				const listIndex = Number.parseFloat(p.id.replace('placeholder_', ''));
				p.innerHTML = `${createIndexNumberForPlaceholder(listIndex, waypoint)}${createOptionalFlag(listIndex)}`;
				if (!isNeighbor(listIndex, waypoint.listIndex)) {
					p.classList.add('placeholder-active');
				}
			});
		};
		const onDragEnd = (e) => {
			e.target.classList.remove('isdragged');
			e.preventDefault();
			this.shadowRoot.querySelectorAll('.placeholder').forEach((p) => p.classList.remove('placeholder-active'));
		};

		const onDrop = (e, waypointItem) => {
			const getNewIndex = (oldIndex) => (oldIndex === this._waypointCount - 1 ? oldIndex - 1 : oldIndex);

			if (isPlaceholder(waypointItem) && draggedItem) {
				this._moveWaypoint(draggedItem.index, getNewIndex(waypointItem.index));
			}
			if (e.target.classList.contains('placeholder')) {
				e.target.classList.remove('over');
			}
			this.signal(Update_Dragged_Item, false);
		};
		const onDragOver = (e, waypointItem) => {
			e.preventDefault();
			const defaultDropEffect = 'none';

			const getDropEffectFor = (draggedItem) => {
				return isValidDropTarget(draggedItem, waypointItem) ? 'all' : defaultDropEffect;
			};

			e.dataTransfer.dropEffect = draggedItem ? getDropEffectFor(draggedItem) : defaultDropEffect;
		};

		const onDragEnter = (e, waypointItem) => {
			const doNothing = () => {};
			const addClassName = () => (isValidDropTarget(draggedItem, waypointItem) ? e.target.classList.add('over') : doNothing());
			const dragEnterAction = draggedItem ? addClassName : doNothing;
			dragEnterAction();
		};

		const onDragLeave = (e) => {
			e.stopPropagation();
			if (e.target?.classList.contains('over')) {
				e.target.classList.remove('over');
			}
		};
		return html`${repeat(
			draggableItems,
			(draggableItem) => draggableItem.listIndex,
			(draggableItem, index) =>
				html` <li
					draggable=${isDraggable(draggableItem)}
					@dragstart=${(e) => onDragStart(e, draggableItem)}
					@dragend=${onDragEnd}
					@drop=${(e) => onDrop(e, draggableItem)}
					@dragover=${(e) => onDragOver(e, draggableItem)}
					@dragenter=${(e) => onDragEnter(e, draggableItem)}
					@dragleave=${onDragLeave}
					index=${index}
					class="draggable"
				>
					${isPlaceholder(draggableItem) ? createPlaceholderElement(draggableItem) : this._createWaypointElement(draggableItem, waypoints)}
				</li>`
		)}`;
	}

	_moveWaypoint(from, to) {
		const { waypoints } = this.getModel();
		const waypoint = waypoints[from];

		setWaypoints(waypoints.toSpliced(from, 1).toSpliced(to, 0, waypoint));
	}

	_removeWaypoint(index) {
		const { waypoints } = this.getModel();
		setWaypoints(waypoints.toSpliced(index));
	}

	_createDraggableItems(waypoints) {
		const draggableItems = [getPlaceholder(0, 0)];
		this._waypointCount = waypoints.length;
		this.signal(Update_Dragged_Item, false);

		for (let waypointIndex = 0, listIndex = 0; waypointIndex < waypoints.length; waypointIndex++) {
			const waypointOption = {
				index: waypointIndex,
				listIndex: listIndex + 1,
				point: waypoints[waypointIndex],
				isStart: waypointIndex === 0,
				isDestination: waypointIndex === waypoints.length - 1
			};
			draggableItems.push(waypointOption);
			draggableItems.push(getPlaceholder(waypointIndex + 1, listIndex + 2));
			listIndex += 2;
		}
		return draggableItems;
	}

	_createWaypointElement(waypoint, waypoints) {
		const translate = (key) => this._translationService.translate(key);
		const increaseIndex = (waypoint) => {
			if (waypoint.index < waypoints.length) {
				this._moveWaypoint(waypoint.index, waypoint.index + 1);
			}
		};

		const decreaseIndex = (waypoint) => {
			if (0 < waypoint.index) {
				this._moveWaypoint(waypoint.index, waypoint.index - 1);
			}
		};

		const remove = (waypoint) => {
			this._removeWaypoint(waypoint.index);
		};

		return html`<ba-routing-waypoint-item .waypoint=${waypoint} data-test-id> </ba-routing-waypoint-item>
			<div class="waypoint__buttons">
				<ba-icon
					id="decrease"
					.icon="${arrowUpSvg}"
					.color=${'var(--primary-color)'}
					.color_hover=${'var(--text3)'}
					.size=${2.6}
					.title=${translate('routing_waypoint_move_up')}
					@click=${() => decreaseIndex(waypoint)}
				></ba-icon>
				<ba-icon
					id="increase"
					.icon="${arrowDownSvg}"
					.color=${'var(--primary-color)'}
					.color_hover=${'var(--text3)'}
					.size=${2.6}
					.title=${translate('routing_waypoint_move_down')}
					@click=${() => increaseIndex(waypoint)}
				></ba-icon>
				<ba-icon
					id="remove"
					.icon="${removeSvg}"
					.color=${'var(--primary-color)'}
					.color_hover=${'var(--text3)'}
					.size=${2.6}
					.title=${translate('routing_waypoint_remove')}
					@click=${() => remove(waypoint)}
				></ba-icon>
			</div>`;
	}

	static get tag() {
		return 'ba-routing-waypoints';
	}
}
