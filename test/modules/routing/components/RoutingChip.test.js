import { RoutingChip } from '../../../../src/modules/routing/components/assistChip/RoutingChip';
import { RoutingStatusCodes } from '../../../../src/domain/routing';
import { $injector } from '../../../../src/injection';
import { setStatus } from '../../../../src/store/routing/routing.action';
import { routingReducer } from '../../../../src/store/routing/routing.reducer';
import routingSvg from '../../../../src/modules/routing/components/assets/direction.svg';
import { TestUtils } from '../../../test-utils';

window.customElements.define(RoutingChip.tag, RoutingChip);

describe('RoutingChip', () => {
	const defaultRoutingState = {
		routing: {
			status: RoutingStatusCodes.Start_Destination_Missing,
			categoryId: 'bike'
		}
	};

	const setup = async (state = defaultRoutingState, properties = {}, attributes = {}) => {
		TestUtils.setupStoreAndDi(state, { routing: routingReducer });
		$injector.registerSingleton('TranslationService', { translate: (key) => key });

		const element = await TestUtils.render(RoutingChip.tag, properties, attributes);

		return element;
	};

	const coordinate = [42, 21];

	describe('when instantiated', () => {
		it('has a model containing default values', async () => {
			await setup();
			const model = new RoutingChip().getModel();

			expect(model).toEqual({ status: RoutingStatusCodes.Start_Destination_Missing, coordinate: [] });
		});

		it('properly implements abstract methods', async () => {
			const element = await setup();

			expect(element.getLabel()).toBe('chips_assist_chip_start_routing_here');
			expect(element.getIcon()).toBe(routingSvg);
		});
	});

	describe('when initialized', () => {
		it('contains default values in the model', async () => {
			const element = await setup();

			const { coordinate } = element.getModel();

			expect(coordinate).toEqual([]);
		});

		it('renders the view', async () => {
			const state = { routing: { status: RoutingStatusCodes.Start_Destination_Missing } };
			const properties = { coordinate: coordinate };
			const element = await setup(state, properties);

			expect(element.isVisible()).toBeTrue();
		});

		it('does NOT renders the view without coordinate', async () => {
			const state = { routing: { status: RoutingStatusCodes.Start_Destination_Missing } };
			const properties = {};
			const element = await setup(state, properties);

			expect(element.isVisible()).toBeFalse();
		});

		it('does NOT renders the view without status', async () => {
			const state = { routing: { status: RoutingStatusCodes.Destination_Missing } };
			const properties = { coordinate: coordinate };
			const element = await setup(state, properties);

			expect(element.isVisible()).toBeFalse();
		});
	});

	describe('when observed slice-of-state changes', () => {
		it('changes visibility according to changes in store', async () => {
			const state = { routing: { status: RoutingStatusCodes.Start_Destination_Missing } };
			const properties = { coordinate: coordinate };
			const element = await setup(state, properties);

			expect(element.isVisible()).toBeTrue();

			setStatus(RoutingStatusCodes.Destination_Missing);

			expect(element.isVisible()).toBeFalse();

			setStatus(RoutingStatusCodes.Start_Missing);

			expect(element.isVisible()).toBeFalse();

			setStatus(RoutingStatusCodes.Ok);

			expect(element.isVisible()).toBeFalse();
			setStatus(RoutingStatusCodes.Http_Backend_400);

			expect(element.isVisible()).toBeFalse();
			setStatus(RoutingStatusCodes.Http_Backend_500);

			expect(element.isVisible()).toBeFalse();
		});
	});

	describe('when chip is clicked', () => {
		// TODO: waiting for a updated implementation of the routing slice-of state
		it('changes something on click', async () => {
			const state = { routing: { status: RoutingStatusCodes.Start_Destination_Missing } };
			const properties = { coordinate: coordinate };
			const element = await setup(state, properties);
			const button = element.shadowRoot.querySelector('button');
			const warnSpy = spyOn(console, 'warn').and.callFake(() => {});

			button.click();

			expect(warnSpy).toHaveBeenCalledWith('waiting for implementation of proposalCoordinate:', [42, 21]);
		});
	});

	describe('when disconnected', () => {
		it('removes all observers', async () => {
			const element = await setup();
			const unsubscribeSpy = spyOn(element, '_unsubscribeFromStore').and.callThrough();

			element.onDisconnect(); // we call onDisconnect manually

			expect(unsubscribeSpy).toHaveBeenCalled();
		});
	});
});
