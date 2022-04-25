import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';



class ConcreteModuleContent extends AbstractModuleContent {

	getConfig() {

		return {
			iframe: 'iframe',
			site: 'site',
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
		getValueAsPath() { }
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

	it('stores the iframe-window in a global variable', async () => {
		const element = await setup();
		const frameId = element.getConfig().frame_id;
		const iframeWindow = element.shadowRoot.getElementById(frameId).contentWindow;

		expect(window.ea_moduleWindow).toHaveSize(1);
		expect(window.ea_moduleWindow[element.getConfig().module]).toEqual(iframeWindow);
	});

	it('removes global variable when element disconnects from dom', async () => {
		const element = await setup();

		element.disconnectedCallback();

		expect(window.ea_moduleWindow).toHaveSize(0);
	});

});
