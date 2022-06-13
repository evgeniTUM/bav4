import { Analyse3DModuleContent } from '../../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { ModuleContainer } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/ModuleContainer';
import { RedesignModuleContent } from '../../../../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { setCurrentModule } from '../../../../../../src/ea/store/module/module.action';
import { moduleReducer } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { createMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { TestUtils } from '../../../../../test-utils';



window.customElements.define(ModuleContainer.tag, ModuleContainer);

const modules = [
	MixerModuleContent.tag,
	ResearchModuleContent.tag,
	RedesignModuleContent.tag,
	EAContribution.tag,
	Analyse3DModuleContent.tag,
	GeothermModuleContent.tag
];


describe('ModuleContainer', () => {

	const setup = async (state) => {
		TestUtils.setupStoreAndDi(state, {
			module: moduleReducer,
			media: createMediaReducer()
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('EnvironmentService', { isEmbedded: () => false });
		return TestUtils.render(ModuleContainer.tag);
	};

	it('renders only when moduleId is tag name of a module', async () => {
		const element = await setup();

		modules.forEach((activeModule) => {
			setCurrentModule(activeModule);

			expect(element.shadowRoot.children.length).not.toEqual(0);
		});

		setCurrentModule('something');
		expect(element.shadowRoot.children.length).toEqual(0);
	});

	it('renders correct module depending on current moduleId', async () => {
		const element = await setup();

		modules.forEach((activeTag) => {
			setCurrentModule(activeTag);

			expect(element.shadowRoot.querySelector(activeTag))
				.withContext(`module: ${activeTag} - is not active`)
				.not.toBeNull();

			modules.forEach((inactiveTag) => {
				if (activeTag !== inactiveTag) {
					expect(element.querySelector(inactiveTag))
						.withContext(`module: ${activeTag} - expected ${inactiveTag} to be inactive`)
						.toBeNull();
				}
			});
		});
	});

});
