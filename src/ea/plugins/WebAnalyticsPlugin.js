import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { observe } from '../../utils/storeUtils';

export class WebAnalyticsPlugin extends BaPlugin {
	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {
		const { ConfigService: configService, GeoResourceService: geoResourceService } = $injector.inject('ConfigService', 'GeoResourceService');

		const activateMatomo = () => {
			const matomoUrl = configService.getValue('MATOMO_URL') + '/';
			const matomoId = configService.getValue('MATOMO_ID');

			const libraryName = 'matomo';

			const _paq = (window._paq = window._paq || []);
			/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
			_paq.push(['trackPageView']);
			_paq.push(['enableLinkTracking']);
			_paq.push(['setTrackerUrl', matomoUrl + libraryName + '.php']);
			_paq.push(['setSiteId', matomoId]);
			const d = document,
				g = d.createElement('script'),
				s = d.getElementsByTagName('script')[0];
			g.async = true;
			g.src = matomoUrl + libraryName + '.js';
			s.parentNode.insertBefore(g, s);
			g.setAttribute('id', 'matomo-script');
			g.setAttribute('type', 'text/javascript');
		};

		const deactivateMatomo = () => {
			const element = document.getElementById('matomo-script');
			if (element) {
				element.parentNode.removeChild(element);
			}
			window._paq = [];
		};

		const trackToolChange = (toolId) => {
			if (toolId) {
				window._paq.push(['trackEvent', 'Kartenwerkzeug', 'clickEvent', toolId]);
			}
		};

		let activeGeoResourceIds = [];
		const trackLayerChange = (layers) => {
			const ids = layers.map((l) => l.geoResourceId);

			const newIds = ids.filter((l) => !activeGeoResourceIds.includes(l));
			const labels = newIds.map((id) => geoResourceService.byId(id)).map((geoResource) => geoResource.label);
			labels.forEach((l) => window._paq.push(['trackEvent', 'Kartenauswahl', 'clickEvent', l]));

			activeGeoResourceIds = ids;
		};

		const trackModuleChange = (moduleId) => {
			if (moduleId) {
				window._paq.push(['trackEvent', 'Zusatzmodul', 'clickEvent', moduleId]);
			}
		};

		let unsubscribes = [];
		const onActiveStateChange = (active) => {
			if (active) {
				activateMatomo();
				unsubscribes = [
					observe(store, (state) => state.tools.current, trackToolChange),
					observe(store, (state) => state.layers.active, trackLayerChange),
					observe(store, (state) => state.ea.currentModule, trackModuleChange)
				];
			} else {
				deactivateMatomo();
				unsubscribes.forEach((unsubscribe) => unsubscribe());
			}
		};

		observe(store, (state) => state.ea.webAnalyticsActive, onActiveStateChange, false);
	}
}
