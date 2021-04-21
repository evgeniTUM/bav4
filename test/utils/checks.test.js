import { isCoordinate, isNumber, isPromise, isString } from '../../src/utils/checks';

describe('provides checks for commons types', () => {

	it('checks for a string', () => {
		expect(isString()).toBeFalse();
		expect(isString(null)).toBeFalse();
		expect(isString(123)).toBeFalse();
		expect(isString({})).toBeFalse();

		expect(isString('true')).toBeTrue();
		expect(isString(String('true'))).toBeTrue();
	});

	it('checks for a number (strict)', () => {
		expect(isNumber()).toBeFalse();
		expect(isNumber(null)).toBeFalse();
		expect(isNumber('123')).toBeFalse();
		expect(isNumber({})).toBeFalse();

		expect(isNumber(123)).toBeTrue();
		expect(isNumber(123.123)).toBeTrue();
		expect(isNumber(Number(123))).toBeTrue();
	});

	it('checks for a number (strings allowed)', () => {
		expect(isNumber(undefined, false)).toBeFalse();
		expect(isNumber(null, false)).toBeFalse();
		expect(isNumber({}, false)).toBeFalse();
		expect(isNumber('', false)).toBeFalse();
        
		expect(isNumber('123', false)).toBeTrue();
		expect(isNumber('123.123', false)).toBeTrue();
		expect(isNumber(123, false)).toBeTrue();
		expect(isNumber(123.123, false)).toBeTrue();
		expect(isNumber(Number(123), false)).toBeTrue();
	});

	it('checks for a coordinate', () => {
		expect(isCoordinate()).toBeFalse();
		expect(isCoordinate(null)).toBeFalse();
		expect(isCoordinate([21])).toBeFalse();
		expect(isCoordinate({})).toBeFalse();
		expect(isCoordinate(['21', 42])).toBeFalse();
		expect(isCoordinate(['21', '42'])).toBeFalse();
		expect(isCoordinate([1, 2, 3])).toBeFalse();

		expect(isCoordinate([21, 42])).toBeTrue();
	});

	it('checks for a promise', () => {
		expect(isPromise()).toBeFalse();
		expect(isPromise(null)).toBeFalse();
		expect(isPromise([21])).toBeFalse();
		expect(isPromise({})).toBeFalse();
		expect(isPromise('some')).toBeFalse();
		expect(isPromise(5)).toBeFalse();

		expect(isPromise(Promise.resolve())).toBeTrue();
	});
});
