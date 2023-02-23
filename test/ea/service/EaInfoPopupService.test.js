import { EaInfoPopupService, InfoPopupResult } from '../../../src/ea/services/EaInfoPopupService';
import { $injector } from '../../../src/injection';

const environmentService = {
	isStandalone: () => {}
};

beforeAll(() => {
	$injector.registerSingleton('EnvironmentService', environmentService);
});

describe('tests for EaInfoPopupService', () => {
	const provider = async () => {
		return new InfoPopupResult('key', 'title', 'info_url');
	};

	describe('loadInfoPopupResult()', () => {
		it('loadInfoPopupResult OK', async () => {
			const service = new EaInfoPopupService(provider);
			const result = await service.loadInfoPopupResult();
			expect(result._key).toEqual('key');
		});

		it('loadInfoPopupResult expect the wrong key', async () => {
			const service = new EaInfoPopupService(provider);
			const result = await service.loadInfoPopupResult();
			expect(result._key).not.toEqual('wrong');
		});
	});
});
