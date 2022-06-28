import { html } from 'lit-html';
import { BaElement } from '../../src/modules/BaElement';
import { MvuElement } from '../../src/modules/MvuElement';
import { calculateWorkingArea, decodeHtmlEntities, findAllByAttribute, forEachByAttribute, TEST_ID_ATTRIBUTE_NAME } from '../../src/utils/markup';
import { TestUtils } from '../test-utils';

class MvuElementParent extends MvuElement {

	createView() {
		return html`
			<div id='id' data-test-id></div>
			<div class='class foo' data-test-id></div>
			<div data-test-id></div>
			<mvu-element-child data-test-id id='id'></mvu-element-child>
			<mvu-element-child data-test-id class='class'></mvu-element-child>
			<div id='id'></div>
			<div class='class foo'></div>
			<div></div>
			<mvu-element-child></mvu-element-child>
			`;
	}

	static get tag() {
		return 'mvu-element-parent';
	}
}

class MvuElementChild extends MvuElement {

	createView() {
		return html`<div id='id' data-test-id></div>`;
	}

	static get tag() {
		return 'mvu-element-child';
	}
}

window.customElements.define(MvuElementParent.tag, MvuElementParent);
window.customElements.define(MvuElementChild.tag, MvuElementChild);

class BaElementParent extends BaElement {

	createView() {
		return html`
			<div id='id' data-test-id></div>
			<div class='class foo' data-test-id></div>
			<div data-test-id></div>
			<ba-element-child data-test-id id='id'></ba-element-child>
			<ba-element-child data-test-id class='class'></ba-element-child>
			<div id='id'></div>
			<div class='class foo'></div>
			<div></div>
			<ba-element-child></ba-element-child>
			`;
	}

	static get tag() {
		return 'ba-element-parent';
	}
}

class BaElementChild extends BaElement {

	createView() {
		return html``;
	}

	static get tag() {
		return 'ba-element-child';
	}
}
window.customElements.define(BaElementParent.tag, BaElementParent);
window.customElements.define(BaElementChild.tag, BaElementChild);

