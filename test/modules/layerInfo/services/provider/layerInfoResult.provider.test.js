import { $injector } from '../../../../../src/injection';
import { loadBvvLayerInfo } from '../../../../../src/modules/layerInfo/services/provider/layerInfoResult.provider';

describe('LayerInfo provider', () => {

	const configService = {
		getValueAsPath: () => { }
	};

	const httpService = {
		get: async () => { }
	};

	beforeAll(() => {
		$injector
			.registerSingleton('ConfigService', configService)
			.registerSingleton('HttpService', httpService);
	});

	it('should load layerinfo', async () => {

		const geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';
		const backendUrl = 'https://backend.url/';
		const expectedArgs0 = backendUrl + 'layerinfo/' + geoResourceId;
		const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(backendUrl);
		const httpServiceSpy = spyOn(httpService, 'get').withArgs(expectedArgs0).and.returnValue(Promise.resolve(
			new Response('<b>hello</b>', { status: 200 })
		));

		const result = await loadBvvLayerInfo('914c9263-5312-453e-b3eb-5104db1bf788');

		expect(configServiceSpy).toHaveBeenCalled();
		expect(httpServiceSpy).toHaveBeenCalled();
		expect(result).toBeTruthy();
		expect(result.content.length > 0).toBeTrue();
		expect(result.content).toBe('<b>hello</b>');
	});

	it('should return null when backend provides empty payload', async () => {

		const geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';
		const backendUrl = 'https://backend.url/';
		const expectedArgs0 = backendUrl + 'layerinfo/' + geoResourceId;
		const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(backendUrl);
		const httpServiceSpy = spyOn(httpService, 'get').withArgs(expectedArgs0).and.returnValue(Promise.resolve(
			new Response(JSON.stringify(), { status: 404 })
		));

		const result = await loadBvvLayerInfo('914c9263-5312-453e-b3eb-5104db1bf788');

		expect(configServiceSpy).toHaveBeenCalled();
		expect(httpServiceSpy).toHaveBeenCalled();
		expect(result).toBe(null);
	});

	it('should reject when backend request cannot be fulfilled', async () => {

		const geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';
		const backendUrl = 'https://backend.url/';
		const expectedArgs0 = backendUrl + 'layerinfo/' + geoResourceId;
		const configServiceSpy = spyOn(configService, 'getValueAsPath').withArgs('BACKEND_URL').and.returnValue(backendUrl);
		const httpServiceSpy = spyOn(httpService, 'get').withArgs(expectedArgs0).and.returnValue(Promise.resolve(
			new Response(null, { status: 500 })
		));

		const errorMessage = 'LayerInfoResult for \'914c9263-5312-453e-b3eb-5104db1bf788\' could not be loaded';

		try {
			await loadBvvLayerInfo('914c9263-5312-453e-b3eb-5104db1bf788');
			throw new Error('Promise should not be resolved');
		}
		catch (err) {
			expect(configServiceSpy).toHaveBeenCalled();
			expect(httpServiceSpy).toHaveBeenCalled();
			expect(err.message).toBe(errorMessage);
		}
	});
});
