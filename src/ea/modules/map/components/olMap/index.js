import { EaOlMap } from './EaOlMap';
if (!window.customElements.get(EaOlMap.tag)) {
	window.customElements.define(EaOlMap.tag, EaOlMap);
}
