import { $injector } from '../../injection';
import { BaPlugin } from '../../plugins/BaPlugin';
import { observe } from '../../utils/storeUtils';
import { EaModules } from '../modules/toolbox/components/moduleContainer/ModuleContainer';

export class TrackingPlugin extends BaPlugin {

	/**
	 * @override
	 * @param {Store} store
	 */
	async register(store) {
		const { ConfigService: configService } = $injector.inject('ConfigService');

		const activateMatomo = () => {
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
			g.setAttribute('id', 'matomo-script');
		};

		const deactivateMatomo = () => {
			const element = document.getElementById('matomo-script');
			element.parentNode.removeChild(element);
			window._paq = [];
		};


		const trackToolChange = (toolId) => {
			if (toolId) {
				window._paq.push(['trackEvent', 'Kartenwerkzeug', 'clickEvent', toolId]);
			}
		};


		let activeLayerLabelsState = [];
		const trackLayerChange = (layers) => {
			const labels = layers.map(l => l.label);
			const newLabels = labels.filter(l => !activeLayerLabelsState.includes(l));

			newLabels
				.filter(l => l)
				.forEach(l =>
					window._paq.push(['trackEvent', 'Kartenauswahl', 'clickEvent', l])
				);

			activeLayerLabelsState = labels;
		};

		const trackModuleChange = (moduleId) => {
			if (moduleId) {
				const module = EaModules.find(m => m.tag === moduleId);
				window._paq.push(['trackEvent', 'Zusatzmodul', 'clickEvent', module.name]);
			}
		};

		let unsubscribes = [];
		const onActiveStateChange = (active) => {
			if (active) {
				activateMatomo();
				unsubscribes = [
					observe(store, state => state.tools.current, trackToolChange),
					observe(store, state => state.layers.active, trackLayerChange),
					observe(store, state => state.ea.currentModule, trackModuleChange)
				];
			}
			else {
				deactivateMatomo();
				unsubscribes.forEach(unsubscribe => unsubscribe());
			}
		};

		observe(store, state => state.ea.trackingActive, onActiveStateChange);
	}
}
