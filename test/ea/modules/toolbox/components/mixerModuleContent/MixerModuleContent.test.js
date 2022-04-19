import { MixerModuleContent } from '../../../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer, OPEN_MODULE_REQUESTED } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(MixerModuleContent.tag, MixerModuleContent);


describe('MixerModuleContent', () => {
	let store;

	let storeActions = [];

	const configServiceMock = {
		getValueAsPath() { }
	}

	const setup = async (state) => {

		storeActions.length = 0;

		store = TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			geofeature: geofeatureReducer,
			fnModuleComm: fnModuleCommReducer 
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ConfigService', configServiceMock)
		return TestUtils.render(MixerModuleContent.tag);
	};

	describe('class', () => {

		it('inherits from AbstractModuleContent', async () => {

			const element = await setup();

			expect(element instanceof AbstractModuleContent).toBeTrue();
		});

	});

	it('dispatches an \'fnModuleComm/open\' action on load', async () => {
		const element = await setup();

		function timeout(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		await timeout(1500);

		const lastAction = storeActions.pop();
		expect(lastAction.type).toBe(OPEN_MODULE_REQUESTED);
		expect(lastAction.payload.fnModuleSite).toEqual('mixer');
	});

});
