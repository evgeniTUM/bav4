import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';
import { AbstractModuleContentPanel } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel';
import { initialState } from '../../../../../../src/ea/store/contribution/contribution.reducer';
import { contributionReducer } from '../../../../../../src/ea/store/contribution/contribution.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';

window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);

describe('ResearchModuleContent', () => {
	let store;

	const testState = {
		contribution: initialState,
		tools: { current: ResearchModuleContent.tag }
	};

	const configServiceMock = {
		getValueAsPath: (v) => v,
		getValue: (v) => v
	};

	const setup = async (customState, config = {}) => {
		const state = {
			...testState,
			...customState
		};

		const { embed = false, isTouch = false } = config;

		store = TestUtils.setupStoreAndDi(state, {
			contribution: contributionReducer,
			modal: modalReducer,
			tools: toolsReducer,
			ea: eaReducer
		});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				isTouch: () => isTouch
			})
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(ResearchModuleContent.tag);
	};

	describe('class', () => {
		it('inherits from AbstractModuleContentPanel', async () => {
			const element = await setup();

			expect(element instanceof AbstractModuleContentPanel).toBeTrue();
		});
	});
});
