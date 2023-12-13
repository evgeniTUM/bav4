import { EaMiscContentPanel } from './content/misc/EaMiscContentPanel';
import { AdditionalMenu } from './content/additionalMenu/AdditionalMenu';
if (!window.customElements.get(EaMiscContentPanel.tag)) {
	window.customElements.define(EaMiscContentPanel.tag, EaMiscContentPanel);
}

if (!window.customElements.get(AdditionalMenu.tag)) {
	window.customElements.define(AdditionalMenu.tag, AdditionalMenu);
}
