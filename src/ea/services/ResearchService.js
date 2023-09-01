import { csv2json } from '../utils/eaUtils';
import csvContent from './research-test-data.csv';

const fieldsSpecs = [
	{ type: 'enum', name: 'Strom-/ Wärmeerzeugung', showInResults: true },
	{ type: 'enum', name: 'Brennstofftyp', showInResults: true },
	{ type: 'enum', name: 'Biomethan', showInResults: true },
	{ type: 'numeric', name: 'Inbetriebnahmejahr', showInResults: true },
	{ type: 'numeric', name: 'Elektrische Leistung (kW)', showInResults: true },
	{ type: 'numeric', name: 'Stromproduktion 2021 (kWh)', showInResults: true },
	{ type: 'numeric', name: 'Volllaststunden (berechnet für Strom)', showInResults: true },
	{ type: 'numeric', name: 'Nennwärmeleistung Biomasse (MW)', showInResults: true },
	{ type: 'numeric', name: 'Nennwärmeleistung Gesamt (MW)', showInResults: true },
	{ type: 'numeric', name: 'Feuerungswärmeleistung (MW)', showInResults: true },
	{ type: 'enum', name: 'Bürgerenergieanlage', showInResults: true }
];

const filter = (data, filters) => {
	const check = (data, filter) => {
		if (filter.type === 'numeric') return data[filter.name] < filter.max && data[filter.name] > filter.min;
		if (filter.type === 'enum') return filter.values.incudes(data[filter.name]);
		return true;
	};
	return data.filter((data) => filters.every((filter) => check(data, filter)));
};
export class ResearchService {
	constructor() {
		this.data = csv2json(csvContent);
	}

	async themes() {
		return {
			Biomasse: ['Biomasseanlagen', 'Strom aus Biomasse - Installierte Leistung'],
			Solarenergie: ['Photovoltaikanlagen', 'Solarflächenbörse - gemeldete Dachflächen']
		};
	}

	async queryMetadata(theme, filters) {
		if (theme === 'Biomasseanlagen') {
			const results = filter(this.data, filters);

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

			const fields = fieldsSpecs.map((f) => getMetaInfo(f, results));

			return {
				results: results.length,
				fields
			};
		}
		return {
			results: 0
		};
	}

	async query(theme, filters, page) {
		console.log(filters);
		if (theme === 'Biomasseanlagen') {
			const results = filter(this.data, filters);
			return results;
		}
		return [];
	}

	async regions() {
		return {};
	}

	async getData() {
		return this.data;
	}
}
