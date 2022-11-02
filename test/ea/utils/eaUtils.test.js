import { generateJsonCategorySpecFromCSV } from '../../../src/ea/utils/eaUtils';

describe('EA Utils', () => {

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
					'ee-angaben': [
						{ name: 'name3', optional: true, type: 'text' }
					]
				},
				{
					'ee-name': 'category 3',
					'ee-angaben': [
						{ name: 'hello there - me is a name', optional: true, type: 'text' }
					]
				}
			]);
		});

	});
});
