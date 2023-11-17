/**
 * @module ea/services/provider/research_provider
 */
import { $injector } from '../../../injection';
import { FieldProperties } from '../../domain/researchTypes';
import { csv2json } from '../../utils/eaUtils';
import csvContent from './research-test-data.csv';

const DATA = csv2json(csvContent);

const p = FieldProperties;

const fieldsSpecs = [
	{ type: 'enum', name: 'Strom-/ Wärmeerzeugung', properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'enum', name: 'Brennstofftyp', properties: [p.VIEWABLE, p.QUERYABLE] },
	{ type: 'enum', name: 'Biomethan', properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Inbetriebnahmejahr', properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Elektrische Leistung (kW)', properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Stromproduktion 2021 (kWh)', properties: [p.VIEWABLE, p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Volllaststunden (berechnet für Strom)', properties: [p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Nennwärmeleistung Biomasse (MW)', properties: [p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Nennwärmeleistung Gesamt (MW)', properties: [p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'numeric', name: 'Feuerungswärmeleistung (MW)', properties: [p.QUERYABLE, p.EXPORTABLE] },
	{ type: 'enum', name: 'Bürgerenergieanlage', properties: [p.QUERYABLE, p.EXPORTABLE] }
];

const filter = (data, filters) => {
	const check = (data, filter) => {
		if (filter.type === 'numeric') return data[filter.name] < filter.max && data[filter.name] > filter.min;
		if (filter.type === 'enum') return filter.values.includes(data[filter.name]);
		return true;
	};
	return data.filter((data) => filters.every((filter) => check(data, filter)));
};

const loadThemeGroupsMock = async () => {
	return {
		Biomasse: ['Biomasseanlagen', 'Strom aus Biomasse - Installierte Leistung'],
		Solarenergie: ['Photovoltaikanlagen', 'Solarflächenbörse - gemeldete Dachflächen']
	};
};

const themeMetadataMock = async (theme) => {
	if (theme === 'Biomasseanlagen') {
		const getMetaInfo = (fieldSpec, data) => {
			if (fieldSpec.type === 'numeric') {
				const values = data.map((d) => Number(d[fieldSpec.name]));
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

			if (fieldSpec.type === 'enum') {
				const values = [...new Set(data.map((d) => d[fieldSpec.name]))];
				return { ...fieldSpec, values };
			}
		};

		const fields = fieldsSpecs.map((f) => getMetaInfo(f, DATA));

		return {
			results: DATA.length,
			fields
		};
	}
	return {
		results: 0,
		fields: []
	};
};

const queryFeaturesMock = async (theme, filters, sortField, pageSize, page) => {
	if (theme === 'Biomasseanlagen') {
		const results = filter(DATA, filters);
		const sortedResult = sortField ? results.sort((a, b) => a[sortField] < b[sortField]) : results;

		const pagingResults = sortedResult.slice(page * pageSize, page * pageSize + pageSize);
		return {
			hits: results.length,
			results: pagingResults,
			pageSize,
			page
		};
	}
	return {
		hits: 0,
		results: [],
		pageSize,
		page
	};
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
