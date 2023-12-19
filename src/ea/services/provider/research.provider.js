/**
 * @module ea/services/provider/research_provider
 */
import { $injector } from '../../../injection/index';
import { SortDirections, Types } from '../../domain/researchTypes';
import { csv2json } from '../../utils/eaUtils';
import csvContent from './research-test-data.csv';

const DATA = csv2json(csvContent);

const filter = (data, filters) => {
	const check = (data, filter) => {
		if (filter.type === Types.NUMERIC) return data[filter.originalKey] < filter.max && data[filter.originalKey] > filter.min;
		if (filter.type === Types.ENUM) return filter.values.includes(data[filter.originalKey]);
		return true;
	};
	return data.filter((data) => filters.every((filter) => check(data, filter)));
};

const queryFeaturesMock = async (themeId, regionFilters, propertyFilters, sorting, pageSize, page) => {
	if (themeId === 'wfs_biomasseanlagen') {
		const results = filter(DATA, propertyFilters);
		const sortingFn = sorting.sortDirections === SortDirections.ASCENDING ? (a, b) => a < b : (a, b) => a > b;
		const sortedResult = sorting ? results.sort((a, b) => sortingFn(a[sorting.originalKey], b[sorting.originalKey])) : results;

		const pagingResults = sortedResult.slice(page * pageSize, page * pageSize + pageSize);
		return {
			featureRequest: {
				themeId,
				regionFilters,
				propertyFilters,
				sorting,
				page,
				pageSize
			},
			hits: results.length,
			features: pagingResults
		};
	}

	return {
		featureRequest: {
			themeId,
			regionFilters,
			propertyFilters,
			sorting,
			page,
			pageSize
		},
		hits: 0,
		features: []
	};
};

/**
 * Uses the EAB endpoint to load the theme groups
 * @function
 * @type {module:services/ResearchService~researchProvider}
 */
export const loadThemeGroups = async () => {
	const { HttpService: httpService, ConfigService: configService } = $injector.inject('HttpService', 'ConfigService');

	const url = configService.getValueAsPath('BACKEND_URL') + 'research/themes';

	const result = await httpService.get(`${url}`);

	if (result.ok) {
		const payload = await result.json();
		return payload;
	}
	throw new Error('Theme Groups could not be retrieved');
};

/**
 * Uses the EAB endpoint to load the theme groups
 * @function
 * @type {module:services/ResearchService~researchProvider}
 */
export const loadThemeMeta = async (theme) => {
	const { HttpService: httpService, ConfigService: configService } = $injector.inject('HttpService', 'ConfigService');

	const url = configService.getValueAsPath('BACKEND_URL') + 'research/' + theme;

	const result = await httpService.get(`${url}`);

	if (result.ok) {
		const payload = await result.json();
		return payload;
	}
	throw new Error('Theme Metadata could not be retrieved');
};

/**
 * Uses the EAB endpoint to load the region tree.
 * @function
 * @type {module:services/ResearchService~researchProvider}
 */
export const loadRegionTree = async () => {
	const { HttpService: httpService, ConfigService: configService } = $injector.inject('HttpService', 'ConfigService');

	const url = configService.getValueAsPath('BACKEND_URL') + 'research/regionTree';

	const result = await httpService.get(`${url}`);

	if (result.ok) {
		const payload = await result.json();
		return payload;
	}
	throw new Error('RegionTree could not be retrieved');
};

export const researchProviders = {
	/**
	 * Loads the grouped themes available.
	 * @function
	 * @returns {Promise<themeGroups>}
	 */
	loadThemeGroups: loadThemeGroups,

	/**
	 * Loads the grouped themes available.
	 * @function
	 * @returns {Promise<themeGroups>}
	 */
	loadRegionTree: loadThemeGroups,

	/**
	 * Loads the metadata for specified theme id.
	 * @function
	 * @returns {Promise<themeMetadata>}
	 */
	themeMetadata: loadThemeMeta,

	/**
	 * Queries features for a theme id by specified filters.
	 * @function
	 * @returns {Promise<List<feature>>}
	 */
	queryFeatures: queryFeaturesMock
};
