import { EaMapContainer } from './EaMapContainer';
if (!window.customElements.get(EaMapContainer.tag)) {
	window.customElements.define(EaMapContainer.tag, EaMapContainer);
}
