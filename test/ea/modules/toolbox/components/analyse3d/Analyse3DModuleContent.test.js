import { GlobalCoordinateRepresentations } from '../../../../../../src/domain/coordinateRepresentation';
import { Analyse3DModuleContent } from '../../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { setLocation } from '../../../../../../src/ea/store/contribution/contribution.action';
import { contributionReducer, initialState } from '../../../../../../src/ea/store/contribution/contribution.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { AbstractMvuContentPanel } from '../../../../../../src/modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(Analyse3DModuleContent.tag, Analyse3DModuleContent);

describe('Analyse3DModuleContent', () => {
	let store;

	const testState = {
		contribution: initialState,
		tools: { current: Analyse3DModuleContent.tag }
	};

	const coordinateServiceMock = {
		toLonLat: (a) => a,
		stringify: (a) => a
	};

	const configServiceMock = {
		getValueAsPath: (v) => v,
		getValue: (v) => v
	};

	const setup = async (customState, config = {}) => {
		const state = {
			...testState,
			...customState
		};

		const { embed = false, isTouch = false } = config;

		store = TestUtils.setupStoreAndDi(state, {
			contribution: contributionReducer,
			modal: modalReducer,
			tools: toolsReducer,
			ea: eaReducer
		});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				isTouch: () => isTouch
			})
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('CoordinateService', coordinateServiceMock)
			.registerSingleton('ConfigService', configServiceMock);
		return TestUtils.render(Analyse3DModuleContent.tag);
	};

	describe('class', () => {
		it('inherits from AbstractMvuContentPanel', async () => {
			const element = await setup();

			expect(element instanceof AbstractMvuContentPanel).toBeTrue();
		});
	});

	describe('when initialized', () => {
		it('activates tagging mode', async () => {
			await setup();

			expect(store.getState().contribution.tagging).toBe(true);
		});
	});

	describe('behavior', () => {
		it('opens a new page with the correct coordinates on position change', async () => {
			await setup();
			const givenCoordinates = [42.42, 24.24];

			const windowOpenSpy = spyOn(window, 'open');
			spyOn(configServiceMock, 'getValue').withArgs('ANALYSE3D_URL').and.returnValue('https://analyse3d/');
			spyOn(coordinateServiceMock, 'stringify')
				.withArgs(givenCoordinates, GlobalCoordinateRepresentations.WGS84, { digits: 5 })
				.and.returnValue('42.42000,24.24000');
			const expectedUrl = 'https://analyse3d/42.42000,24.24000';

			setLocation(givenCoordinates);

			expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank');
		});
	});
});
