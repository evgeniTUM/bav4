import { EaProcessEnvConfigService } from '../../../src/ea/services/EaProcessEnvConfigService';
import { ProcessEnvConfigService } from '../../../src/services/ProcessEnvConfigService';

describe('tests for EaProcessEnvConfigService', () => {
	beforeEach(function () {
		// eslint-disable-next-line no-undef
		const process = {
			env: {}
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
				MODULE_BACKEND_URL: 'MODULE_BACKEND_URL_value',
				MATOMO_URL: 'MATOMO_URL_value',
				MATOMO_ID: 'MATOMO_ID_value',
				GEOTHERM_CHECK_URL_SONDEN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_ews/generate',
				GEOTHERM_CHECK_URL_KOLLEKTOREN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_ek/generate',
				GEOTHERM_CHECK_URL_PUMPEN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_gwwp/generate',
				ANALYSE3D_URL: 'https://3dview.energieatlas.bayern.de/3D-Analyse/?start=geo:'
			};

			const configService = new EaProcessEnvConfigService();

			//Compare the result to the testdata by using the original with associative array
			expect(configService.getValue('MODULE_BACKEND_URL')).toBe(process.env['MODULE_BACKEND_URL']);
			expect(configService.getValue('MATOMO_URL')).toBe(process.env['MATOMO_URL']);
			expect(configService.getValue('MATOMO_ID')).toBe(process.env['MATOMO_ID']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_SONDEN')).toBe(process.env['GEOTHERM_CHECK_URL_SONDEN']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_KOLLEKTOREN')).toBe(process.env['GEOTHERM_CHECK_URL_KOLLEKTOREN']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_PUMPEN')).toBe(process.env['GEOTHERM_CHECK_URL_PUMPEN']);
			expect(configService.getValue('ANALYSE3D_URL')).toBe(process.env['ANALYSE3D_URL']);
		});

		it('provides a value for required keys from window.config', () => {
			// eslint-disable-next-line no-undef
			window.ba_externalConfigProperties = {
				MODULE_BACKEND_URL: 'MODULE_BACKEND_URL_value',
				MATOMO_URL: 'MATOMO_URL_value',
				MATOMO_ID: 'MATOMO_ID_value',
				GEOTHERM_CHECK_URL_SONDEN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_ews/generate',
				GEOTHERM_CHECK_URL_KOLLEKTOREN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_ek/generate',
				GEOTHERM_CHECK_URL_PUMPEN: 'https://www.umweltatlas.bayern.de/standortauskunft/rest/reporting/sta_geothermie_gwwp/generate',
				ANALYSE3D_URL: 'https://3dview.energieatlas.bayern.de/3D-Analyse/?start=geo:'
			};

			const configService = new EaProcessEnvConfigService();

			//Compare the result to the testdata by using the original with associative array
			expect(configService.getValue('MODULE_BACKEND_URL')).toBe(window.ba_externalConfigProperties['MODULE_BACKEND_URL']);
			expect(configService.getValue('MATOMO_URL')).toBe(window.ba_externalConfigProperties['MATOMO_URL']);
			expect(configService.getValue('MATOMO_ID')).toBe(window.ba_externalConfigProperties['MATOMO_ID']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_SONDEN')).toBe(window.ba_externalConfigProperties['GEOTHERM_CHECK_URL_SONDEN']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_KOLLEKTOREN')).toBe(window.ba_externalConfigProperties['GEOTHERM_CHECK_URL_KOLLEKTOREN']);
			expect(configService.getValue('GEOTHERM_CHECK_URL_PUMPEN')).toBe(window.ba_externalConfigProperties['GEOTHERM_CHECK_URL_PUMPEN']);
			expect(configService.getValue('ANALYSE3D_URL')).toBe(window.ba_externalConfigProperties['ANALYSE3D_URL']);
		});
	});
});
