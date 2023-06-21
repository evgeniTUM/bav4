import { Tools } from '../../../src/domain/tools.js';
import { WebAnalyticsPlugin } from '../../../src/ea/plugins/WebAnalyticsPlugin.js';
import { activateWebAnalytics, deactivateWebAnalytics, EaModules, setCurrentModule } from '../../../src/ea/store/module/ea.action.js';
import { eaReducer } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { addLayer, removeLayer } from '../../../src/store/layers/layers.action.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { setCurrentTool } from '../../../src/store/tools/tools.action.js';
import { toolsReducer } from '../../../src/store/tools/tools.reducer.js';
import { TestUtils } from '../../test-utils.js';

describe('WebAnalyticsPlugin', () => {
	const storeActions = [];

	const configServiceMock = {
		getValue: (v) => v
	};

	const geoResourceServiceMock = {
		byId: (v) => v
	};

	const setup = async (state) => {
		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			tools: toolsReducer,
			layers: layersReducer,
			ea: eaReducer
		});

		$injector.registerSingleton('ConfigService', configServiceMock);
		$injector.registerSingleton('GeoResourceService', geoResourceServiceMock);

		const instanceUnderTest = new WebAnalyticsPlugin();
		await instanceUnderTest.register(store);

		return store;
	};

	describe('activation/deactivation', () => {
		afterEach(() => deactivateWebAnalytics());

		it('adds/removes matomo script element to document when enabled/disabled', async () => {
			await setup();

			activateWebAnalytics();

			let scriptElement = document.getElementById('matomo-script');
			expect(scriptElement.outerHTML).toContain('<script async="" src="MATOMO_URL/matomo.js" id="matomo-script" type="text/javascript"></script>');

			expect(window._paq).toEqual([
				['trackPageView'],
				['enableLinkTracking'],
				['setTrackerUrl', 'MATOMO_URL/matomo.php'],
				['setSiteId', 'MATOMO_ID']
			]);

			deactivateWebAnalytics();

			scriptElement = document.getElementById('matomo-script');
			expect(scriptElement).toBeNull();
			expect(window._paq).toEqual([]);
		});

		it('does not track events when disabled', async () => {
			await setup();

			activateWebAnalytics();
			deactivateWebAnalytics();

			setCurrentTool(Tools.DRAWING);

			expect(window._paq).toEqual([]);
		});

		it('is activated on init when ea.webAnalyticsActive is true', async () => {
			await setup({ ea: { webAnalyticsActive: true } });

			const scriptElement = document.getElementById('matomo-script');
			expect(scriptElement.outerHTML).toContain('<script async="" src="MATOMO_URL/matomo.js" id="matomo-script" type="text/javascript"></script>');
		});
	});

	describe('tracks user actions', () => {
		beforeAll(async () => {
			await setup();
			activateWebAnalytics();
		});

		afterAll(async () => {
			deactivateWebAnalytics();
		});

		beforeEach(() => {
			window._paq = [];
		});

		it('tool selection', async () => {
			setCurrentTool(Tools.DRAWING);
			setCurrentTool(null);

			const trackEvents = window._paq.filter((i) => i[0] === 'trackEvent');
			expect(trackEvents.length).toEqual(1);
			expect(trackEvents[0]).toEqual(['trackEvent', 'Kartenwerkzeug', 'clickEvent', Tools.DRAWING]);
		});

		it('layer activation', async () => {
			spyOn(geoResourceServiceMock, 'byId').and.callFake((id) => ({ label: 'label-for-' + id }));

			addLayer('l1', { geoResourceId: 'id1' });
			addLayer('l2', { geoResourceId: 'id2' });
			removeLayer('l1');
			removeLayer('l2');

			const trackEvents = window._paq.filter((i) => i[0] === 'trackEvent');
			expect(trackEvents.length).toEqual(2);
			expect(trackEvents[0]).toEqual(['trackEvent', 'Kartenauswahl', 'clickEvent', 'label-for-id1']);
			expect(trackEvents[1]).toEqual(['trackEvent', 'Kartenauswahl', 'clickEvent', 'label-for-id2']);
		});

		it('module selection', async () => {
			EaModules.forEach((m) => {
				setCurrentModule(m.name);
				setCurrentModule(null);
			});

			const trackEvents = window._paq.filter((i) => i[0] === 'trackEvent');
			expect(trackEvents.length).toEqual(EaModules.length);

			EaModules.forEach((m, i) => expect(trackEvents[i]).toEqual(['trackEvent', 'Zusatzmodul', 'clickEvent', m.name]));
		});
	});
});
