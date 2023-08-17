import { csv2json } from '../utils/eaUtils';
import csvContent from './research-test-data.csv';

export class ResearchService {
	constructor() {
		this.data = csv2json(csvContent);
	}

	async getThemes() {
		return {
			Biomasse: ['Biomasseanlagen', 'Strom aus Biomasse - Installierte Leistung'],
			Solarenergie: ['Photovoltaikanlagen', 'Solarflächenbörse - gemeldete Dachflächen']
		};
	}

	async getSpecification(theme) {
		if (theme === 'Biomasseanlagen') return {};

		return {};
	}

	async getRegions() {
		return {};
	}

	async getData() {
		return this.data;
	}
}
