import { clearLayer, closeFnModules, openFnModuleComm } from '../../../../src/ea/store/fnModuleComm/fnModuleComm.action';
import { fnModuleCommReducer } from '../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { TestUtils } from '../../../test-utils';


describe('fnModuleCommReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			fnModuleComm: fnModuleCommReducer
		});
	};

	it('initiales the store with default values', () => {
		const store = setup();
		const actual = store.getState().fnModuleComm;

		expect(actual.features).toHaveSize(0);
		expect(actual.layers).toHaveSize(0);
		expect(actual.fnModuleSite).toBeNull();
		expect(actual.fnModuleWindow).toBeNull();
		expect(actual.fnModuleDomain).toBeNull();
		expect(actual.active).toBeFalse();
	});

	it('opens and closes the \'module\'', () => {
		const store = setup();

		openFnModuleComm('mixer', window.location.origin, window);
		expect(store.getState().fnModuleComm.features).toHaveSize(0);
		expect(store.getState().fnModuleComm.fnModuleSite).toBe('mixer');
		expect(store.getState().fnModuleComm.fnModuleWindow).not.toBeNull();
		expect(store.getState().fnModuleComm.fnModuleDomain).toBe(window.location.origin);
		expect(store.getState().fnModuleComm.active).toBeTrue();

		closeFnModules();
		expect(store.getState().fnModuleComm.active).toBeFalse();
	});

});
