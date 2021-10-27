import { ModuleContainer } from './ModuleContainer';
if (!window.customElements.get(ModuleContainer.tag)) {
	window.customElements.define(ModuleContainer.tag, ModuleContainer);
}
