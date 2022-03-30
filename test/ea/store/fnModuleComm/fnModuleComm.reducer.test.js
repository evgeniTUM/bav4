import { fnModuleCommReducer } from '../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { openFnModule }  from '../../../../src/ea/store/fnModuleComm/fnModuleComm.action';
import { TestUtils } from '../../../test-utils';


describe('fnModuleCommReducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			fnModuleComm: fnModuleCommReducer
		});
	};

	it('initiales the store with default values', () => {
		const store = setup();
		expect(store.getState().fnModuleComm.features).toHaveSize(0);
	});

	it('open the \'module\' and \'active\' property by adding module properties', () => {
		const store = setup();

		openFnModule('mixer', window, window.location.origin );
		expect(store.getState().fnModuleComm.features).toHaveSize(0);
		expect(store.getState().fnModuleComm.fnModuleSite).toBe('mixer');
		expect(store.getState().fnModuleComm.fnModuleWindow).not.toBeNull();
		expect(store.getState().fnModuleComm.fnModuleDomain).toBe( window.location.origin);
		expect(store.getState().fnModuleComm.active).toBeTrue();
		
	});

});
