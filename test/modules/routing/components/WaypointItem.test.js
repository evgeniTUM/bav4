import { $injector } from '../../../../src/injection';
import { MvuElement } from '../../../../src/modules/MvuElement';
import { WaypointItem, getPlaceholder, isDraggable, isPlaceholder } from '../../../../src/modules/routing/components/waypoints/WaypointItem';
import { createNoInitialStateMediaReducer } from '../../../../src/store/media/media.reducer';
import { routingReducer } from '../../../../src/store/routing/routing.reducer';
import { TestUtils } from '../../../test-utils';
window.customElements.define(WaypointItem.tag, WaypointItem);

describe('WaypointItem', () => {
	const category = { color: 'gray' };
	const routingServiceMock = { getCategoryById: () => category };

	const setup = async (waypoint = null) => {
		TestUtils.setupStoreAndDi(
			{},
			{
				media: createNoInitialStateMediaReducer(),
				routing: routingReducer
			}
		);
		$injector.registerSingleton('TranslationService', { translate: (key) => key }).registerSingleton('RoutingService', routingServiceMock);
		const element = await TestUtils.render(WaypointItem.tag);
		if (element) {
			element.waypoint = waypoint;
		}
		return element;
	};

	describe('class', () => {
		it('inherits from MvuElement', async () => {
			const element = await setup();

			expect(element instanceof MvuElement).toBeTrue();
		});
	});

	describe('when instantiated', () => {
		it('has a model containing default values', async () => {
			await setup();
			const model = new WaypointItem().getModel();

			expect(model).toEqual({
				waypoint: null,
				categoryId: null
			});
		});
	});

	describe('when initialized', () => {
		const defaultWaypoint = { index: 42, listIndex: 2, point: [1328315.0062647895, 6089975.78297438], isStart: false, isDestination: false };
		const startWaypoint = { index: 21, listIndex: 2, point: [1328315.0062647895, 6089975.78297438], isStart: true, isDestination: false };
		const destinationWaypoint = { index: 123, listIndex: 2, point: [1328315.0062647895, 6089975.78297438], isStart: false, isDestination: true };

		it('renders the waypoint view', async () => {
			const waypointElement = await setup(defaultWaypoint);

			expect(waypointElement.shadowRoot.querySelectorAll('.container')).toHaveSize(1);
			expect(waypointElement.shadowRoot.querySelector('.icon').classList).toHaveSize(1);
			expect(waypointElement.shadowRoot.querySelector('span').innerText).toBe('routing_waypoints_waypoint 42 - [11.932 47.898]');
		});

		it('renders the start view', async () => {
			const startElement = await setup(startWaypoint);

			expect(startElement.shadowRoot.querySelector('.icon-bg').classList.contains('start')).toBeTrue();
			expect(startElement.shadowRoot.querySelector('span').innerText).toBe('routing_waypoints_start - [11.932 47.898]');
		});

		it('renders the destination view', async () => {
			const destinationElement = await setup(destinationWaypoint);

			expect(destinationElement.shadowRoot.querySelector('.icon-bg').classList.contains('destination')).toBeTrue();
			expect(destinationElement.shadowRoot.querySelector('span').innerText).toBe('routing_waypoints_destination - [11.932 47.898]');
		});
	});

	describe('getPlaceholder', () => {
		it('creates a WaypointOption as placeholder', () => {
			expect(getPlaceholder(1, 2)).toEqual({ index: 1, listIndex: 2, point: null, isStart: false, isDestination: false });
		});
	});

	describe('isDraggable', () => {
		it('checks that the waypointOption defines to be draggable', () => {
			const draggableWaypoint = { index: 1, listIndex: 2, point: [42, 21], isStart: true, isDestination: false };
			const nonDraggableWaypoint = { index: 1, listIndex: 2, point: null, isStart: false, isDestination: false };

			expect(isDraggable(draggableWaypoint)).toBe(true);
			expect(isDraggable(nonDraggableWaypoint)).toBe(false);
		});
	});

	describe('isPlaceholder', () => {
		it('checks that the waypointOption defines a placeholder', () => {
			const placeholder = { index: 0, listIndex: 2, point: null, isStart: true, isDestination: false };
			const draggableWaypoint = { index: 1, listIndex: 2, point: [42, 21], isStart: true, isDestination: false };

			expect(isPlaceholder(getPlaceholder(1, 2))).toBe(true);
			expect(isPlaceholder(placeholder)).toBe(true);
			expect(isPlaceholder(draggableWaypoint)).toBe(false);
		});
	});
});
