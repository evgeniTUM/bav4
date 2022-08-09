import { TrackingPlugin } from '../../../src/ea/plugins/TrackingPlugin.js';
import { eaReducer } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('TrackingPlugin', () => {

	const storeActions = [];

	const configServiceMock = {
		getValue: (v) => v
	};

	const setup = async (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			ea: eaReducer
		});

		$injector
			.registerSingleton('ConfigService', configServiceMock);

		const instanceUnderTest = new TrackingPlugin();
		await instanceUnderTest.register(store);

		return store;
	};

	describe('initialization', () => {

		it('when active, adds a script element to document and inits matomo', async () => {
			await setup();

			const scriptElements = document.getElementsByTagName('script');

			const elements = [...scriptElements].map(n => n.outerHTML);
			expect(elements).toContain('<script async="" src="MATOMO_URL/matomo.js"></script>');

			expect(window._paq).toEqual([
				['trackPageView'],
				['enableLinkTracking'],
				['setTrackerUrl',
					'MATOMO_URL/matomo.php'],
				['setSiteId', 'MATOMO_ID']
			]);
		});

	});



});
