import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer, MODULE_RESET_REQUESTED } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

class ConcreteModuleContent extends AbstractModuleContent {
	getConfig() {
		return {
			iframe: 'iframe',
			module: 'concrete_module',
			frame_id: 'frame_id',
			header_title: 'header_title'
		};
	}

	static get tag() {
		return 'concrete-test-module-content';
	}
}

window.customElements.define(ConcreteModuleContent.tag, ConcreteModuleContent);

describe('ModuleContent, when element disconnects from DOM', () => {
	const storeActions = [];

	const configServiceMock = {
		getValueAsPath: (key) => key
	};

	const setup = async (state) => {
		storeActions.length = 0;

		TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			geofeature: geofeatureReducer,
			fnModuleComm: fnModuleCommReducer
		});
		$injector.registerSingleton('TranslationService', { translate: (key) => key }).registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(ConcreteModuleContent.tag);
	};

	it('removes global variable', async () => {
		const element = await setup();

		element.disconnectedCallback();

		expect(window.ea_moduleWindow).toEqual({});
	});

	it('closes fnCommModule', async () => {
		const element = await setup();

		element.disconnectedCallback();

		expect(window.ea_moduleWindow).toEqual({});
		expect(storeActions.pop().type).toEqual(MODULE_RESET_REQUESTED);
	});
});
