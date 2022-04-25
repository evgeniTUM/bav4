import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);


describe('ResearchModuleContent', () => {

	const storeActions = [];

	const configServiceMock = {
		getValueAsPath() { }
	};

	const setup = async (state) => {

		storeActions.length = 0;

		TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			geofeature: geofeatureReducer,
			fnModuleComm: fnModuleCommReducer
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(ResearchModuleContent.tag);
	};

	describe('class', () => {

		it('inherits from AbstractModuleContent', async () => {

			const element = await setup();

			expect(element instanceof AbstractModuleContent).toBeTrue();
		});

		it('has correct configuration', async () => {
			const element = await setup();
			expect(element.getConfig()).toEqual({
				iframe: 'myResearchIFrame',
				module: 'recherche',
				frame_id: 'research_iframe',
				header_title: 'toolbox_recherche_header'
			});
		});

	});

});
