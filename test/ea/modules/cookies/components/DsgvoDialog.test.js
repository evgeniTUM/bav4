import { parse, serialize } from 'cookie';
import { DsgvoDialog } from '../../../../../src/ea/modules/cookies/components/DsgvoDialog';
import { activateWebAnalytics } from '../../../../../src/ea/store/module/ea.action';
import { eaReducer } from '../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../src/injection';
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
		$injector.registerSingleton('TranslationService', { translate: (key) => key });

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

	it('creates eab cookie property with 120 days expiration, SameSite=Lax and Path=/', async () => {
		document.cookie = serialize('eab', {}, { maxAge: 0 });

		let actualCookie;
		let expectedDate;
		spyOnProperty(document, 'cookie', 'set').and.callFake((c) => {
			actualCookie = c;
			expectedDate = new Date();
			return c;
		});

		const element = await setup();

		element.shadowRoot.getElementById('accept-all').click();

		expectedDate.setDate(expectedDate.getDate() + 120);

		const actualDate = new Date(actualCookie.match(/Expires=(.*?);/)[1]);
		const actualPath = actualCookie.match(/Path=(.*?);/)[1];
		const actualSameSite = actualCookie.match(/SameSite=(.*)/)[1];

		expect(actualDate.toString()).toEqual(expectedDate.toString());
		expect(actualPath).toEqual('/');
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

			const store = TestUtils.setupStoreAndDi(
				{},
				{
					ea: eaReducer,
					modal: modalReducer
				}
			);
			$injector.registerSingleton('TranslationService', { translate: (key) => key });
			activateWebAnalytics();

			await TestUtils.render(DsgvoDialog.tag);

			expect(store.getState().ea.webAnalyticsActive).toBeFalse();
		});

		it('has a link to the privacy policy', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			const link = element.shadowRoot.getElementById('privacy-policy-link');

			expect(link.href).toEqual('https://www.energieatlas.bayern.de/datenschutz');
			expect(link.target).toEqual('_blank');
		});

		it('saves cookies and reload on "accept all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('accept-all').click();

			expect(JSON.parse(parse(document.cookie).eab)).toEqual({ base: true, webanalyse: true });
			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('saves cookies and reload on "reject all" button click', async () => {
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
			expect(store.getState().modal.data.title).toEqual('ea_dsgvo_cookie_settings');
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
