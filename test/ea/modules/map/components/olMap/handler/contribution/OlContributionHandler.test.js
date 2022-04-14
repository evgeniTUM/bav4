import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM, TileDebug } from 'ol/source';
import { $injector } from '../../../../../../../../src/injection';
import { CONTRIBUTION_LAYER_ID, OlContributionHandler } from '../../../../../../../../src/ea/modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { setTaggingMode } from '../../../../../../../../src/ea/store/contribution/contribution.action';
import { contributionReducer, initialState } from '../../../../../../../../src/ea/store/contribution/contribution.reducer';
import { TestUtils } from '../../../../../../../test-utils.js';




describe('OlContributionHandler', () => {

	const translationServiceMock = { translate: (key) => key };
	const defaultState = {
		contribution: initialState
	};
	const setup = (state = defaultState) => {
		const store = TestUtils.setupStoreAndDi(state, { contribution: contributionReducer });
		$injector.registerSingleton('TranslationService', translationServiceMock);
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

		it('adds a tagging feature when tagging mode is active', async () => {
			const map = setupMap();
			setup();

			const classUnderTest = new OlContributionHandler();
			const layer = classUnderTest.activate(map);

			setTaggingMode(true);
			const features = await layer.getFeatures();

			expect(layer).toBeTruthy();
		});
	});
});
