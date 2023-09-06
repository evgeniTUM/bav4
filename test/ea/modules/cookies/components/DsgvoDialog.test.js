import { DsgvoDialog } from '../../../../../src/ea/modules/cookies/components/DsgvoDialog';
import { activateWebAnalytics } from '../../../../../src/ea/store/module/ea.action';
import { eaReducer } from '../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../src/injection';
import { modalReducer } from '../../../../../src/store/modal/modal.reducer';
import { TestUtils } from '../../../../test-utils';

window.customElements.define(DsgvoDialog.tag, DsgvoDialog);

describe('DsgvoDialog', () => {
	let store;

	const cookieServiceMock = {
		setCookie: () => {},
		getCookie: () => undefined,
		deleteDeprecatedCookies: () => {}
	};

	const setup = async (state = {}) => {
		store = TestUtils.setupStoreAndDi(state, {
			ea: eaReducer,
			modal: modalReducer
		});

		$injector.registerSingleton('TranslationService', { translate: (key) => key });
		$injector.registerSingleton('CookieService', cookieServiceMock);

		return await TestUtils.render(DsgvoDialog.tag);
	};

	describe('rendering,', () => {
		it('deletes deprecated cookies', async () => {
			const deleteDeprecatedCookiesSpy = spyOn(cookieServiceMock, 'deleteDeprecatedCookies');

			await setup();

			expect(deleteDeprecatedCookiesSpy).toHaveBeenCalled();
		});

		it('is not shown when functional cookie is set', async () => {
			spyOn(cookieServiceMock, 'getCookie')
				.withArgs('eab')
				.and.returnValue(JSON.stringify({ functional: true, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('is shown when functional cookie is not set', async () => {
			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});

		it('is shown when functional cookie is false', async () => {
			spyOn(cookieServiceMock, 'getCookie')
				.withArgs('eab')
				.and.returnValue(JSON.stringify({ functional: false, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});
	});

	it('creates eab cookie property with 120 days expiration and Path=/', async () => {
		const cookieSpy = spyOn(cookieServiceMock, 'setCookie');

		const element = await setup();

		element.shadowRoot.getElementById('accept-all').click();

		expect(cookieSpy).toHaveBeenCalledWith('eab', JSON.stringify({ functional: true, webanalyse: true }), 120);
	});

	describe('popup,', () => {
		it('activates web analytics if cookie eab.webanalyse is true', async () => {
			spyOn(cookieServiceMock, 'getCookie')
				.withArgs('eab')
				.and.returnValue(JSON.stringify({ functional: true, webanalyse: true }));

			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeTrue();
		});

		it('deactivates web analytics if cookie eab.webanalyse is false', async () => {
			spyOn(cookieServiceMock, 'getCookie')
				.withArgs('eab')
				.and.returnValue(JSON.stringify({ functional: true, webanalyse: false }));

			activateWebAnalytics();
			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeFalse();
		});

		it('has a link to the privacy policy', async () => {
			const element = await setup();

			const link = element.shadowRoot.getElementById('privacy-policy-link');

			expect(link.href).toEqual('https://www.energieatlas.bayern.de/datenschutz');
			expect(link.target).toEqual('_blank');
		});

		it('saves cookies and reload on "accept all" button click', async () => {
			const cookieSpyGet = spyOn(cookieServiceMock, 'getCookie').and.callThrough();
			const cookieSpySet = spyOn(cookieServiceMock, 'setCookie');
			const element = await setup();

			element.shadowRoot.getElementById('accept-all').click();

			expect(cookieSpySet).toHaveBeenCalledWith('eab', JSON.stringify({ functional: true, webanalyse: true }), 120);
			expect(cookieSpyGet).toHaveBeenCalledWith('eab');
		});

		it('saves cookies and reload on "reject all" button click', async () => {
			const cookieSpyGet = spyOn(cookieServiceMock, 'getCookie').and.callThrough();
			const cookieSpy = spyOn(cookieServiceMock, 'setCookie');
			const element = await setup();

			element.shadowRoot.getElementById('reject-all').click();

			expect(cookieSpy).toHaveBeenCalledWith('eab', JSON.stringify({ functional: true, webanalyse: false }), 120);
			expect(cookieSpyGet).toHaveBeenCalledTimes(2);
		});
	});

	describe('modal dialog,', () => {
		it('opens modal dialog on "cookie settings" button click', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			expect(store.getState().modal.data.title).toEqual('ea_dsgvo_cookie_settings');
		});

		it('closes modal dialog on "accept all" button click', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			element.shadowRoot.getElementById('accept-all').click();

			expect(store.getState().modal.data).toBeNull();
		});

		it('closes modal dialog on "reject all" button click', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('cookie-settings').click();
			element.shadowRoot.getElementById('reject-all').click();

			expect(store.getState().modal.data).toBeNull();
		});
	});
});
