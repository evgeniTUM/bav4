import { EaToolBar } from './EaToolBar';
if (!window.customElements.get(EaToolBar.tag)) {
	window.customElements.define(EaToolBar.tag, EaToolBar);
}
