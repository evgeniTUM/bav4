import { ResearchModuleContent } from './ResearchModuleContent';

if (!window.customElements.get(ResearchModuleContent.tag)) {
	window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);
}
