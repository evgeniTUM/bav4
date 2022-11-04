import { Analyse3DModuleContent } from '../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../../../../src/ea/modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../../../../src/ea/modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { EaModules } from '../../../../../src/ea/store/module/ea.action';

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


	it('mixer module has initialWidth, minWidht and maxWidth properties', () => {
		expect(MixerModuleContent.initialWidth).toBe(40);
		expect(MixerModuleContent.minWidth).toBe(34);
		expect(MixerModuleContent.maxWidth).toBe(100);
	});

	it('redesign module has initialWidth, minWidht and maxWidth properties', () => {
		expect(RedesignModuleContent.initialWidth).toBe(40);
		expect(RedesignModuleContent.minWidth).toBe(34);
		expect(RedesignModuleContent.maxWidth).toBe(100);
	});

	it('research module has initialWidth, minWidht and maxWidth properties', () => {
		expect(ResearchModuleContent.initialWidth).toBe(40);
		expect(ResearchModuleContent.minWidth).toBe(34);
		expect(ResearchModuleContent.maxWidth).toBe(100);
	});

	it('analyse3d module has initialWidth, minWidht and maxWidth properties', () => {
		expect(Analyse3DModuleContent.initialWidth).toBe(40);
		expect(Analyse3DModuleContent.minWidth).toBe(34);
		expect(Analyse3DModuleContent.maxWidth).toBe(100);
	});

	it('geomodule has initialWidth, minWidht and maxWidth properties', () => {
		expect(GeothermModuleContent.initialWidth).toBe(40);
		expect(GeothermModuleContent.minWidth).toBe(34);
		expect(GeothermModuleContent.maxWidth).toBe(100);
	});

	it('energy-market module has initialWidth, minWidht and maxWidth properties', () => {
		expect(EnergyMarketModuleContent.initialWidth).toBe(40);
		expect(EnergyMarketModuleContent.minWidth).toBe(34);
		expect(EnergyMarketModuleContent.maxWidth).toBe(100);
	});

	it('energy-reporting module has initialWidth, minWidht and maxWidth properties', () => {
		expect(EnergyReportingModuleContent.initialWidth).toBe(40);
		expect(EnergyReportingModuleContent.minWidth).toBe(34);
		expect(EnergyReportingModuleContent.maxWidth).toBe(100);
	});
});
