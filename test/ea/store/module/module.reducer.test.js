import { setCurrentModule } from '../../../../src/ea/store/module/module.action';
import { moduleReducer } from '../../../../src/ea/store/module/module.reducer';
import { TestUtils } from '../../../test-utils';


describe('module Reducer', () => {

	const setup = (state) => {
		return TestUtils.setupStoreAndDi(state, {
			module: moduleReducer
		});
	};

	it('has correct initial values', () => {
		const store = setup();
		expect(store.getState().module.current).toBe(null);
	});

	it('sets the module id', () => {
		const store = setup();

		setCurrentModule('test-tag');
		expect(store.getState().module.current).toBe('test-tag');
	});

});
