import { serialize } from 'cookie';
import { InfoPopupPlugin } from '../../../src/ea/plugins/InfoPopupPlugin.js';
import { activateInfoPopup, deactivateInfoPopup } from '../../../src/ea/store/module/ea.action.js';
import { eaReducer } from '../../../src/ea/store/module/ea.reducer.js';
import { $injector } from '../../../src/injection/index.js';
import { TestUtils } from '../../test-utils.js';

describe('InfoPopupPlugin', () => {
	const infoPopupServiceMock = {
		loadInfoPopupResult: (v) => ({
			key: { v }
		})
	};
	const cookieId = 'testv4';

	const FreshCookie = serialize(cookieId, 'show', {
		expires: new Date(),
		sameSite: 'lax',
		path: '/',
		domain: 'localhost'
	});

	let myCookie;

	const cookieResourceServiceMock = {
		setCookie: () => {
			myCookie = FreshCookie;
		},
		getCookie: () => {
			return myCookie;
		},
		deleteCookie: () => {
			myCookie = undefined;
		}
	};

	const setup = async (state) => {
		const store = TestUtils.setupStoreAndDi(state, {
			ea: eaReducer
		});

		$injector.registerSingleton('EaInfoPopupService', infoPopupServiceMock);
		$injector.registerSingleton('CookieService', cookieResourceServiceMock);

		const instanceUnderTest = new InfoPopupPlugin();
		await instanceUnderTest.register(store);

		return store;
	};

	describe('confirmInfo/resetInfoState', () => {
		beforeEach(async () => {
			cookieResourceServiceMock.deleteCookie(cookieId);
		});

		it('create Cookie ', async () => {
			cookieResourceServiceMock.deleteCookie(cookieId);

			await setup();
			deactivateInfoPopup(cookieId);
			const cookie = cookieResourceServiceMock.getCookie(cookieId);
			expect(cookie).toBeDefined();
			expect(cookie).toEqual(FreshCookie);
		});
		it('remove Cookie after creating', async () => {
			await setup();
			deactivateInfoPopup(cookieId);
			activateInfoPopup(cookieId);
			const cookie = cookieResourceServiceMock.getCookie(cookieId);
			expect(cookie).toBeUndefined();
		});
	});
});
