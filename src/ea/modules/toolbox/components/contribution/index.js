import { EAContribution } from './EAContribution';
import { EnergyMarketModuleContent } from './EnergyMarketModuleContent';
if (!window.customElements.get(EAContribution.tag)) {
	window.customElements.define(EAContribution.tag, EAContribution);
}
if (!window.customElements.get(EnergyMarketModuleContent.tag)) {
	window.customElements.define(EnergyMarketModuleContent.tag, EnergyMarketModuleContent);
}
