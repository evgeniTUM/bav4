import { EaMiscContentPanel } from './content/misc/EaMiscContentPanel';
import { EaMainMenu } from './EaMainMenu';
if (!window.customElements.get(EaMiscContentPanel.tag)) {
	window.customElements.define(EaMiscContentPanel.tag, EaMiscContentPanel);
}

if (!window.customElements.get(EaMainMenu.tag)) {
	window.customElements.define(EaMainMenu.tag, EaMainMenu);
}
