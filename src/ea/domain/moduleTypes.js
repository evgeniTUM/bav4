import { Analyse3DModuleContent } from '../modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../modules/toolbox/components/research/ResearchModuleContent';

/**
 * Available modules.
 */
export const EaModules = Object.freeze([
	MixerModuleContent,
	RedesignModuleContent,
	EnergyMarketModuleContent,
	EnergyReportingModuleContent,
	ResearchModuleContent,
	Analyse3DModuleContent,
	GeothermModuleContent
]);

/**
 * Mappings for query parameter "COMP".
 */
export const EaModulesQueryParameters = Object.freeze([
	{ name: MixerModuleContent.name, parameter: 'mischpult' },
	{ name: RedesignModuleContent.name, parameter: 'mischpult-redesign' },
	{ name: EnergyMarketModuleContent.name, parameter: 'boerse' },
	{ name: EnergyReportingModuleContent.name, parameter: 'melden' },
	{ name: ResearchModuleContent.name, parameter: 'recherche' },
	{ name: Analyse3DModuleContent.name, parameter: '3d-analyse' },
	{ name: Analyse3DModuleContent.name, parameter: 'windanalyse' },
	{ name: GeothermModuleContent.name, parameter: 'standort' }
]);
