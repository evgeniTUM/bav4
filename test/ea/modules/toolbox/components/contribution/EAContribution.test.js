import { EAContribution } from '../../../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { setTaggingMode } from '../../../../../../src/ea/store/contribution/contribution.action';
import { contributionReducer, initialState } from '../../../../../../src/ea/store/contribution/contribution.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { AbstractMvuContentPanel } from '../../../../../../src/modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';
import { toolsReducer } from '../../../../../../src/store/tools/tools.reducer';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(EAContribution.tag, EAContribution);

const SAMPLE_JSON_SPEC = [
	{
		'ee-name': 'Test1',
		'ee-angaben': [
			{
				'name': 'required', 'optional': false
			},
			{
				'name': 'optional', 'optional': true
			}
		]
	},
	{
		'ee-name': 'Test2',
		'ee-angaben': [
			{
				'name': 'other', 'optional': true
			}
		]
	}
];


describe('EAContributon', () => {
	let store;

	const testState = {
		contribution: initialState,
		tools: { current: EAContribution.tag }
	};

	const coordinateServiceMock = {
		toLonLat: (a) => a,
		stringify: (a) => a
	};

	const configServiceMock = {
		getValueAsPath: (v) => v
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
		return TestUtils.render(EAContribution.tag);
	};

	describe('class', () => {

		it('inherits from AbstractMvuContentPanel', async () => {

			const element = await setup();

			expect(element instanceof AbstractMvuContentPanel).toBeTrue();
		});

	});

	describe('when initialized', () => {

		it('all sections are shown expanded', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#step1')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step1').open).toBeTruthy();

			expect(element.shadowRoot.querySelector('#step2')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeTruthy();

			expect(element.shadowRoot.querySelector('#step3')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step3').open).toBeTruthy();

			expect(element.shadowRoot.querySelector('#step4')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step4').open).toBeTruthy();

		});
		describe('location handling', () => {

			it('shows no tag location when not present', async () => {
				const element = await setup();

				expect(element.shadowRoot.querySelector('.coordinates').value).toEqual('');
			});

			it('shows tag location when present', async () => {
				const expectedCoordinates = [42.0, 24.0];
				const expectedCoordString = 'expected';
				const toLonLatSpy = spyOn(coordinateServiceMock, 'toLonLat').and.returnValue({});
				spyOn(coordinateServiceMock, 'stringify').and.returnValue(expectedCoordString);

				const element = await setup({ contribution: { position: expectedCoordinates } });

				expect(toLonLatSpy).toHaveBeenCalledWith(expectedCoordinates);
				expect(element.shadowRoot.querySelector('.coordinates').value).toEqual(expectedCoordString);
			});

			it('toggles tagging mode inside the map when "tag" button is clicked', async () => {
				const element = await setup();
				const tagButton = element.shadowRoot.querySelector('#tag');

				expect(store.getState().contribution.tagging).toBe(false);

				tagButton.click();

				expect(store.getState().contribution.tagging).toBe(true);

				tagButton.click();

				expect(store.getState().contribution.tagging).toBe(false);
			});


			it('changes button tittle when tagging mode is active', async () => {
				const element = await setup();
				const tagButton = element.shadowRoot.querySelector('#tag');

				setTaggingMode(false);
				expect(tagButton.title).toBe('ea_contribution_button_tag_title');
				expect(tagButton.innerText).toBe('ea_contribution_button_tag_title\nea_contribution_button_tag_text');

				setTaggingMode(true);
				expect(tagButton.title).toBe('ea_contribution_button_tag_cancel');
				expect(tagButton.innerText).toBe('ea_contribution_button_tag_cancel\nea_contribution_button_tag_text');
			});

		});

		it('opens the research module when "find" button is clicked', async () => {
			const element = await setup();
			const tagButton = element.shadowRoot.querySelector('#search');

			tagButton.click();

			expect(store.getState().ea.currentModule).toEqual('recherche');
		});


		it('changes category fields on category change', async () => {
			const element = await setup();
			element.shadowRoot.querySelector('#tag');


		});

		it('sends POST request on submit', async () => {
			const element = await setup({ contribution: { position: [4, 2] } });


		});

	});


});
