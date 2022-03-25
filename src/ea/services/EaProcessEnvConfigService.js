
import { ProcessEnvConfigService } from '../../services/ProcessEnvConfigService';
/**
 * customized Service for external configuration properties.
 * @class
 * @author kunze_ge
 */
export class EaProcessEnvConfigService extends ProcessEnvConfigService{

	constructor() {
            super();
		// eslint-disable-next-line no-undef
		this._properties.set('MODULE_BACKEND_URL', process.env.MODULE_BACKEND_URL);
	}
}
