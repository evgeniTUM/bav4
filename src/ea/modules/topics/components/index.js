import { EaTopicsContentPanel } from './menu/EaTopicsContentPanel';
window.console.log('instant EaTopicsContentPanel');
if (!window.customElements.get(EaTopicsContentPanel.tag)) {
	window.customElements.define(EaTopicsContentPanel.tag,  EaTopicsContentPanel);
}
