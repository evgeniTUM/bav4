import { DsgvoDialog } from './DsgvoDialog';

if (!window.customElements.get(DsgvoDialog.tag)) {
	window.customElements.define(DsgvoDialog.tag, DsgvoDialog);
}
