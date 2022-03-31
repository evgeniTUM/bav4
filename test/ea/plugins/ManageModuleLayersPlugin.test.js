import { ManageModuleLayersPlugin } from '../../../src/ea/plugins/ManageModuleLayersPlugin.js';
import { EAContribute } from '../../../src/modules/ea/components/contribute/EAContribute.js';
import { layersReducer } from '../../../src/store/layers/layers.reducer.js';
import { setCurrentTool } from '../../../src/store/tools/tools.action.js';
import { toolsReducer } from '../../../src/store/tools/tools.reducer.js';
import { TestUtils } from '../../test-utils.js';


describe('GeolocationPlugin', () => {

	const setup = (state) => {

		const store = TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			tools: toolsReducer
		});

		return store;
	};

	it('toggles contribution layer when tool ID equals tag of contribution component', async () => {
		const store = setup();

		const instanceUnderTest = new ManageModuleLayersPlugin();
		await instanceUnderTest.register(store);

		expect(store.getState().layers.active.length).toBe(0);

		setCurrentTool(EAContribute.tag);

		expect(store.getState().layers.active.length).toBe(1);

		setCurrentTool("something");

		expect(store.getState().layers.active.length).toBe(0);
	});

});
