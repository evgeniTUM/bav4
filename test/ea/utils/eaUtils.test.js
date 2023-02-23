import { csv2json, generateJsonCategorySpecFromCSV } from '../../../src/ea/utils/eaUtils';

describe('EA Utils', () => {
	describe('csv2json', () => {
		it('parses a csv and returns a list of json objects', () => {
			const csv = `cat1, cat2, cat3
			val1.1, val1.2, val1.3
			val2.1, val2.2, val2.3
			`;

			const actual = csv2json(csv);

			expect(actual).toEqual([
				{ cat1: 'val1.1', cat2: 'val1.2', cat3: 'val1.3' },
				{ cat1: 'val2.1', cat2: 'val2.2', cat3: 'val2.3' }
			]);
		});
	});

	describe('generateJsonCategorySpecFromCSV', () => {
		it('converts csv to list of JSON objects', () => {
			const csv = [
				{ category: 'cat1', name: 'name1', optional: 'true', type: 'text' },
				{ category: 'cat1', name: 'name2', optional: 'false', type: 'email' },
				{ category: 'cat2', name: 'name3', optional: 'TRUE', type: 'text' },
				{ category: 'category 3', name: 'hello there - me is a name', optional: 'TRUE', type: 'text' }
			];

			const actual = generateJsonCategorySpecFromCSV(csv);

			expect(actual).toEqual([
				{
					'ee-name': 'cat1',
					'ee-angaben': [
						{ name: 'name1', optional: true, type: 'text' },
						{ name: 'name2', optional: false, type: 'email' }
					]
				},
				{
					'ee-name': 'cat2',
					'ee-angaben': [{ name: 'name3', optional: true, type: 'text' }]
				},
				{
					'ee-name': 'category 3',
					'ee-angaben': [{ name: 'hello there - me is a name', optional: true, type: 'text' }]
				}
			]);
		});
	});
});
