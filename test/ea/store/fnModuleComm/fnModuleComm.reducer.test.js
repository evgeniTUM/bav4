import { closeFnModules, openFnModuleComm } from '../../../../src/ea/store/fnModuleComm/fnModuleComm.action';
import { fnModuleCommReducer, initialState } from '../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
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

		expect(actual.module).toBeNull();
		expect(actual.window).toBeNull();
		expect(actual.domain).toBeNull();
		expect(actual.active).toBeFalse();
	});

	it('opens and closes the \'module\'', () => {
		const store = setup();

		openFnModuleComm('mixer', window.location.origin, window);
		expect(store.getState().fnModuleComm.module).toBe('mixer');
		expect(store.getState().fnModuleComm.window).not.toBeNull();
		expect(store.getState().fnModuleComm.domain).toBe(window.location.origin);
		expect(store.getState().fnModuleComm.active).toBeTrue();

		closeFnModules();
		expect(store.getState().fnModuleComm).toEqual(initialState);
	});

});
