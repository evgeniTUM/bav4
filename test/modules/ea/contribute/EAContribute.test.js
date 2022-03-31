import { $injector } from '../../../../src/injection';
import { EAContribute } from '../../../../src/modules/ea/components/contribute/EAContribute';
import { MvuElement } from '../../../../src/modules/MvuElement';
import { setTaggingMode } from '../../../../src/store/ea/contribute/contribute.action';
import { contributeReducer, initialState } from '../../../../src/store/ea/contribute/contribute.reducer';
import { modalReducer } from '../../../../src/store/modal/modal.reducer';
import { toolsReducer } from '../../../../src/store/tools/tools.reducer';
import { TestUtils } from '../../../test-utils';

window.customElements.define(EAContribute.tag, EAContribute);


describe('EAContribute', () => {
	let store;

	const testState = {
		contribute: initialState,
		tools: { current: EAContribute.tag }
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

		store = TestUtils.setupStoreAndDi(state, { contribute: contributeReducer, modal: modalReducer, tools: toolsReducer});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				getWindow: () => windowMock,
				isTouch: () => isTouch
			})
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('CoordinateService', coordinateServiceMock)
		return TestUtils.render(EAContribute.tag);
	};

	describe('class', () => {

		it('inherits from MvuElement', async () => {

			const element = await setup();

			expect(element instanceof MvuElement).toBeTrue();
		});

	});

	describe('when initialized and shown', () => {

		it('all fields are shown', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#description')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#coordinates')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#tag')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#select')).toBeTruthy();

		});

		it('shows no tag location when not present', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#coordinates').textContent).toEqual('');
		});

		it('shows tag location when present', async () => {
			const expectedCoordinates = [42.0, 24.0];
			const expectedCoordString = "expected";
			const toLonLatSpy = spyOn(coordinateServiceMock, 'toLonLat').and.returnValue({});
			spyOn(coordinateServiceMock, 'stringify').and.returnValue(expectedCoordString);

			const element = await setup({ contribute: { position: expectedCoordinates } });

			expect(toLonLatSpy).toHaveBeenCalledWith(expectedCoordinates);
			expect(element.shadowRoot.querySelector('#coordinates').textContent).toEqual(expectedCoordString);
		});

		it('sets the description, after changes in textarea', async () => {
			const newText = 'bar';
			const element = await setup({ contribute: { description: 'Foo' } });

			const descriptionTextArea = element.shadowRoot.querySelector('textarea');
			expect(descriptionTextArea).toBeTruthy();
			expect(descriptionTextArea.value).toBe('Foo');

			descriptionTextArea.value = newText;
			descriptionTextArea.dispatchEvent(new Event('input'));

			expect(store.getState().contribute.description).toBe(newText);
		});

		it('toggles tagging mode when tag button is clicked', async () => {
			const element = await setup();
			const tagButton = element.shadowRoot.querySelector('#tag');

			expect(store.getState().contribute.tagging).toBe(false);

			tagButton.click();

			expect(store.getState().contribute.tagging).toBe(true);

			tagButton.click();

			expect(store.getState().contribute.tagging).toBe(false);
		});

		it('changes button tittle when tagging mode is active', async () => {
			const element = await setup();
			const tagButton = element.shadowRoot.querySelector('#tag');

			setTaggingMode(false);
			expect(tagButton.label).toBe('ea_contribute_button_tag');

			setTaggingMode(true);
			expect(tagButton.label).toBe('ea_contribute_button_tag_cancel');
		});

	});


});
