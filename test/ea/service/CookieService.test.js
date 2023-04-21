import { InfoPopupPlugin } from '../../../src/ea/plugins/InfoPopupPlugin.js';
import { CookieService } from '../../../src/ea/services/CookieService.js';
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

	const cookieService = new CookieService();

	const setup = async (state) => {
		const store = TestUtils.setupStoreAndDi(state, {
			ea: eaReducer
		});

		$injector.registerSingleton('EaInfoPopupService', infoPopupServiceMock);
		$injector.registerSingleton('CookieService', cookieService);

		const instanceUnderTest = new InfoPopupPlugin();
		await instanceUnderTest.register(store);

		return store;
	};

	describe('confirmInfo/resetInfoState', () => {
		const cookieId = 'CookieId';

		it('create Cookie ', async () => {
			cookieService.deleteCookie(cookieId);

			await setup();

			deactivateInfoPopup(cookieId);
			let cookie = cookieService.getCookie(cookieId);
			expect(cookie).toBeDefined();
			expect(cookie).toEqual('show');

			activateInfoPopup(cookieId);
			cookie = cookieService.getCookie(cookieId);
			expect(cookie).toBeUndefined();
		});
	});
});
