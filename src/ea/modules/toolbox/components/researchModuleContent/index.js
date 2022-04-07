import { ResearchMOduleContent} from './ReserachModuleContent';

if (!window.customElements.get(ResearchMOduleContent.tag)) {
	window.customElements.define(ResearchMOduleContent.tag, ResearchMOduleContent);
}
