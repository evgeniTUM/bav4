import './i18n';
import { InfoPopup } from './components/InfoPopup';
if (!window.customElements.get(InfoPopup.tag)) {
	window.customElements.define(InfoPopup.tag, InfoPopup);
}
