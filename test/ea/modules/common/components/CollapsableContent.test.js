import { CollapsableContent } from '../../../../../src/ea/modules/common/components/CollapsableContent';
import { AbstractMvuContentPanel } from '../../../../../src/modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../../src/utils/markup';
import { TestUtils } from '../../../../test-utils';

window.customElements.define(CollapsableContent.tag, CollapsableContent);


describe('CollapsableContent', () => {

	beforeEach(async () => {
		TestUtils.setupStoreAndDi({});
	});

	describe('when initialized', () => {
		it('extends AbstractMvuContentPanel', async () => {
			const element = await TestUtils.render(CollapsableContent.tag);

			expect(element instanceof AbstractMvuContentPanel).toBeTrue();
		});

		it('contains default values in the model', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);

			//model
			expect(element.disabled).toBeFalse();
			expect(element.title).toBe('title');
			expect(element.open).toBe(false);
		});

		it('renders the view', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);

			//view
			const section = element.shadowRoot.querySelector('div');
			expect(section.classList.contains('ba-section')).toBeTrue();
			expect(section.classList.contains('disabled')).toBeFalse();
		});

		it('automatically appends the "data-test-id" attribute', async () => {
			expect((await TestUtils.render(CollapsableContent.tag)).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('');
		});

		it('uses attributes \'title\'', async () => {
			const element = await TestUtils.render(CollapsableContent.tag, { title: 'title42' });
			const header = element.shadowRoot.querySelector('.header');

			expect(header.innerText.trim()).toBe('title42');

		});
	});

	describe('when property\'disabled\' changes', () => {

		it('updates the view', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);
			const section = element.shadowRoot.querySelector('div');

			expect(section.classList.contains('disabled')).toBeFalse();

			element.disabled = true;

			expect(section.classList.contains('disabled')).toBeTrue();

			element.disabled = false;

			expect(section.classList.contains('disabled')).toBeFalse();
		});
	});

	describe('when property\'title\' changes', () => {

		it('updates the view', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);
			const header = element.shadowRoot.querySelector('.header');

			expect(header.innerText.trim()).toBe('title');

			element.title = 'foo';

			expect(header.innerText.trim()).toBe('foo');
		});
	});

	describe('when property\'open\' changes', () => {

		it('updates the view', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);
			const content = element.shadowRoot.querySelector('.content');
			const headerIcon = element.shadowRoot.querySelector('.icon');

			expect(content.classList.contains('collapsed')).toBeTrue();
			expect(headerIcon.classList.contains('iconexpand')).toBeFalse();

			element.open = true;

			expect(content.classList.contains('collapsed')).toBeFalse();
			expect(headerIcon.classList.contains('iconexpand')).toBeTrue();
		});
	});


	describe('when header is clicked', () => {

		it('toggles the open property', async () => {

			const element = await TestUtils.render(CollapsableContent.tag);

			const button = element.shadowRoot.querySelector('button');

			expect(element.open).toBeFalse();

			button.click();

			expect(element.open).toBeTrue();
		});

	});
});
