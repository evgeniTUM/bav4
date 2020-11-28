/* eslint-disable no-undef */
import { debounced, throttled } from '../../src/utils/timer.js';

describe('Unit test functions from asyncs.js', () => {

	beforeEach(function () {
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});


	it('debounces a function call', () => {
		const myFunction = jasmine.createSpy();
		const handler = debounced(100, myFunction);

		handler();
		handler();
		handler();
		jasmine.clock().tick(200);
		handler();
		handler();
		handler();
		jasmine.clock().tick(200);

		expect(myFunction).toHaveBeenCalledTimes(2);
	});


	it('throttles a function call', () => {
		//throttled is based on Date
		jasmine.clock().mockDate();
		const myFunction = jasmine.createSpy();
		const handler = throttled(100, myFunction);

		handler();
		handler();
		handler();
		jasmine.clock().tick(200);
		handler();
		handler();
		handler();
		jasmine.clock().tick(200);

		expect(myFunction).toHaveBeenCalledTimes(2);
	});
});
