import { MixerModuleContent } from '../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent.js';
import { TrackingPlugin } from '../../../src/ea/plugins/TrackingPlugin.js';
import { activateTracking, deactivateTracking, setCurrentModule } from '../../../src/ea/store/module/ea.action.js';
import { eaReducer } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { addLayer } from '../../../src/store/layers/layers.action.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { setCurrentTool, ToolId } from '../../../src/store/tools/tools.action.js';
import { toolsReducer } from '../../../src/store/tools/tools.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('TrackingPlugin', () => {

	const storeActions = [];

	const configServiceMock = {
		getValue: (v) => v
	};

	const setup = async (state) => {

		storeActions.length = 0;

		const store = TestUtils.setupStoreAndDi(state, {
			tools: toolsReducer,
			layers: layersReducer,
			ea: eaReducer
		});

		$injector
			.registerSingleton('ConfigService', configServiceMock);

		const instanceUnderTest = new TrackingPlugin();
		await instanceUnderTest.register(store);

		return store;
	};

	describe('activation/deactivation', () => {

		it('adds/removes matomo script element to document when enabled/disabled', async () => {
			await setup();

			activateTracking();

			let scriptElement = document.getElementById('matomo-script');
			expect(scriptElement.outerHTML).toContain(
				'<script async="" src="MATOMO_URL/matomo.js" id="matomo-script"></script>'
			);

			expect(window._paq).toEqual([
				['trackPageView'],
				['enableLinkTracking'],
				['setTrackerUrl',
					'MATOMO_URL/matomo.php'],
				['setSiteId', 'MATOMO_ID']
			]);

			deactivateTracking();

			scriptElement = document.getElementById('matomo-script');
			expect(scriptElement).toBeNull();
			expect(window._paq).toEqual([]);
		});


		it('does not track events when disabled', async () => {
			await setup();

			activateTracking();
			deactivateTracking();

			setCurrentTool(ToolId.DRAWING);

			expect(window._paq).toEqual([]);
		});
	});

	describe('tracks user actions', () => {

		beforeAll(async () => {
			await setup();
			activateTracking();
		});

		afterAll(async () => {
			deactivateTracking();
		});

		it('tool selection', async () => {
			setCurrentTool(ToolId.DRAWING);

			expect(window._paq).toContain(['trackEvent', 'Tool', 'select', ToolId.DRAWING]);
		});

		it('layer activation', async () => {
			addLayer('id1');
			addLayer('id2');

			expect(window._paq).toContain(['trackEvent', 'Layer', 'activate', 'id1']);
			expect(window._paq).toContain(['trackEvent', 'Layer', 'activate', 'id2']);
		});

		it('module selection', async () => {
			setCurrentModule(MixerModuleContent.tag);

			expect(window._paq).toContain(['trackEvent', 'Module', 'activate', MixerModuleContent.tag]);
		});


	});
});
