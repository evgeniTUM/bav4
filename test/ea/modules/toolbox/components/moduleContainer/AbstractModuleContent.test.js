import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer, MODULE_RESET_REQUESTED, OPEN_MODULE_REQUESTED } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
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


describe('ModuleContent', () => {

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

	beforeEach(async () => {
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});



	it('stores the iframe-window in a global variable', async () => {
		const element = await setup();
		jasmine.clock().tick(10000);

		setTimeout(() => {
			const frameId = element.getConfig().frame_id;
			const iframeWindow = element.shadowRoot.getElementById(frameId).contentWindow;

			expect(window.ea_moduleWindow).toHaveSize(1);
			expect(window.ea_moduleWindow[element.getConfig().module]).toEqual(iframeWindow);
		});
	});

	it('removes global variable when element disconnects from dom', async () => {
		const element = await setup();

		element.disconnectedCallback();

		expect(window.ea_moduleWindow).toHaveSize(0);
	});

	it('opens fnCommModule when element renders', async () => {
		const element = await setup();
		jasmine.clock().tick(10000);

		setTimeout(() => {
			const lastAction = storeActions.pop();
			expect(lastAction.type).toEqual(OPEN_MODULE_REQUESTED);
			expect(lastAction.payload).toEqual({
				module: element.getConfig().module,
				domain: 'MODULE_BACKEND_URL'
			});
		});
	});

	it('closes fnCommModule when element disconnects from dom', async () => {
		const element = await setup();

		element.disconnectedCallback();

		expect(storeActions.pop().type).toEqual(MODULE_RESET_REQUESTED);
	});

});
