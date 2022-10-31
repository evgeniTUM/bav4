import { generateJsonCategorySpecFromCSV } from '../../../src/ea/utils/eaUtils';

describe('EA Utils', () => {

	describe('generateJsonCategorySpecFromCSV', () => {
		it('converts csv to list of JSON objects', () => {
			const csv = `category,name,optional,type
                         cat1,name1,true,text
                         cat1,name2,false,email
                         cat2,name3,TRUE,text
                         category 3,hello there - me is a name,TRUE,text`;

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
