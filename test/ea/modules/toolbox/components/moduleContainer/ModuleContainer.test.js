import { nothing } from 'lit-html';
import { create } from 'ol/transform';
import { EAContribution } from '../../../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../../../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { ModuleContainer } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/ModuleContainer';
import { RedesignModuleContent } from '../../../../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { $injector } from '../../../../../../src/injection';
import { OPEN_CLOSED_CHANGED } from '../../../../../../src/store/mainMenu/mainMenu.reducer';
import { createMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { setCurrentTool, ToolId } from '../../../../../../src/store/tools/tools.action';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { TestUtils } from '../../../../../test-utils';



window.customElements.define(ModuleContainer.tag, ModuleContainer);
const modules = [
	MixerModuleContent.tag,
	ResearchModuleContent.tag,
	RedesignModuleContent.tag,
	EAContribution.tag
];


describe('ModuleContent', () => {
	const storeActions = [];

	const setup = async (state) => {

		storeActions.length = 0;

		TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			tools: toolsReducer,
			media: createMediaReducer()
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('EnvironmentService', { isEmbedded: () => false });
		return TestUtils.render(ModuleContainer.tag);
	};

	it('renders only when tool_id is tag name of a module', async () => {
		const element = await setup();

		modules.forEach((activeTool) => {
			setCurrentTool(activeTool);

			expect(element.shadowRoot.children.length).not.toEqual(0);
		});

		Object.keys(ToolId).forEach((activeTool) => {
			setCurrentTool(activeTool);

			expect(element.shadowRoot.children.length).toEqual(0);
		});
	});

	it('renders correct module depending on current tool_id', async () => {
		const element = await setup();

		modules.forEach((activeTag) => {
			setCurrentTool(activeTag);

			expect(element.shadowRoot.querySelector(activeTag))
				.withContext(`tool: ${activeTag} - is not active`)
				.not.toBeNull();

			modules.forEach((inactiveTag) => {
				if (activeTag !== inactiveTag) {
					expect(element.querySelector(inactiveTag))
						.withContext(`tool: ${activeTag} - expected ${inactiveTag} to be inactive`)
						.toBeNull();
				}
			});
		});
	});



});
