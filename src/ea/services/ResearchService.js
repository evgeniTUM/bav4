import { csv2json } from '../utils/eaUtils';
import csvContent from './research-test-data.csv';

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
			const fieldsSpecs = [
				{ type: 'enum', name: 'Strom-/ Wärmeerzeugung' },
				{ type: 'numeric', name: 'Inbetriebnahmejahr' }
			];

			const filter = (data, filters) => {
				const check = (data, filter) => {
					if (filter.type === 'numeric') return data[filter.name] < filter.max && data[filter.name] > filter.min;
				};
				return data.filter((data) => filters.every((filter) => check(data, filter)));
			};

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

	async query(theme, filters, page) {}

	async regions() {
		return {};
	}

	async getData() {
		return this.data;
	}
}
