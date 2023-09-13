import { ProcessEnvConfigService } from '../../services/ProcessEnvConfigService';
/**
 * customized Service for external configuration properties.
 * @class
 * @author kunze_ge
 */
export class EaProcessEnvConfigService extends ProcessEnvConfigService {
	constructor() {
		super();
		// eslint-disable-next-line no-undef
		this._properties.set('MODULE_BACKEND_URL', window?.ba_externalConfigProperties?.MODULE_BACKEND_URL ?? process.env.MODULE_BACKEND_URL);
		this._properties.set('MATOMO_URL', window?.ba_externalConfigProperties?.MATOMO_URL ?? process.env.MATOMO_URL);
		this._properties.set('MATOMO_ID', window?.ba_externalConfigProperties?.MATOMO_ID ?? process.env.MATOMO_ID);
		this._properties.set(
			'GEOTHERM_CHECK_URL_SONDEN',
			window?.ba_externalConfigProperties?.GEOTHERM_CHECK_URL_SONDEN ?? process.env.GEOTHERM_CHECK_URL_SONDEN
		);
		this._properties.set(
			'GEOTHERM_CHECK_URL_KOLLEKTOREN',
			window?.ba_externalConfigProperties?.GEOTHERM_CHECK_URL_KOLLEKTOREN ?? process.env.GEOTHERM_CHECK_URL_KOLLEKTOREN
		);
		this._properties.set(
			'GEOTHERM_CHECK_URL_PUMPEN',
			window?.ba_externalConfigProperties?.GEOTHERM_CHECK_URL_PUMPEN ?? process.env.GEOTHERM_CHECK_URL_PUMPEN
		);
		this._properties.set('ANALYSE3D_URL', window?.ba_externalConfigProperties?.ANALYSE3D_URL ?? process.env.ANALYSE3D_URL);
	}
}
