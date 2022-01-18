import { AdditionalMenu } from './AdditionalMenu';
if (!window.customElements.get(AdditionalMenu.tag)) {
	window.customElements.define(AdditionalMenu.tag, AdditionalMenu);
}
