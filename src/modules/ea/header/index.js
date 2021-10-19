import { EaHeader } from './components/EaHeader';
if (!window.customElements.get(EaHeader.tag)) {
	window.customElements.define(EaHeader.tag, EaHeader);
}

