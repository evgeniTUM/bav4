import { TestUtils } from '../../../test-utils';
import { $injector } from '../../../../src/injection';
import { EAContribute } from '../../../../src/modules/ea/components/contribute/EAContribute';
import { contributeReducer, initialState } from '../../../../src/store/ea/contribute/contribute.reducer';
import { modalReducer } from '../../../../src/store/modal/modal.reducer';
import { MvuElement } from '../../../../src/modules/MvuElement';

window.customElements.define(EAContribute.tag, EAContribute);


describe('EAContribute', () => {
	let store;

	const testState = { ...initialState, ...{ active: true } };
	const setup = async (customProperties, config = {}) => {
		const state = {
			contribute: { ...testState, ...customProperties }
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
		it('is shown when enabled', async () => {
			const element = await setup({ active: true });

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});

		it('is not shown when disabled', async () => {
			const element = await setup({ active: false });

			expect(element.shadowRoot.children.length).toBe(0);
		});
	});

	describe('when initialized and shown', () => {

		it('all fields are shown', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelector('#description')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#tag')).toBeTruthy();
			expect(element.shadowRoot.querySelector('#select')).toBeTruthy();

		});

		it('shows no tag location when not present', async () => {

		});

		it('shows tag location when present', async () => {
		});

		it('sets the description, after changes in textarea', async () => {
			const newText = 'bar';
			const element = await setup({ description: 'Foo' });

			const descriptionTextArea = element.shadowRoot.querySelector('textarea');
			expect(descriptionTextArea).toBeTruthy();
			expect(descriptionTextArea.value).toBe('Foo');

			descriptionTextArea.value = newText;
			descriptionTextArea.dispatchEvent(new Event('input'));

			expect(store.getState().contribute.description).toBe(newText);
		});



		it('activates tagging mode when tag button is clicked', async () => {
			const element = await setup();

			expect(store.getState().contribute.tagging).toBe(false);
			element.shadowRoot.querySelector('#tag').click();

			expect(store.getState().contribute.tagging).toBe(true);
		});
	});


});
