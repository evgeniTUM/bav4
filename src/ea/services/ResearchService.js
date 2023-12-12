import { researchProviders } from './provider/research.provider';

export class ResearchService {
	constructor(providers = researchProviders) {
		this._providers = providers;
	}

	async loadThemeGroups() {
		return this._providers.loadThemeGroups();
	}

	async loadRegionTree() {
		return this._providers.loadRegionTree();
	}

	async queryMetadata(theme) {
		return this._providers.themeMetadata(theme);
	}

	async queryFeatures(themeId, regionFilters, propertyFilters, sorting, pageSize, page) {
		return this._providers.queryFeatures(themeId, regionFilters, propertyFilters, sorting, pageSize, page);
	}
}
