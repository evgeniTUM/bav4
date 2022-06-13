import { Analyse3DModuleContent } from './Analyse3DModuleContent';

if (!window.customElements.get(Analyse3DModuleContent.tag)) {
	window.customElements.define(Analyse3DModuleContent.tag, Analyse3DModuleContent);
}
