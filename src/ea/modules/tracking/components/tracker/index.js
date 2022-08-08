import { EaTracker } from './EaTracker';
if (!window.customElements.get(EaTracker.tag)) {
	window.customElements.define(EaTracker.tag, EaTracker);
}
