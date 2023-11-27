import { researchProviders } from './provider/research.provider';

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

	async queryFeatures(themeId, regionFilters, propertyFilters, sorting, pageSize, page) {
		return this.providers.queryFeatures(themeId, regionFilters, propertyFilters, sorting, pageSize, page);
	}
}
