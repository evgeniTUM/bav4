import { TestUtils } from '../../../../../test-utils';
import { GeothermModuleContent } from     '../../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { AbstractModuleContentPanel } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { setLocation } from '../../../../../../src/ea/store/contribution/contribution.action';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { contributionReducer, initialState } from '../../../../../../src/ea/store/contribution/contribution.reducer';


window.customElements.define(GeothermModuleContent.tag, GeothermModuleContent);

describe('GeothermModelContent', () => {
	const testState = {
		contribution: initialState,
		tools: { current: GeothermModuleContent.tag }
	};

	const coordinateServiceMock = {
		toLonLat: (a) => a,
		stringify: (a) => a, 
		transform: (a) => a 
	};

	const configServiceMock = {
		getValueAsPath: (v) => v
	};

	const mapServiceMock = { getSrid: () => 4326 };
	
	const setup = async (customState, config = {}) => {
		const state = {
			...testState,
			...customState
		};

		const { embed = false, isTouch = false } = config;

		TestUtils.setupStoreAndDi(state, {
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
			.registerSingleton('ConfigService', configServiceMock)
			.registerSingleton('MapService', mapServiceMock);
		return TestUtils.render(GeothermModuleContent.tag);
	};
	
	describe('class', () => {
		it('inherits from AbstractModuleContentPanel', async () => {
			const element = await setup();

			expect(element instanceof AbstractModuleContentPanel).toBeTrue();
		});
	});
	describe('when initialized', () => {
		it('first section is open', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#step1')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step1').open).toBeTruthy();

			expect(element.shadowRoot.querySelector('#step2')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeFalse();
			
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#kollektor')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#pumpe')).toHaveClass('unselected');

		});
	});
	describe('behavior', () => {
		it('opens section 2 on button click', async () => {
			const element = await setup();
			element.shadowRoot.querySelector('#kollektor').click();

			expect(element.shadowRoot.querySelector('#step1')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step1').open).toBeTrue();
//
			expect(element.shadowRoot.querySelector('#step2')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeTrue();

		//überprüfung der Anzeige via css Klassen kollektor ist activ, alle anderen buttons sind inactive
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('inactive');
			expect(element.shadowRoot.querySelector('#kollektor')).toHaveClass('active');
			expect(element.shadowRoot.querySelector('#pumpe')).toHaveClass('inactive');
			
		});
		it('click button 3 afterward click in map and expect change of state for all buttons to unselected', async () => {
			const element = await setup();

			element.shadowRoot.querySelector('#sonde').click();
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('active');
			
			setLocation([42, 24]);
			
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#kollektor')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#pumpe')).toHaveClass('unselected');
			
		})
		
	});
});
