import { RedesignModuleContent } from './RedesignModuleContent';

if (!window.customElements.get(RedesignModuleContent.tag)) {
	window.customElements.define(RedesignModuleContent.tag, RedesignModuleContent);
}
