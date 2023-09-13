import { TestUtils } from '../../../../../test-utils';
import { GeothermModuleContent } from '../../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { AbstractModuleContentPanel } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { initialState, locationSelection } from '../../../../../../src/ea/store/locationSelection/locationSelection.reducer';
import { setLocation } from '../../../../../../src/ea/store/locationSelection/locationSelection.action';
import { GlobalCoordinateRepresentations } from '../../../../../../src/domain/coordinateRepresentation';

window.customElements.define(GeothermModuleContent.tag, GeothermModuleContent);

describe('GeothermModuleContent', () => {
	const testState = {
		locationSelection: initialState,
		tools: { current: GeothermModuleContent.tag }
	};

	const coordinateServiceMock = {
		toLonLat: (a) => a,
		stringify: (a) => a,
		transform: (a) => a
	};

	const configServiceMock = {
		getValueAsPath: (v) => v,
		getValue() {}
	};

	const mapServiceMock = {
		getSrid: () => 4326,
		getLocalProjectedSrid: () => 4326,
		getCoordinateRepresentations: (a) => a
	};

	const setup = async (customState, config = {}) => {
		const state = {
			...testState,
			...customState
		};

		const { embed = false, isTouch = false } = config;

		TestUtils.setupStoreAndDi(state, {
			locationSelection: locationSelection,
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
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#kollektor')).toHaveClass('active');
			expect(element.shadowRoot.querySelector('#pumpe')).toHaveClass('unselected');
		});
		it('click button 3 afterward click in map and expect change of state for all buttons to unselected', async () => {
			const givenCoordinates = [42.42, 24.24];
			const windowOpenSpy = spyOn(window, 'open');
			spyOn(configServiceMock, 'getValue').withArgs('GEOTHERM_CHECK_URL_SONDEN').and.returnValue('https://geotherm_check_url_sonden/');
			spyOn(coordinateServiceMock, 'stringify')
				.withArgs(givenCoordinates, GlobalCoordinateRepresentations.WGS84, { digits: 5 })
				.and.returnValue('42.42000,24.24000');
			const expectedUrl = 'https://geotherm_check_url_sonden/&location=42.42000,24.24000';

			const element = await setup();

			element.shadowRoot.querySelector('#sonde').click();
			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('active');

			setLocation(givenCoordinates);

			expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank');

			expect(element.shadowRoot.querySelector('#sonde')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#kollektor')).toHaveClass('unselected');
			expect(element.shadowRoot.querySelector('#pumpe')).toHaveClass('unselected');

			expect(element.shadowRoot.querySelector('#step2')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeFalse();
		});
	});
});
