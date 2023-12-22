import { ResearchModuleContent } from './ResearchModuleContent';
import { EnumerationFilter } from './EnumerationFilter';

if (!window.customElements.get(ResearchModuleContent.tag)) {
	window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);
}

if (!window.customElements.get(EnumerationFilter.tag)) {
	window.customElements.define(EnumerationFilter.tag, EnumerationFilter);
}
