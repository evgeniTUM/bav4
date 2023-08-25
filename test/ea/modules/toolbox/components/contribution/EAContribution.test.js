import { GlobalCoordinateRepresentations } from '../../../../../../src/domain/coordinateRepresentation';
import { MODUS } from '../../../../../../src/ea/modules/toolbox/components/contribution/ContributionModus';
import { EAContribution } from '../../../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { setLocation, setTaggingMode } from '../../../../../../src/ea/store/contribution/contribution.action';
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
			{ name: 'field1', optional: false },
			{ name: 'field2', optional: true }
		]
	},
	{
		'ee-name': 'Test2',
		'ee-angaben': [{ name: 'field3', optional: true }]
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
		it('first section is open', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#step1')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step1').open).toBeTruthy();

			expect(element.shadowRoot.querySelector('#step2')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeFalse();

			expect(element.shadowRoot.querySelector('#step3')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step3').open).toBeFalse();

			expect(element.shadowRoot.querySelector('#step4')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step4').open).toBeFalse();
		});

		it('email, category and position are required inputs', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#mode-validation-element').validity.valid).toBeTrue();
			expect(element.shadowRoot.querySelector('#location-validation-element').validity.valid).toBeTrue();

			expect(element.shadowRoot.querySelector('#category').required).toBeTrue();
			expect(element.shadowRoot.querySelector('#email').required).toBeTrue();

			expect(element.shadowRoot.querySelector('#additional-info').required).toBeFalse();
		});

		it('resets position on activate', async () => {
			await setup({ contribution: { ...initialState, position: [4, 2] } });

			expect(store.getState().contribution.position).toEqual(null);
		});
	});

	describe('location handling', () => {
		it('uses tag location when present', async () => {
			const givenCoordinates = [42, 24];
			const expectedCoordString = '42.00000 24.00000';
			const stringifyMock = spyOn(coordinateServiceMock, 'stringify').and.returnValue(expectedCoordString);

			const element = await setup();

			element.shadowRoot.querySelector('#new').click();
			setLocation(givenCoordinates);

			expect(stringifyMock).toHaveBeenCalledWith([42, 24], GlobalCoordinateRepresentations.WGS84, { digits: 5 });
		});

		it('activates tagging mode after contribution mode is selected', async () => {
			const element = await setup();
			const newButton = element.shadowRoot.querySelector('#new');

			expect(store.getState().contribution.tagging).toBe(false);

			newButton.click();

			expect(store.getState().contribution.tagging).toBe(true);
		});

		it('jumps to step3 and deactivates tagging mode when coordinates are selected', async () => {
			jasmine.clock().install();

			const element = await setup();
			const tagButton = element.shadowRoot.querySelector('#new');

			tagButton.click();
			expect(store.getState().contribution.tagging).toBe(true);

			setLocation([42, 24]);
			jasmine.clock().tick(500);

			expect(store.getState().contribution.tagging).toBe(false);
			expect(element.shadowRoot.querySelector('#step3').open).toBeTrue();

			jasmine.clock().uninstall();
		});
	});

	it('opens the research module when "find" button is clicked', async () => {
		const element = await setup();
		element.mode = MODUS.market;
		const findButton = element.shadowRoot.querySelector('#search');

		findButton.click();

		expect(store.getState().ea.currentModule).toEqual('recherche');
	});

	describe('selection handling', () => {
		it('shows corresponding input fiels for each category', async () => {
			const element = await setup();
			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			expect(query('#step4').querySelectorAll('input').length).toBe(0);

			query('#category').value = 'Test1';
			query('#category').dispatchEvent(new Event('change'));

			expect(query('#step4').querySelectorAll('input').length).toBe(2);

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

			expect(query('#step4').querySelectorAll('input').length).toBe(1);

			const field3 = query('[name="field3"]');
			expect(field3.placeholder).toBe('field3');
			expect(field3.required).toBeFalse();
			expect(field3.type).toBe('text');
		});

		it('opens section 3 when coordinates are selected', async () => {
			const element = await setup();
			element.categories = SAMPLE_JSON_SPEC;

			setLocation([42, 24]);

			expect(element.shadowRoot.querySelector('#step1').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step3').open).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step4').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step5').open).toBeFalsy();
		});

		it('opens section 3 when category is selected', async () => {
			const element = await setup();
			element.categories = SAMPLE_JSON_SPEC;

			const selectBox = element.shadowRoot.querySelector('#category');
			selectBox.value = 'Test2';
			selectBox.dispatchEvent(new Event('change'));

			expect(element.shadowRoot.querySelector('#step1').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step2').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step3').open).toBeFalsy();
			expect(element.shadowRoot.querySelector('#step4').open).toBeTruthy();
			expect(element.shadowRoot.querySelector('#step5').open).toBeFalsy();
		});

		it('shows only one text area when correction mode', async () => {
			const element = await setup();
			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			query('#correction').click();

			query('#category').value = 'Test1';
			query('#category').dispatchEvent(new Event('change'));

			expect(query('#step3').querySelectorAll('input').length).toBe(0);
			expect(query('#step3').querySelectorAll('textaread').length).toBe(0);

			const textArea = query('textarea');
			expect(textArea.placeholder).toBe('Bitte hier Korrektur eintragen');
			expect(textArea.required).toBeTrue();
		});
	});

	describe('mode energy-reporting', () => {
		it('does not show find button', async () => {
			const element = await setup();
			element.mode = MODUS.report;

			const findButton = element.shadowRoot.querySelector('#search');

			expect(findButton).toBeNull();
		});

		it('on submit, sends correct reportType for mode energy-reporting', async () => {
			const expectedEmail = 'testicus@domainicus.com';
			const expectedCoordinates = [4, 2];
			const expectedCategory = 'Test1';

			const postSpy = spyOn(httpServiceMock, 'post').and.returnValue({ status: 200 });

			const element = await setup();

			element.mode = MODUS.report;
			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			setLocation(expectedCoordinates);

			query('#category').value = expectedCategory;
			query('#category').dispatchEvent(new Event('change'));

			query('[name="field1"]').value = 'text1';
			query('[name="field1"]').dispatchEvent(new Event('input'));
			query('[name="field2"]').value = 'text2';
			query('[name="field2"]').dispatchEvent(new Event('input'));

			query('#email').value = expectedEmail;
			query('#email').dispatchEvent(new Event('input'));

			query('#send').click();
			await TestUtils.timeout();

			expect(postSpy).toHaveBeenCalledWith(
				'BACKEND_URLreport/message',
				JSON.stringify({
					reportType: 'Neumeldung',
					coordinates: expectedCoordinates,
					additionalInfo: '',
					email: expectedEmail,
					category: expectedCategory,
					categoryData: 'field1: text1\nfield2: text2'
				}),
				'application/json'
			);

			expect(element.shadowRoot.querySelectorAll('collapsable-content').length).toBe(0);
			expect(element.shadowRoot.querySelector('#completion-message')).not.toBeNull();
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

		it('on submit, sends POST request and shows completion message', async () => {
			const expectedEmail = 'testicus@domainicus.com';
			const expectedCoordinates = [4, 2];
			const expectedInfo = 'additionalIfno';
			const expectedCategory = 'Test1';

			const postSpy = spyOn(httpServiceMock, 'post').and.returnValue({ status: 200 });

			const element = await setup();
			element.mode = MODUS.market;

			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			setLocation(expectedCoordinates);

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
			await TestUtils.timeout();

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

			expect(element.shadowRoot.querySelectorAll('collapsable-content').length).toBe(0);
			expect(element.shadowRoot.querySelector('#completion-message')).not.toBeNull();
		});

		it('shows failure message when reponse code is not 200', async () => {
			spyOn(httpServiceMock, 'post').and.returnValue({ status: 201 });

			const element = await setup();

			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			query('#new').click();

			setLocation([42, 0]);

			query('#category').value = 'Test2';
			query('#category').dispatchEvent(new Event('change'));

			query('#email').value = 'test@mail.com';
			query('#email').dispatchEvent(new Event('input'));

			query('#send').click();
			await TestUtils.timeout();

			expect(element.shadowRoot.querySelectorAll('collapsable-content').length).toBe(0);
			expect(element.shadowRoot.querySelector('#failure-message')).not.toBeNull();
		});

		it('resets model on back button after submit', async () => {
			spyOn(httpServiceMock, 'post').and.returnValue({ status: 200 });

			const element = await setup();
			element.mode = MODUS.report;

			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			query('#new').click();
			setLocation([42, 2]);

			query('#category').value = 'Test2';
			query('#category').dispatchEvent(new Event('change'));

			query('#email').value = 'test@abc.com';
			query('#email').dispatchEvent(new Event('input'));

			query('#send').click();
			await TestUtils.timeout();

			expect(element.shadowRoot.querySelector('#completion-message')).not.toBeNull();
			const backButton = element.shadowRoot.querySelector('#back');
			expect(backButton).toBeTruthy();

			backButton.click();

			expect(element.shadowRoot.querySelectorAll('collapsable-content').length).toBe(5);
			expect(element.shadowRoot.querySelector('#failure-message')).toBeNull();

			expect(element.getModel().mode).toBeUndefined();
			expect(element.getModel().categoriesSpecification).toEqual(SAMPLE_JSON_SPEC);

			expect(store.getState().contribution.tagging).toBeFalse();
			expect(store.getState().contribution.position).toBeNull();
		});

		it('resets categoryFields after category change', async () => {
			const element = await setup();
			element.mode = MODUS.report;

			element.categories = SAMPLE_JSON_SPEC;

			const query = (query) => element.shadowRoot.querySelector(query);

			query('#category').value = 'Test1';
			query('#category').dispatchEvent(new Event('change'));
			query('[name="field1"]').value = 'text1';
			query('[name="field1"]').dispatchEvent(new Event('input'));

			query('#category').value = 'Test2';
			query('#category').dispatchEvent(new Event('change'));
			query('[name="field3"]').value = 'text3';
			query('[name="field3"]').dispatchEvent(new Event('input'));

			expect(element.getModel().categoryFields).toEqual({
				field3: 'text3'
			});
		});
	});
});
