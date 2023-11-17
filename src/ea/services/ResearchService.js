import { researchProviders } from './provider/researchProvider';

export class ResearchService {
	constructor(providers = researchProviders) {
		this.providers = providers;
	}

	async loadThemeGroups() {
		return this.providers.loadThemeGroups();
	}

	async queryMetadata(theme) {
		return this.providers.themeMetadata(theme);
	}

	async queryFeatures(theme, filters, sortField, pageSize, page) {
		return this.providers.queryFeatures(theme, filters, pageSize, page);
	}
}
