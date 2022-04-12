import { ResearchModuleContent} from './ReserachModuleContent';

if (!window.customElements.get(ResearchModuleContent.tag)) {
	window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);
}
