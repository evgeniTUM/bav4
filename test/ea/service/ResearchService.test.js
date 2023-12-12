import { ResearchService } from '../../../src/ea/services/ResearchService';
import { researchProviders } from '../../../src/ea/services/provider/research.provider';

describe('ResearchService', () => {
	const researchProviderMock = {
		loadThemeGroups: async () => {},
		loadRegionTree: async () => {},
		themeMetadata: async () => {},
		queryFeatures: async () => {}
	};

	const setup = (provider = researchProviderMock) => {
		return new ResearchService(provider);
	};

	describe('init', () => {
		it('initializes the service with default providers', async () => {
			const instanceUnderTest = new ResearchService();
			expect(instanceUnderTest._providers).toEqual(researchProviders);
		});
	});

	describe('delegation to provider', () => {
		it('provides theme groups', async () => {
			const instanceUnderTest = setup();

			const expected = { id: 'themeGroups' };
			spyOn(researchProviderMock, 'loadThemeGroups').and.returnValue(expected);

			const actual = await instanceUnderTest.loadThemeGroups();

			expect(actual).toEqual(expected);
		});

		it('provides region Groups', async () => {
			const instanceUnderTest = setup();

			const expected = { id: 'regionGroups' };
			spyOn(researchProviderMock, 'loadRegionTree').and.returnValue(expected);

			const actual = await instanceUnderTest.loadRegionTree();

			expect(actual).toEqual(expected);
		});

		it('provides theme metadata', async () => {
			const instanceUnderTest = setup();

			const themeId = 42;
			const expected = { id: 'themeMetadata' };
			spyOn(researchProviderMock, 'themeMetadata').withArgs(themeId).and.returnValue(expected);

			const actual = await instanceUnderTest.queryMetadata(themeId);

			expect(actual).toEqual(expected);
		});

		it('query features', async () => {
			const instanceUnderTest = setup();

			const themeId = 42;
			const regionFilters = [1, 2];
			const propertyFilter = ['f1', 'f2'];
			const sorting = { id: 'sorting' };
			const pageSize = 100;
			const page = 1;
			const expected = { id: 'queryFeatures' };

			spyOn(researchProviderMock, 'queryFeatures')
				.withArgs(themeId, regionFilters, propertyFilter, sorting, pageSize, page)
				.and.returnValue(expected);

			const actual = await instanceUnderTest.queryFeatures(themeId, regionFilters, propertyFilter, sorting, pageSize, page);

			expect(actual).toEqual(expected);
		});
	});
});
