import '../../../menu/components/mainMenu';
import { EaMainMenu } from './EaMainMenu';
if (!window.customElements.get(EaMainMenu.tag)) {
	window.customElements.define(EaMainMenu.tag, EaMainMenu);
}
