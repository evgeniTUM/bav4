import { RedesignModuleContent } from '../../../../../../src/ea/modules/toolbox/components/redesign/RedesignModuleContent';
import { AbstractModuleContent } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContent';
import { fnModuleCommReducer } from '../../../../../../src/ea/store/fnModuleComm/fnModuleComm.reducer';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(RedesignModuleContent.tag, RedesignModuleContent);

describe('RedesignModuleContent', () => {
	const storeActions = [];

	const configServiceMock = {
		getValueAsPath() {}
	};

	const setup = async (state) => {
		storeActions.length = 0;

		TestUtils.setupStoreAndDi(state, {
			spyReducer: (state, action) => storeActions.push(action),
			geofeature: geofeatureReducer,
			fnModuleComm: fnModuleCommReducer
		});
		$injector.registerSingleton('TranslationService', { translate: (key) => key }).registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(RedesignModuleContent.tag);
	};

	describe('class', () => {
		it('inherits from AbstractModuleContent', async () => {
			const element = await setup();

			expect(element instanceof AbstractModuleContent).toBeTrue();
		});

		it('has correct configuration', async () => {
			const element = await setup();
			expect(element.getConfig()).toEqual({
				iframe: 'myRedesignIFrame',
				module: 'redesign',
				frame_id: 'redesign_iframe',
				header_title: 'toolbox_redesign_header'
			});
		});
	});
});
