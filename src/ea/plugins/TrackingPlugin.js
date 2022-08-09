import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';

export class TrackingPlugin extends BaPlugin {

	/**
	 * @override
	 * @param {Store} store
	 */
	async register() {
		const { ConfigService: configService } = $injector.inject('ConfigService');

		const matomoUrl = configService.getValue('MATOMO_URL') + '/';
		const matomoId = configService.getValue('MATOMO_ID');

		const libraryName = 'matomo';

		const _paq = window._paq = window._paq || [];
		/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		_paq.push(['setTrackerUrl', matomoUrl + libraryName + '.php']);
		_paq.push(['setSiteId', matomoId]);
		const d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
		g.async = true; g.src = matomoUrl + libraryName + '.js'; s.parentNode.insertBefore(g, s);
	}
}
