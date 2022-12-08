import { $injector } from '../../../src/injection';
import { MediaType } from '../../../src/services/HttpService';
import { getBvvProfile } from '../../../src/services/provider/profile.provider';

describe('profile provider', () => {

	const mockProfileResponse = {
		'alts': [
			{
				'dist': 0.0,
				'alt': 566.2,
				'e': 4473088.0,
				'n': 5477632.0
			},
			{
				'dist': 923.5351,
				'alt': 569.0,
				'e': 4472871.5,
				'n': 5476734.0
			},
			{
				'dist': 1847.0936,
				'alt': 568.7,
				'e': 4472655.0,
				'n': 5475836.5
			},
			{
				'dist': 2770.6287,
				'alt': 553.2,
				'e': 4472438.5,
				'n': 5474938.5
			},
			{
				'dist': 3694.1638,
				'alt': 547.6,
				'e': 4472222.0,
				'n': 5474041.0
			}
		],
		'stats': {
			'sumUp': 1480.8,
			'sumDown': 1668.6
		},
		'attrs': [
			{
				'id': 'slope',
				'values': [
					[
						0,
						2,
						0.1
					],
					[
						3,
						4,
						0.21
					]
				]
			},
			{
				'id': 'surface',
				'values': [
					[
						0,
						2,
						'asphalt'
					],
					[
						3,
						4,
						'missing'
					]
				]
			}
		]
	};

	describe('getBvvProfile', () => {
		const configService = {
			getValueAsPath() { }
		};

		const httpService = {
			async post() { }
		};

		beforeEach(() => {
			$injector
				.registerSingleton('ConfigService', configService)
				.registerSingleton('HttpService', httpService);
		});
		afterEach(() => {
			$injector.reset();
		});

		it('fetches a profile', async () => {
			const backendUrl = 'https://backend.url';
			const coords = [[0, 1], [2, 3]];
			const expectedPayload = JSON.stringify([{ e: 0, n: 1 }, { e: 2, n: 3 }]);
			const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(`${backendUrl}/`);
			const httpServiceSpy = spyOn(httpService, 'post').withArgs(`${backendUrl}/dem/profile`, expectedPayload, MediaType.JSON).and.resolveTo(new Response(
				JSON.stringify(mockProfileResponse))
			);

			const profile = await getBvvProfile(coords);

			expect(configServiceSpy).toHaveBeenCalled();
			expect(httpServiceSpy).toHaveBeenCalled();
			expect(profile).toEqual(mockProfileResponse);
		});

		it('throws error on failed request', async () => {

			const backendUrl = 'https://backend.url';
			const coords = [[0, 1], [2, 3]];
			const expectedPayload = JSON.stringify([{ e: 0, n: 1 }, { e: 2, n: 3 }]);
			const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(`${backendUrl}/`);
			const httpServiceSpy = spyOn(httpService, 'post').withArgs(`${backendUrl}/dem/profile`, expectedPayload, MediaType.JSON).and.resolveTo(
				new Response(JSON.stringify({}), { status: 500 })
			);

			await expectAsync(getBvvProfile(coords)).toBeRejectedWithError('Profile could not be fetched: Http-Status 500');
			expect(configServiceSpy).toHaveBeenCalled();
			expect(httpServiceSpy).toHaveBeenCalled();
		});
	});
});
