import { EaModules } from '../../../../../../src/ea/domain/moduleTypes';
import { ModuleContainer } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/ModuleContainer';
import { setCurrentModule } from '../../../../../../src/ea/store/module/ea.action';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { createMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(ModuleContainer.tag, ModuleContainer);

describe('ModuleContainer', () => {
	const setup = async (state) => {
		TestUtils.setupStoreAndDi(state, {
			ea: eaReducer,
			media: createMediaReducer()
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('EnvironmentService', { isEmbedded: () => false });
		return TestUtils.render(ModuleContainer.tag);
	};

	it('renders only when moduleId is tag name of a module', async () => {
		const element = await setup();

		EaModules.forEach((activeModule) => {
			setCurrentModule(activeModule.name);

			expect(element.shadowRoot.children.length).not.toEqual(0);
		});

		setCurrentModule('something');
		expect(element.shadowRoot.children.length).toEqual(0);
	});

	it('renders correct module depending on current moduleId', async () => {
		const element = await setup();

		EaModules.forEach((activeModule) => {
			setCurrentModule(activeModule.name);

			expect(element.shadowRoot.querySelector(activeModule.tag)).withContext(`module: ${activeModule} - is not active`).not.toBeNull();

			EaModules.forEach((inactiveModule) => {
				if (activeModule !== inactiveModule) {
					expect(element.querySelector(inactiveModule.tag))
						.withContext(`module: ${activeModule} - expected ${inactiveModule} to be inactive`)
						.toBeNull();
				}
			});
		});
	});
});
