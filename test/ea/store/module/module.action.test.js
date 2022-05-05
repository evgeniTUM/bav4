import { EAContribution } from '../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { ModuleId } from '../../../../src/ea/store/module/module.action';

describe('toolAction', () => {

	it('exports a ModuleId enum', () => {
		expect(Object.keys(ModuleId).length).toBe(4);
		expect(Object.isFrozen(ModuleId)).toBeTrue();
		expect(ModuleId).toEqual([
			MixerModuleContent.tag,
			ResearchModuleContent.tag,
			RedesignModuleContent.tag,
			EAContribution.tag
		]);

	});
});

