import { LayerInfoService, LayerInfoResult } from '../../../../src/modules/layerInfo/services/LayerInfoService';
import { loadBvvLayerInfo } from '../../../../src/modules/layerInfo/services/provider/layerInfoResult.provider';
import { $injector } from '../../../../src/injection';
import { FALLBACK_GEORESOURCE_ID_0, FALLBACK_GEORESOURCE_ID_1 } from '../../../../src/services/GeoResourceService';

const geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';

const environmentService = {
	isStandalone: () => { }
};

beforeAll(() => {
	$injector
		.registerSingleton('EnvironmentService', environmentService);
});

describe('LayerInfoService', () => {

	it('initializes the service with default provider', async () => {

		const layerInfoService = new LayerInfoService();

		expect(layerInfoService._provider).toEqual(loadBvvLayerInfo);
	});

	it('initializes the service with custom provider', async () => {
		const customProvider = async () => { };
		const instanceUnderTest = new LayerInfoService(customProvider);
		expect(instanceUnderTest._provider).toBeDefined();
		expect(instanceUnderTest._provider).toEqual(customProvider);
	});


	it('should return a LayerInfoResult with html content', async () => {

		const loadMockBvvLayerInfo = async () => {
			return new LayerInfoResult('<b>content</b>');
		};
		const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);

		const layerInfoResult = await layerInfoSerice.byId(geoResourceId);

		expect(layerInfoResult.content).toBe('<b>content</b>');
		expect(layerInfoResult.title).toBeNull();
	});

	it('should return null when backend provides empty payload', async () => {

		const loadMockBvvLayerInfo = async () => {
			return null;
		};
		const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);

		const result = await layerInfoSerice.byId(geoResourceId);
		expect(result).toBeNull();
	});

	it('should throw error when backend provides unknown respone', async () => {

		const providerErrMsg = 'LayerInfo for \'914c9263-5312-453e-b3eb-5104db1bf788\' could not be loaded';
		const loadMockBvvLayerInfo = async () => {
			return Promise.reject(new Error(providerErrMsg));
		};
		const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);

		try {
			await layerInfoSerice.byId(geoResourceId);
			throw new Error('Promise should not be resolved');
		}
		catch (err) {
			expect(err.message).toBe('Could not load layerinfoResult from provider: ' + providerErrMsg);
		}
	});

	describe('LayerInfoResult', () => {

		it('provides getter for properties', () => {
			const layerInfoResult = new LayerInfoResult('<b>content</b>', 'title');

			expect(layerInfoResult.content).toBe('<b>content</b>');
			expect(layerInfoResult.title).toBe('title');
		});

		it('provides default properties', () => {
			const layerInfoResult = new LayerInfoResult('<b>content</b>');

			expect(layerInfoResult.content).toBe('<b>content</b>');
			expect(layerInfoResult.title).toBeNull();
		});
	});

	describe('provider cannot fulfill', () => {

		it('loads fallback atkis when we are in standalone mode', async () => {
			spyOn(environmentService, 'isStandalone').and.returnValue(true);

			const providerErrMsg = 'LayerInfo for \'914c9263-5312-453e-b3eb-5104db1bf788\' could not be loaded';
			const loadMockBvvLayerInfo = async () => {
				return Promise.reject(new Error(providerErrMsg));
			};
			const warnSpy = spyOn(console, 'warn');
			const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);
			const layerInfoResult = await layerInfoSerice.byId(FALLBACK_GEORESOURCE_ID_0);


			expect(layerInfoResult.content).toBe('This is a fallback layerinfo');
			expect(layerInfoResult.title).toBe(FALLBACK_GEORESOURCE_ID_0);
			expect(warnSpy).toHaveBeenCalledWith('layerinfo could not be fetched from backend. Using fallback layerinfo');
		});

		it('loads fallback atkis_sw when we are in standalone mode', async () => {
			spyOn(environmentService, 'isStandalone').and.returnValue(true);

			const providerErrMsg = 'LayerInfo for \'914c9263-5312-453e-b3eb-5104db1bf788\' could not be loaded';
			const loadMockBvvLayerInfo = async () => {
				return Promise.reject(new Error(providerErrMsg));
			};
			const warnSpy = spyOn(console, 'warn');
			const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);
			const layerInfoResult = await layerInfoSerice.byId(FALLBACK_GEORESOURCE_ID_1);


			expect(layerInfoResult.content).toBe('This is a fallback layerinfo');
			expect(layerInfoResult.title).toBe(FALLBACK_GEORESOURCE_ID_1);
			expect(warnSpy).toHaveBeenCalledWith('layerinfo could not be fetched from backend. Using fallback layerinfo');
		});

		it('logs an error when we are NOT in standalone mode', async () => {
			spyOn(environmentService, 'isStandalone').and.returnValue(false);
			const providerErrMsg = 'LayerInfo for \'914c9263-5312-453e-b3eb-5104db1bf788\' could not be loaded';
			const loadMockBvvLayerInfo = async () => {
				return Promise.reject(new Error(providerErrMsg));
			};
			const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);

			try {
				await layerInfoSerice.byId(geoResourceId);
				throw new Error('Promise should not be resolved');
			}
			catch (err) {
				expect(err.message).toBe('Could not load layerinfoResult from provider: ' + providerErrMsg);
			}
		});

		it('just provides layerInfoResult when geoResourceId already available in locale cache', async () => {
			const layerInfoSerice = new LayerInfoService(null);
			const layerInfo = new LayerInfoResult('<b>content</b>');
			layerInfoSerice._layerInfoResults.set(FALLBACK_GEORESOURCE_ID_0, layerInfo);

			const layerInfoResult = await layerInfoSerice.byId(FALLBACK_GEORESOURCE_ID_0);

			expect(layerInfoResult instanceof LayerInfoResult);
			expect(layerInfoResult.content).toBe('<b>content</b>');
			expect(layerInfoResult.title).toBe(null);
		});

		it('just provides layerInfoResult when geoResourceId not available in locale cache', async () => {
			const loadMockBvvLayerInfo = async () => {
				return new LayerInfoResult('<div><content/div>');
			};
			const layerInfoSerice = new LayerInfoService(loadMockBvvLayerInfo);
			layerInfoSerice._layerInfoResults.set(FALLBACK_GEORESOURCE_ID_1, null);

			const layerInfoResult = await layerInfoSerice.byId(FALLBACK_GEORESOURCE_ID_0);

			expect(layerInfoResult instanceof LayerInfoResult);
			expect(layerInfoResult.content).toBe('<div><content/div>');
			expect(layerInfoResult.title).toBe(null);
		});
	});
});
