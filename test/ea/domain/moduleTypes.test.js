import { EaModules, EaModulesQueryParameters } from '../../../src/ea/domain/moduleTypes';
import { Analyse3DModuleContent } from '../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../../src/ea/modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../../src/ea/modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';

describe('toolAction', () => {
	it('exports a EaModules enum', () => {
		expect(Object.keys(EaModules).length).toBe(7);
		expect(Object.isFrozen(EaModules)).toBeTrue();
		expect(EaModules).toEqual([
			MixerModuleContent,
			RedesignModuleContent,
			EnergyMarketModuleContent,
			EnergyReportingModuleContent,
			ResearchModuleContent,
			Analyse3DModuleContent,
			GeothermModuleContent
		]);
	});

	it('exports a EaModulesQueryParameters enum', () => {
		expect(Object.keys(EaModulesQueryParameters).length).toBe(8);
		expect(Object.isFrozen(EaModulesQueryParameters)).toBeTrue();
		expect(EaModulesQueryParameters).toEqual([
			{ name: MixerModuleContent.name, parameter: 'mischpult' },
			{ name: RedesignModuleContent.name, parameter: 'mischpult-redesign' },
			{ name: EnergyMarketModuleContent.name, parameter: 'boerse' },
			{ name: EnergyReportingModuleContent.name, parameter: 'melden' },
			{ name: ResearchModuleContent.name, parameter: 'recherche' },
			{ name: Analyse3DModuleContent.name, parameter: '3d-analyse' },
			{ name: Analyse3DModuleContent.name, parameter: 'windanalyse' },
			{ name: GeothermModuleContent.name, parameter: 'standort' }
		]);
	});
});
