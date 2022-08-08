import { html, nothing } from 'lit-html';
import { MvuElement } from '../../../../../modules/MvuElement';

const Update_tracking = 'update_tracking';

export class EaTracker extends MvuElement {

	constructor() {
		super({
			trackingActive: true
		});

	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_tracking:
				return { ...model, trackingActive: data };
		}
	}

	createView(model) {
		if (!model.trackingActive) {
			return nothing;
		}

		window.PIWIK_URL = 'https://www.piwik.bayern.de/piwik';
		window.PIWIK_ID = 497;

		const piwikUrl = window.PIWIK_URL;
		const id = window.PIWIK_ID;

		window.console.log('eaDsgvoInfo -->piwikUrl' + piwikUrl);
		window.console.log('eaDsgvoInfo --> setSiteId' + id);

		const _paq = _paq || [];
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function () {
			const u = piwikUrl + '/';
			_paq.push(['setTrackerUrl', u + 'piwik.php']);
			_paq.push(['setSiteId', id]);
			const d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
			g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
		})();

		return html`
        `;
	}

	static get tag() {
		return 'ea-tracking';
	}

}
