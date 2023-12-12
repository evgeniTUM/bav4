import { loadThemeGroups } from '../../../../src/ea/services/provider/research.provider';
import { $injector } from '../../../../src/injection';

describe('Research provider', () => {
	const configService = {
		getValueAsPath: () => {}
	};

	const httpService = {
		get: async () => {}
	};

	beforeAll(() => {
		$injector.registerSingleton('ConfigService', configService).registerSingleton('HttpService', httpService);
	});

	describe('themegroups', () => {
		it('loads theme groups', async () => {
			const backendUrl = 'https://backend.url';

			const themeGroupsExpected = {
				foo: 'bar'
			};
			const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(backendUrl);
			const httpServiceSpy = spyOn(httpService, 'get').and.returnValue(Promise.resolve(new Response(JSON.stringify(themeGroupsExpected))));

			const themeGroupsActual = await loadThemeGroups();

			expect(configServiceSpy).toHaveBeenCalled();
			expect(httpServiceSpy).toHaveBeenCalled();
			expect(themeGroupsActual).toEqual(themeGroupsExpected);
		});

		it('rejects when backend request cannot be fulfilled', async () => {
			const backendUrl = 'https://backend.url';
			const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(backendUrl);
			const httpServiceSpy = spyOn(httpService, 'get').and.returnValue(Promise.resolve(new Response(null, { status: 404 })));

			await expectAsync(loadThemeGroups()).toBeRejectedWithError('Theme Groups could not be retrieved');
			expect(configServiceSpy).toHaveBeenCalled();
			expect(httpServiceSpy).toHaveBeenCalled();
		});
	});
});
