import { Analyse3DModuleContent } from '../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { GeothermModuleContent } from '../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent';
import { RedesignModuleContent } from '../../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { ModuleId } from '../../../../src/ea/store/module/ea.action';

describe('toolAction', () => {

	it('exports a ModuleId enum', () => {
		expect(Object.keys(ModuleId).length).toBe(6);
		expect(Object.isFrozen(ModuleId)).toBeTrue();
		expect(ModuleId).toEqual([
			MixerModuleContent.tag,
			ResearchModuleContent.tag,
			RedesignModuleContent.tag,
			EAContribution.tag,
			Analyse3DModuleContent.tag,
			GeothermModuleContent.tag
		]);

	});
});

