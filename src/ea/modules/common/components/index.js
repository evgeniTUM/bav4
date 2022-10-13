import { CollapsableContent } from './CollapsableContent';
if (!window.customElements.get(CollapsableContent.tag)) {
	window.customElements.define(CollapsableContent.tag, CollapsableContent);
}
