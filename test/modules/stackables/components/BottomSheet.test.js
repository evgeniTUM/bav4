import { BottomSheet } from '../../../../src/modules/stackables/components/BottomSheet';

import { TestUtils } from '../../../test-utils';

import { html } from 'lit-html';

import { TEST_ID_ATTRIBUTE_NAME } from '../../../../src/utils/markup';

window.customElements.define(BottomSheet.tag, BottomSheet);

describe('BottomSheet', () => {

	const setup = async (content, state = {}) => {

		const initialState = {
			mainMenu: {
				open: false
			},
			media: {
				portrait: false
			},
			...state
		};

		TestUtils.setupStoreAndDi(initialState);

		const element = await TestUtils.render(BottomSheet.tag);
		element.content = content;
		return element;
	};

	describe('constructor', () => {
		TestUtils.setupStoreAndDi({});
		it('sets a default model', async () => {
			const element = new BottomSheet();

			expect(element.getModel()).toEqual({
				content: null,
				open: false,
				portrait: false
			});
		});
	});

	describe('when initialized', () => {

		it('renders nothing when no data available', async () => {
			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});
	});

	describe('when BottomSheet is rendered', () => {

		it('displays the bottom sheet content', async () => {
			const element = await setup('FooBar');
			const contentElement = element.shadowRoot.querySelector('.bottom-sheet');

			expect(contentElement.innerText).toContain('FooBar');
			expect(element.shadowRoot.querySelectorAll(`[${TEST_ID_ATTRIBUTE_NAME}]`)).toHaveSize(1);
		});

		it('displays the bottom sheet content from a lit-html template-result', async () => {
			const template = (str) => html`${str}`;

			const element = await setup(template('FooBarBaz'));
			const contentElement = element.shadowRoot.querySelector('.bottom-sheet');

			expect(contentElement.innerText).toMatch(/FooBarBaz[\r\n]?/);
		});
	});

	describe('responsive layout ', () => {

		it('layouts for landscape and open Menu', async () => {
			const element = await setup('FooBar', { mainMenu: { open: true }, media: { portrait: false } });
			const contentElement = element.shadowRoot.querySelector('.bottom-sheet');

			expect(contentElement.innerText).toContain('FooBar');
			expect(element.shadowRoot.querySelectorAll(`[${TEST_ID_ATTRIBUTE_NAME}]`)).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('.bottom-sheet.is-open')).toHaveSize(1);
		});

		it('layouts for landscape and closed Menu', async () => {
			const element = await setup('FooBar', { mainMenu: { open: false }, media: { portrait: true } });
			const contentElement = element.shadowRoot.querySelector('.bottom-sheet');

			expect(contentElement.innerText).toContain('FooBar');
			expect(element.shadowRoot.querySelectorAll(`[${TEST_ID_ATTRIBUTE_NAME}]`)).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('.bottom-sheet.is-open')).toHaveSize(0);
		});

		it('layouts for portrait and open Menu', async () => {
			const element = await setup('FooBar', { mainMenu: { open: true }, media: { portrait: true } });
			const contentElement = element.shadowRoot.querySelector('.bottom-sheet');

			expect(contentElement.innerText).toContain('FooBar');
			expect(element.shadowRoot.querySelectorAll(`[${TEST_ID_ATTRIBUTE_NAME}]`)).toHaveSize(1);
			expect(element.shadowRoot.querySelectorAll('.bottom-sheet.is-open')).toHaveSize(0);
		});
	});


});
