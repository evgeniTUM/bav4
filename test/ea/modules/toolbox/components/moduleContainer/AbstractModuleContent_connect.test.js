import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
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


/**
 * Test if we save the frame in the global window variable.
 * This has to be a separate test as other tests will asynchronously also change the global variable.
 */
describe('ModuleContent, when loaded', () => {

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
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(ConcreteModuleContent.tag);
	};

	let element;
	beforeAll(async () => {
		element = await setup();
	});

	it('stores the iframe-window in a global variable', async () => {
		const frameId = element.getConfig().frame_id;
		const iframeWindow = element.shadowRoot.getElementById(frameId).contentWindow;

		expect(window.ea_moduleWindow).toHaveSize(1);
		expect(window.ea_moduleWindow[element.getConfig().module]).toEqual(iframeWindow);
	});

});
