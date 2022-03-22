import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { $injector } from '../../../../../../../src/injection';
import { CONTRIBUTION_LAYER_ID, OlContributionHandler } from '../../../../../../../src/modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { contributeReducer, initialState } from '../../../../../../../src/store/ea/contribute/contribute.reducer';
import { TestUtils } from '../../../../../../test-utils.js';




describe('OlContribution', () => {

	const translationServiceMock = { translate: (key) => key };
	const defaultState = {
		contribute: initialState
	}
	const setup = (state = defaultState) => {
		const store = TestUtils.setupStoreAndDi(state, { contribute: contributeReducer });
		$injector.registerSingleton('TranslationService', translationServiceMock)
		return store;
	};

	it('has two methods', () => {
		setup();
		const handler = new OlContributionHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(CONTRIBUTION_LAYER_ID);
	});

	describe('when activated over olMap', () => {
		const initialCenter = fromLonLat([11.57245, 48.14021]);

		const setupMap = () => {
			const container = document.createElement('div');
			return new Map({
				layers: [
					new TileLayer({
						source: new OSM()
					}),
					new TileLayer({
						source: new TileDebug()
					})],
				target: container,
				view: new View({
					center: initialCenter,
					zoom: 1
				})
			});
		};

		it('creates a layer to draw', () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlContributionHandler();
			const layer = classUnderTest.activate(map);

			expect(layer).toBeTruthy();
		});
	});
});