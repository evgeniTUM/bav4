import { Analyse3DModuleContent } from '../../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(Analyse3DModuleContent.tag, Analyse3DModuleContent);


describe('Analyse3DModuleContent', () => {

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
		return TestUtils.render(Analyse3DModuleContent.tag);
	};

	describe('class', () => {

		it('inherits from AbstractModuleContent', async () => {

			const element = await setup();

			expect(element instanceof AbstractModuleContent).toBeTrue();
		});

		it('has correct configuration', async () => {
			const element = await setup();
			expect(element.getConfig()).toEqual({
				iframe: 'myAnalyse3DIFrame',
				module: 'analyse3d',
				frame_id: 'analyse3d_iframe',
				header_title: 'toolbox_recherche_header'
			});
		});

	});

});
