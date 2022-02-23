import { SourceType, SourceTypeResult, SourceTypeResultStatus } from '../../../src/services/domain/sourceType';

describe('SourceType', () => {

	it('provides getter for properties', () => {

		const sourceType = new SourceType('name', 'version');

		expect(sourceType.name).toBe('name');
		expect(sourceType.version).toBe('version');
	});

	it('provides default properties', () => {

		const sourceType = new SourceType('name', undefined);

		expect(sourceType.name).toBe('name');
		expect(sourceType.version).toBeNull();
	});
});

describe('SourceTypeResult', () => {

	it('provides getter for properties', () => {

		const sourceType = new SourceType('name', 'version');
		const result = new SourceTypeResult(SourceTypeResultStatus.OK, sourceType);

		expect(result.status).toEqual(SourceTypeResultStatus.OK);
		expect(result.sourceType).toBe(sourceType);
	});

	it('provides default properties', () => {

		const result = new SourceTypeResult(SourceTypeResultStatus.MAX_SIZE_EXCEEDED, undefined);

		expect(result.status).toEqual(SourceTypeResultStatus.MAX_SIZE_EXCEEDED);
		expect(result.sourceType).toBeNull();
	});
});

describe('SourceTypeResultStatus', () => {

	it('provides an enum of all available types', () => {

		expect(Object.keys(SourceTypeResultStatus).length).toBe(4);
		expect(SourceTypeResultStatus.OK).toBe(0);
		expect(SourceTypeResultStatus.UNSUPPORTED_TYPE).toBe(1);
		expect(SourceTypeResultStatus.MAX_SIZE_EXCEEDED).toBe(2);
		expect(SourceTypeResultStatus.OTHER).toBe(3);
	});
});
