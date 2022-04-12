import { MixerModuleContent } from '../../../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer, initialState as initialStateFnModule, OPEN_MODULE_REQUESTED } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer, initialState as initialStateGeofeature } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(MixerModuleContent.tag, MixerModuleContent);


describe('MixerModuleContent', () => {
	let store;

	const storeMock = {
		actions: [],

		createGeofeatureReducer() {
			return (state = initialStateGeofeature, action) => {
				this.actions.push(action);
				return geofeatureReducer(state, action);
			}
		},

		createFnModuleReducer() {
			return (state = initialStateFnModule, action) => {
				this.actions.push(action);
				return fnModuleCommReducer(state, action);
			}
		}
	}

	const configServiceMock = {
		getValueAsPath() {} 
	}

	const setup = async (state) => {

		store = TestUtils.setupStoreAndDi(state, {
			geofeature: storeMock.createGeofeatureReducer(),
			fnModuleComm: storeMock.createFnModuleReducer()

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

			const lastAction = storeMock.actions.pop();
			expect(lastAction.type).toBe(OPEN_MODULE_REQUESTED);
			expect(lastAction.payload.fnModuleSite).toEqual('mixer');
	});

});
