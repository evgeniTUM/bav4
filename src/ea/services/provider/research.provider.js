/**
 * @module ea/services/provider/research_provider
 */
import { $injector } from '../../../injection/index';
import { FieldProperties, ScopeFilters, SortDirections, Types } from '../../domain/researchTypes';
import { csv2json } from '../../utils/eaUtils';
import csvContent from './research-test-data.csv';

const DATA = csv2json(csvContent);

const p = FieldProperties;

const fieldsSpecs = [
	{
		originalKey: 'Strom-/ Wärmeerzeugung',
		type: Types.ENUM,
		displayName: 'Strom-/ Wärmeerzeugung',
		properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Brennstofftyp',
		type: Types.ENUM,
		displayName: 'Brennstofftyp',
		properties: [p.VIEWABLE, p.QUERYABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Biomethan',
		type: Types.ENUM,
		displayName: 'Biomethan',
		properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Inbetriebnahmejahr',
		type: Types.NUMERIC,
		displayName: 'Inbetriebnahmejahr',
		properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],

		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Elektrische Leistung (kW)',
		type: Types.NUMERIC,
		displayName: 'Elektrische Leistung (kW)',
		properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Stromproduktion 2021 (kWh)',
		type: Types.NUMERIC,
		displayName: 'Stromproduktion 2021 (kWh)',
		properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Volllaststunden (berechnet für Strom)',
		type: Types.NUMERIC,
		displayName: 'Volllaststunden (berechnet für Strom)',
		properties: [p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Nennwärmeleistung Biomasse (MW)',
		type: Types.NUMERIC,
		displayName: 'Nennwärmeleistung Biomasse (MW)',
		properties: [p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Nennwärmeleistung Gesamt (MW)',
		type: Types.NUMERIC,
		displayName: 'Nennwärmeleistung Gesamt (MW)',
		properties: [p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Feuerungswärmeleistung (MW)',
		type: Types.NUMERIC,
		displayName: 'Feuerungswärmeleistung (MW)',
		properties: [p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	},
	{
		originalKey: 'Bürgerenergieanlage',
		type: Types.ENUM,
		displayName: 'Bürgerenergieanlage',
		properties: [p.QUERYABLE, p.EXPORTABLE],
		sortDirections: [SortDirections.ASCENDING, SortDirections.DESCENDING],
		scopeFilters: [ScopeFilters.AND, ScopeFilters.OR]
	}
];

const filter = (data, filters) => {
	const check = (data, filter) => {
		if (filter.type === Types.NUMERIC) return data[filter.originalKey] < filter.max && data[filter.originalKey] > filter.min;
		if (filter.type === Types.ENUM) return filter.values.includes(data[filter.originalKey]);
		return true;
	};
	return data.filter((data) => filters.every((filter) => check(data, filter)));
};

const loadThemeGroupsMock = async () => {
	return [
		{
			groupName: 'Biomasse',
			themes: [
				{
					themeId: 1,
					displayName: 'Biomasseanlagen',
					geoResourceId: 'a701a9ef-5af4-453e-8669-fd939246845'
				},
				{
					themeId: 4,
					displayName: 'Strom aus Biomasse - Installierte Leistung'
				}
			]
		},
		{
			groupName: 'Energie',
			themes: [
				{
					themeId: 2,
					displayName: 'KWK-Anlagen',
					geoResourceId: 'a701a9ef-5af4-453e-8669-fd939246845'
				},
				{ themeId: 3, displayName: 'Abfallheizkraftwerke', featureResourceId: 3 }
			]
		}
	];
};

const themeMetadataMock = async (themeId) => {
	if (themeId === 1) {
		const getMetaInfo = (fieldSpec, data) => {
			if (fieldSpec.type === Types.NUMERIC) {
				const values = data.map((d) => Number(d[fieldSpec.originalKey]));
				const min = Math.min.apply(
					null,
					values.filter((n) => !isNaN(n))
				);
				const max = Math.max.apply(
					null,
					values.filter((n) => !isNaN(n))
				);
				return { ...fieldSpec, min, max };
			}

			if (fieldSpec.type === Types.ENUM) {
				const values = [...new Set(data.map((d) => d[fieldSpec.originalKey]))];
				return { ...fieldSpec, values };
			}
		};

		const propertyDefinitions = fieldsSpecs.map((f) => getMetaInfo(f, DATA));

		return {
			themeId,
			featureCount: DATA.length,
			propertyDefinitions
		};
	}
	return {
		themeId,
		featureCount: 0,
		propertyDefinitions: []
	};
};

const queryFeaturesMock = async (themeId, regionFilters, propertyFilters, sorting, pageSize, page) => {
	if (themeId === 1) {
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

	const url = configService.getValueAsPath('BACKEND_URL') + 'research/themeGroups';

	const result = await httpService.get(`${url}`);

	if (result.ok) {
		const payload = await result.json();
		return payload;
	}
	throw new Error('Theme Groups could not be retrieved');
};

export const researchProviders = {
	/**
	 * Loads the grouped themes available.
	 * @function
	 * @returns {Promise<themeGroups>}
	 */
	loadThemeGroups: loadThemeGroupsMock,

	/**
	 * Loads the metadata for specified theme id.
	 * @function
	 * @returns {Promise<themeMetadata>}
	 */
	themeMetadata: themeMetadataMock,

	/**
	 * Queries features for a theme id by specified filters.
	 * @function
	 * @returns {Promise<List<feature>>}
	 */
	queryFeatures: queryFeaturesMock
};
