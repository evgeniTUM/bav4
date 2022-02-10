import { TestUtils } from '../../../test-utils';
import { $injector } from '../../../../src/injection';
import { EAContribute } from '../../../../src/modules/ea/components/contribute/EAContribute';
import { contributeReducer } from '../../../../src/store/ea/contribute/contribute.reducer';
import { modalReducer } from '../../../../src/store/modal/modal.reducer';
import { MvuElement } from '../../../../src/modules/MvuElement';

window.customElements.define(EAContribute.tag, EAContribute);


describe('EAContribute', () => {
	let store;

	const defaultState = {
		coordinates: "",
		email: "",
		text: ""
	};

	const setup = async (contributeState = {}, config = {}) => {
		const state = {
			contribute: contributeState
		};

		const { embed = false, isTouch = false } = config;

		store = TestUtils.setupStoreAndDi(state, { contribute: contributeReducer, modal: modalReducer });
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				getWindow: () => windowMock,
				isTouch: () => isTouch
			})
			.registerSingleton('TranslationService', { translate: (key) => key })
		return TestUtils.render(EAContribute.tag);
	};

	describe('class', () => {

		it('inherits from MvuElement', async () => {

			const element = await setup();

			expect(element instanceof MvuElement).toBeTrue();
		});

	});

	describe('when initialized', () => {

		it('all fields are shown', async () => {
			const element = await setup(defaultState);

			expect(element.shadowRoot.querySelector('textarea')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#mark')).toBeTruthy();

		});

		it('sets the description, after description changes in textarea', async () => {
			const newText = 'bar';
			const element = await setup({ ...defaultState, description: 'Foo' });

			const descriptionTextArea = element.shadowRoot.querySelector('textarea');
			expect(descriptionTextArea).toBeTruthy();
			expect(descriptionTextArea.value).toBe('Foo');

			descriptionTextArea.value = newText;
			descriptionTextArea.dispatchEvent(new Event('input'));

			expect(store.getState().contribute.description).toBe(newText);
		});


	});

});
