import { Analyse3DModuleContent } from '../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../../../../src/ea/modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../../../../src/ea/modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { EaModules } from '../../../../../src/ea/domain/moduleTypes';

describe('Energy Atlas Module', () => {
	it('correct number of modules', () => {
		expect(Object.keys(EaModules).length).toBe(7);
	});

	it('every module has a tag property', () => {
		expect(MixerModuleContent.tag).toBe('ea-module-mixer-content');
		expect(ResearchModuleContent.tag).toBe('ea-module-research-content');
		expect(RedesignModuleContent.tag).toBe('ea-module-redesign-content');
		expect(Analyse3DModuleContent.tag).toBe('ea-module-analyse3d-content');
		expect(GeothermModuleContent.tag).toBe('ea-module-geotherm-content');
		expect(EnergyMarketModuleContent.tag).toBe('ea-module-energy-market');
		expect(EnergyReportingModuleContent.tag).toBe('ea-module-energy-reporting');
	});

	it('every module has a name property', () => {
		expect(MixerModuleContent.name).toBe('mixer');
		expect(ResearchModuleContent.name).toBe('recherche');
		expect(RedesignModuleContent.name).toBe('redesign');
		expect(Analyse3DModuleContent.name).toBe('analyse3d');
		expect(GeothermModuleContent.name).toBe('geotherm');
		expect(EnergyMarketModuleContent.name).toBe('energy-market');
		expect(EnergyReportingModuleContent.name).toBe('energy-reporting');
	});

	it('every module has an initialWidth and minWidth properties', () => {
		expect(MixerModuleContent.initialWidth).toBe(48);
		expect(MixerModuleContent.minWidth).toBe(48);

		expect(ResearchModuleContent.initialWidth).toBe(40);
		expect(ResearchModuleContent.minWidth).toBe(40);

		expect(RedesignModuleContent.initialWidth).toBe(40);
		expect(RedesignModuleContent.minWidth).toBe(40);

		expect(Analyse3DModuleContent.initialWidth).toBe(39);
		expect(Analyse3DModuleContent.minWidth).toBe(39);

		expect(GeothermModuleContent.initialWidth).toBe(39);
		expect(GeothermModuleContent.minWidth).toBe(39);

		expect(EnergyMarketModuleContent.initialWidth).toBe(40);
		expect(EnergyMarketModuleContent.minWidth).toBe(40);

		expect(EnergyReportingModuleContent.initialWidth).toBe(40);
		expect(EnergyReportingModuleContent.minWidth).toBe(40);
	});
});
