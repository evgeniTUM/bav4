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


describe('EAContributon', () => {
	let store;

	const testState = {
		contribution: initialState,
		tools: { current: EAContribution.tag }
	};

	const coordinateServiceMock = {
		toLonLat() { },
		stringify() { }
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
			.registerSingleton('CoordinateService', coordinateServiceMock);
		return TestUtils.render(EAContribution.tag);
	};

	describe('class', () => {

		it('inherits from Ab', async () => {

			const element = await setup();

			expect(element instanceof AbstractMvuContentPanel).toBeTrue();
		});

	});

	describe('when initialized and shown', () => {

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

		it('sets the description, after changes in textarea', async () => {
			const newText = 'bar';
			const element = await setup({ contribution: { description: 'Foo' } });

			const descriptionTextArea = element.shadowRoot.querySelector('textarea');
			expect(descriptionTextArea).toBeTruthy();
			expect(descriptionTextArea.value).toBe('Foo');

			descriptionTextArea.value = newText;
			descriptionTextArea.dispatchEvent(new Event('input'));

			expect(store.getState().contribution.description).toBe(newText);
		});

		it('toggles tagging mode when "search" button is clicked', async () => {
			const element = await setup();
			const tagButton = element.shadowRoot.querySelector('#search');

			tagButton.click();

			expect(store.getState().ea.currentModule).toEqual('recherche');
		});

		it('opens research module when "tag" button is clicked', async () => {
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
			expect(tagButton.title).toBe('ea_contribution_button_tag');
			expect(tagButton.innerText).toBe('ea_contribution_button_tag');

			setTaggingMode(true);
			// expect(tagButton.title).toBe('ea_contribution_button_tag_cancel');
			expect(tagButton.innerText).toBe('ea_contribution_button_tag_cancel');
		});

	});


});
