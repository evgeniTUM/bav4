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
			{ 'name': 'field1', 'optional': false },
			{ 'name': 'field2', 'optional': true }
		]
	},
	{
		'ee-name': 'Test2',
		'ee-angaben': [
			{ 'name': 'field3', 'optional': true }
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

	const httpServiceMock = {
		post: () => {}
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
			.registerSingleton('HttpService', httpServiceMock)
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

		it('email, category and position are required inputs', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#coordinates').required).toBeTrue();
			expect(element.shadowRoot.querySelector('#category').required).toBeTrue();
			expect(element.shadowRoot.querySelector('#email').required).toBeTrue();

			expect(element.shadowRoot.querySelector('#additional-info').required).toBeFalse();
		});
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


	describe('selection handling', () => {
		it('shows corresponding input fiels for each category', async () => {
			const element = await setup();
			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			expect(query('#step3').querySelectorAll('input').length).toBe(0);


			query('#category').value = 'Test1';
			query('#category').dispatchEvent(new Event('change'));

			expect(query('#step3').querySelectorAll('input').length).toBe(2);

			const field1 = query('[name="field1"]');
			expect(field1.placeholder).toBe('field1*');
			expect(field1.required).toBeTrue();
			expect(field1.type).toBe('text');

			const field2 = query('[name="field2"]');
			expect(field2.placeholder).toBe('field2');
			expect(field2.required).toBeFalse();
			expect(field2.type).toBe('text');


			query('#category').value = 'Test2';
			query('#category').dispatchEvent(new Event('change'));

			expect(query('#step3').querySelectorAll('input').length).toBe(1);

			const field3 = query('[name="field3"]');
			expect(field3.placeholder).toBe('field3');
			expect(field3.required).toBeFalse();
			expect(field3.type).toBe('text');
		});
	});


	describe('submit handling', () => {
		it('does not sumbit on validation errors', async () => {
			const element = await setup();
			const postSpy = spyOn(httpServiceMock, 'post').and.returnValue({ text: async () => 'text' });

			expect(element.shadowRoot.querySelector('#report').checkValidity()).toBeFalse();
			element.shadowRoot.querySelector('#send').click();

			expect(postSpy).not.toHaveBeenCalled();
		});

		it('shows validation CSS after first submit click', async () => {
			const element = await setup();

			expect(element.getModel().showInvalidFields).toBeFalse();

			element.shadowRoot.querySelector('#send').click();

			expect(element.getModel().showInvalidFields).toBeTrue();
		});

		it('on submit, sends POST request closes module and shows completion message', async () => {
			const expectedEmail = 'testicus@domainicus.com';
			const expectedCoordinates = [4, 2];
			const expectedInfo = 'additionalIfno';
			const expectedCategory = 'Test1';

			const postSpy = spyOn(httpServiceMock, 'post').and.returnValue({ text: async () => 'text' });

			const element = await setup({ contribution: { position: expectedCoordinates } });

			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			query('#category').value = expectedCategory;
			query('#category').dispatchEvent(new Event('change'));

			query('[name="field1"]').value = 'text1';
			query('[name="field1"]').dispatchEvent(new Event('input'));
			query('[name="field2"]').value = 'text2';
			query('[name="field2"]').dispatchEvent(new Event('input'));
			query('#additional-info').value = expectedInfo;
			query('#additional-info').dispatchEvent(new Event('input'));

			query('#email').value = expectedEmail;
			query('#email').dispatchEvent(new Event('input'));

			query('#send').click();

			expect(postSpy).toHaveBeenCalledWith(
				'BACKEND_URLreport/message',
				JSON.stringify({
					reportType: 'Börse',
					coordinates: expectedCoordinates,
					additionalInfo: expectedInfo,
					email: expectedEmail,
					category: expectedCategory,
					categoryData: 'field1: text1\nfield2: text2'
				}),
				'application/json'
			);

			expect(store.getState().ea.currentModule).toBeNull();

		});

	});

});
