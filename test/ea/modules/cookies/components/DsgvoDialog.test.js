import { parse, serialize } from 'cookie';
import { DsgvoDialog } from '../../../../../src/ea/modules/cookies/components/DsgvoDialog';
import { eaReducer } from '../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../src/injection';
import { Modal } from '../../../../../src/modules/modal/components/Modal';
import { modalReducer } from '../../../../../src/store/modal/modal.reducer';
import { TestUtils } from '../../../../test-utils';

window.customElements.define(DsgvoDialog.tag, DsgvoDialog);

describe('DsgvoDialog', () => {

	let store;

	const setup = async (state = {}) => {

		store = TestUtils.setupStoreAndDi(state, {
			ea: eaReducer,
			modal: modalReducer
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key });

		return await TestUtils.render(DsgvoDialog.tag);
	};

	describe('rendering,', () => {
		it('is not shown when base cookie is set', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('is shown when base cookie is not set', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});

		it('is shown when base cookie is false', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: false, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});
	});

	it('creates eab cookie property with 120 days expiration SameSite=Lax', async () => {
		document.cookie = serialize('eab', {}, { maxAge: 0 });

		let actualCookie;
		spyOnProperty(document, 'cookie', 'set').and.callFake(c => {
			actualCookie = c;
			return c;
		});

		const element = await setup();

		element.shadowRoot.getElementById('accept-all').click();

		const expectedDate = new Date();
		expectedDate.setDate(expectedDate.getDate() + 120);

		const actualDate = new Date(actualCookie.match(/Expires=(.*);/)[1]);
		const actualSameSite = actualCookie.match(/SameSite=(.*)/)[1];

		expect(actualDate.toString()).toEqual(expectedDate.toString());
		expect(actualSameSite).toEqual('Lax');
	});

	describe('popup,', () => {
		it('activates web analytics if cookie eab.webanalyse is true', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: true }));

			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeTrue();
		});

		it('deactivates web analytics if cookie eab.webanalyse is false', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: false }));

			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeFalse();
		});

		it('save cookies and reload on "accept all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('accept-all').click();

			expect(JSON.parse(parse(document.cookie).eab)).toEqual({ base: true, webanalyse: true });
			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('save cookies and reload on "reject all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('reject-all').click();

			expect(JSON.parse(parse(document.cookie).eab)).toEqual({ base: true, webanalyse: false });
			expect(element.shadowRoot.children.length).toBe(0);
		});

	});

	describe('modal dialog,', () => {
		it('opens modal dialog on "cookie settings" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			expect(store.getState().modal.data.title).toEqual('Cookie Einstellungen');
		});

		it('closes modal dialog on "accept all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			element.shadowRoot.getElementById('accept-all').click();

			expect(store.getState().modal.data).toBeNull();
		});


		it('closes modal dialog on "reject all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			element.shadowRoot.getElementById('reject-all').click();

			expect(store.getState().modal.data).toBeNull();
		});
	});
});
