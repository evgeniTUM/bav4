import { EAContribution } from './EAContribution';
import { EnergyMarketModuleContent } from './EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from './EnergyReportingModuleContent';

if (!window.customElements.get(EAContribution.tag)) {
	window.customElements.define(EAContribution.tag, EAContribution);
}
if (!window.customElements.get(EnergyMarketModuleContent.tag)) {
	window.customElements.define(EnergyMarketModuleContent.tag, EnergyMarketModuleContent);
}
if (!window.customElements.get(EnergyReportingModuleContent.tag)) {
	window.customElements.define(EnergyReportingModuleContent.tag, EnergyReportingModuleContent);
}
