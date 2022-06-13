import { GeothermModuleContent } from './GeothermModuleContent';

if (!window.customElements.get(GeothermModuleContent.tag)) {
	window.customElements.define(GeothermModuleContent.tag, GeothermModuleContent);
}