describe('markup utils', () => {
	describe('constants', () => {

		it('provides an attribute name for test ids', () => {
			expect(TEST_ID_ATTRIBUTE_NAME).toBe('data-test-id');
		});
	});

	describe('constants', () => {

		beforeEach(() => {
			TestUtils.setupStoreAndDi();
		});

		afterEach(() => {
			window.ba_enableTestIds = undefined;
		});

		describe('generateTestIds for MvuElements', () => {

			it('provides the correct test id for MvuElements', async () => {
				window.ba_enableTestIds = true;
				const warnSpy = spyOn(console, 'warn');
				const element = await TestUtils.render(MvuElementParent.tag, { 'data-test-id': '' });

				const divElements = element.shadowRoot.querySelectorAll('div');
				const mvuChildElements = element.shadowRoot.querySelectorAll(MvuElementChild.tag);

				expect(element.getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('mvu-element-parent-0');
				expect(divElements).toHaveSize(6);
				expect(divElements.item(0).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('mvu-element-parent-0_id');
				expect(divElements.item(1).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('mvu-element-parent-0_class-foo');
				expect(warnSpy).toHaveBeenCalledOnceWith('No data-test-id qualifier found for: mvu-element-parent-0 -> div. Please add either an id or a class attribute.');
				expect(divElements.item(3).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(divElements.item(4).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(divElements.item(5).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(mvuChildElements).toHaveSize(3);
				expect(mvuChildElements.item(0).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('mvu-element-parent-0_mvu-element-child-0');
				expect(mvuChildElements.item(1).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('mvu-element-parent-0_mvu-element-child-1');
				expect(mvuChildElements.item(2).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
			});

			it('does nothing', async () => {
				const element = await TestUtils.render(MvuElementParent.tag, { 'data-test-id': '' });

				const all = [...element.shadowRoot.querySelectorAll('div'), ...element.shadowRoot.querySelectorAll(MvuElementChild.tag)];

				expect(all).toHaveSize(9);
				all.forEach(el => {
					expect(el.getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalsy();
				});
			});
		});

		describe('generateTestIds for BaElements', () => {

			it('provides the correct test id for MvuElements', async () => {
				window.ba_enableTestIds = true;
				const warnSpy = spyOn(console, 'warn');
				const element = await TestUtils.render(BaElementParent.tag, { 'data-test-id': '' });

				const divElements = element.shadowRoot.querySelectorAll('div');
				const baChildElements = element.shadowRoot.querySelectorAll(BaElementChild.tag);

				expect(element.getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('ba-element-parent-0');
				expect(divElements).toHaveSize(6);
				expect(divElements.item(0).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('ba-element-parent-0_id');
				expect(divElements.item(1).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('ba-element-parent-0_class-foo');
				expect(warnSpy).toHaveBeenCalledOnceWith('No data-test-id qualifier found for: ba-element-parent-0 -> div. Please add either an id or a class attribute.');
				expect(divElements.item(3).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(divElements.item(4).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(divElements.item(5).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
				expect(baChildElements).toHaveSize(3);
				expect(baChildElements.item(0).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('ba-element-parent-0_ba-element-child-0');
				expect(baChildElements.item(1).getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBe('ba-element-parent-0_ba-element-child-1');
				expect(baChildElements.item(2).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalse();
			});

			it('does nothing', async () => {
				const element = await TestUtils.render(BaElementParent.tag, { 'data-test-id': '' });

				const all = [...element.shadowRoot.querySelectorAll('div'), ...element.shadowRoot.querySelectorAll(BaElementChild.tag)];

				expect(all).toHaveSize(9);
				all.forEach(el => {
					expect(el.getAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeFalsy();
				});
			});
		});
	});

	describe('decodeHtmlEntities', () => {
		it('decodes text from html-content', () => {
			expect(decodeHtmlEntities('&sup2;')).toBe('²');
			expect(decodeHtmlEntities('&sup3;')).toBe('³');
			expect(decodeHtmlEntities('<b>foo</b>')).toBe('foo');
			expect(decodeHtmlEntities('<div class="foo">bar</div>')).toBe('bar');
		});

		it('ignores js-code', () => {
			const spy = spyOn(window, 'alert');
			const decoded = decodeHtmlEntities('<img src="dummy" onerror="alert(\'called\')")');
			expect(spy).not.toHaveBeenCalled();
			expect(decoded).toBe('');
		});
	});

	fdescribe('calculateWorkingArea', () => {

		it('subtract one element rect from workingArea', () => {
			const baseMock = { getBoundingClientRect: () => DOMRect.fromRect({ x: 0, y: 0, width: 1000, height: 1000 }) };
			const dirtyElementsMock = [{ getBoundingClientRect: () => DOMRect.fromRect({ x: 50, y: 50, width: 100, height: 100 }) }];

			const result = calculateWorkingArea(baseMock, dirtyElementsMock);

			expect(result.left).toBe(150);
			expect(result.top).toBe(0);
			expect(result.right).toBe(1000);
			expect(result.bottom).toBe(1000);
		});

		it('subtract overlapping element-rects from workingArea', () => {
			const baseMock = { getBoundingClientRect: () => DOMRect.fromRect({ x: 0, y: 0, width: 1000, height: 1000 }) };
			const dirtyElementsMock = [
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 50, y: 50, width: 100, height: 100 }) },
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 75, y: 75, width: 75, height: 75 }) }
			];

			const result = calculateWorkingArea(baseMock, dirtyElementsMock);

			expect(result.left).toBe(150);
			expect(result.top).toBe(0);
			expect(result.right).toBe(1000);
			expect(result.bottom).toBe(1000);
		});


		it('subtract disjoint element-rects from workingArea', () => {
			const baseMock = { getBoundingClientRect: () => DOMRect.fromRect({ x: 0, y: 0, width: 1000, height: 1000 }) };
			const dirtyElementsMock = [
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 50, y: 50, width: 100, height: 100 }) },
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 800, y: 800, width: 100, height: 100 }) }
			];

			const result = calculateWorkingArea(baseMock, dirtyElementsMock);

			expect(result.left).toBe(150);
			expect(result.top).toBe(0);
			expect(result.right).toBe(800);
			expect(result.bottom).toBe(1000);
		});

		it('subtract partially overlapping element-rects from workingArea', () => {
			const baseMock = { getBoundingClientRect: () => DOMRect.fromRect({ x: 0, y: 0, width: 1000, height: 1000 }) };
			const dirtyElementsMock = [
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 50, y: 50, width: 100, height: 100 }) },
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 50, y: 100, width: 100, height: 100 }) }
			];

			const result = calculateWorkingArea(baseMock, dirtyElementsMock);

			expect(result.left).toBe(150);
			expect(result.top).toBe(0);
			expect(result.right).toBe(1000);
			expect(result.bottom).toBe(1000);
		});

		it('subtract centered element-rect from workingArea', () => {
			const baseMock = { getBoundingClientRect: () => DOMRect.fromRect({ x: 0, y: 0, width: 1000, height: 1000 }) };
			const dirtyElementsMock = [
				{ getBoundingClientRect: () => DOMRect.fromRect({ x: 450, y: 450, width: 100, height: 100 }) }
			];

			const result = calculateWorkingArea(baseMock, dirtyElementsMock);

			expect(result.left).toBe(550);
			expect(result.top).toBe(0);
			expect(result.right).toBe(1000);
			expect(result.bottom).toBe(1000);
		});

		describe('forEachByAttribute', () => {

			beforeEach(() => {
				TestUtils.setupStoreAndDi();
			});

			afterEach(() => {
				window.ba_enableTestIds = undefined;
			});

			it('applies a function on all elements containing a specific attribute', async () => {
				// we reuse the data-test-id MvuElement classes for our test
				window.ba_enableTestIds = true;
				spyOn(console, 'warn');
				const element = await TestUtils.render(MvuElementParent.tag);
				const callbackSpy = jasmine.createSpy();

				forEachByAttribute(element, 'data-test-id', callbackSpy);

				expect(callbackSpy).toHaveBeenCalledTimes(8);
				expect(callbackSpy).toHaveBeenCalledWith(jasmine.any(HTMLElement));
			});
		});

		describe('findAllByAttribute', () => {

			beforeEach(() => {
				TestUtils.setupStoreAndDi();
			});

			afterEach(() => {
				window.ba_enableTestIds = undefined;
			});

			it('applies a function on all elements containing a specific attribute', async () => {
				// we reuse the data-test-id MvuElement classes for our test
				window.ba_enableTestIds = true;
				spyOn(console, 'warn');
				const element = await TestUtils.render(MvuElementParent.tag);

				const result = findAllByAttribute(element, 'data-test-id');

				expect(result).toHaveSize(8);
				expect(result[0].tagName).toBe('DIV');
				expect(result[3].tagName).toBe('MVU-ELEMENT-CHILD');
			});
		});
	});
});
