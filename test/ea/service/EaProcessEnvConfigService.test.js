import { EaProcessEnvConfigService } from '../../../src/ea/services/EaProcessEnvConfigService';
import { ProcessEnvConfigService } from '../../../src/services/ProcessEnvConfigService';

describe('tests for EaProcessEnvConfigService', () => {

	beforeEach(function () {
		// eslint-disable-next-line no-undef
		const process = {
			env: {
			}
		};
		window.process = process;
		window.ba_externalConfigProperties = {};
	});
	it('inherits ProcessEnvConfigService', () => {
		const object = new EaProcessEnvConfigService();
		expect(object instanceof ProcessEnvConfigService).toBeTrue();
	});

	describe('getValue()', () => {

		it('provides a value for required keys from process.env', () => {
			// eslint-disable-next-line no-undef
			process.env = {
				'MODULE_BACKEND_URL': 'MODULE_BACKEND_URL_value',
				'MATOMO_URL': 'MATOMO_URL_value',
				'MATOMO_ID': 'MATOMO_ID_value'
			};

			const configService = new EaProcessEnvConfigService();

			expect(configService.getValue('MODULE_BACKEND_URL')).toBe('MODULE_BACKEND_URL_value');
			expect(configService.getValue('MATOMO_URL')).toBe('MATOMO_URL_value');
			expect(configService.getValue('MATOMO_ID')).toBe('MATOMO_ID_value');
		});

		it('provides a value for required keys from window.config', () => {
			// eslint-disable-next-line no-undef
			window.ba_externalConfigProperties = {
				'MODULE_BACKEND_URL': 'MODULE_BACKEND_URL_value',
				'MATOMO_URL': 'MATOMO_URL_value',
				'MATOMO_ID': 'MATOMO_ID_value'
			};

			const configService = new EaProcessEnvConfigService();

			expect(configService.getValue('MODULE_BACKEND_URL')).toBe('MODULE_BACKEND_URL_value');
			expect(configService.getValue('MATOMO_URL')).toBe('MATOMO_URL_value');
			expect(configService.getValue('MATOMO_ID')).toBe('MATOMO_ID_value');
		});

	});

});
