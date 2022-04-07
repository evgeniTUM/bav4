import { EAContribution } from './EAContribution';
if (!window.customElements.get(EAContribution.tag)) {
	window.customElements.define(EAContribution.tag, EAContribution);
}
