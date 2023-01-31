export const provide = (lang) => {
	switch (lang) {

		case 'en':
			return {
				ea_dsgvo_text: 'Wir nutzen Cookies auf unserer Website. Einige von ihnen sind technisch essenziell, während andere uns helfen, diese Website zu verbessern. Weitere Informationen finden Sie in unseren Datenschutzinformationen. Ihre Einstellung können Sie dort jederzeit anpassen.',
				ea_dsgvo_cookie_settings: 'Cookie Settings',
				ea_dsgvo_accept_all: 'Accept all cookies',
				ea_dsgvo_reject_all: 'Reject all cookies',
				ea_dsgvo_save: 'Save',
				ea_dsgvo_privacy_policy: 'Privacy Policy',
				ea_dsgvo_basic_cookies_title: 'Essential Cookies',
				ea_dsgvo_basic_cookies_text: 'These cookies are needed for the basic operation of this web site.',
				ea_dsgvo_webanalytics_cookies_title: 'Web Analysis',
				ea_dsgvo_webanalytics_cookies_text: 'These cookies help us improve this web site.',
				ea_dsgvo_always_on: '(always on)'
			};

		case 'de':
			return {
				ea_dsgvo_text: 'Wir nutzen Cookies auf unserer Website. Einige von ihnen sind technisch essenziell, während andere uns helfen, diese Website zu verbessern. Weitere Informationen finden Sie in unseren Datenschutzinformationen. Ihre Einstellung können Sie dort jederzeit anpassen.',
				ea_dsgvo_cookie_settings: 'Cookie Einstellungen',
				ea_dsgvo_accept_all: 'Alle Cookies akzeptieren',
				ea_dsgvo_reject_all: 'Alle Cookies ablehnen',
				ea_dsgvo_save: 'Speichern',
				ea_dsgvo_privacy_policy: 'Datenschutzerklärung',
				ea_dsgvo_basic_cookies_title: 'Technisch notwendige Cookies',
				ea_dsgvo_basic_cookies_text: 'Diese Cookies werden für eine reibungslose Funktion unserer Website benötigt.',
				ea_dsgvo_webanalytics_cookies_title: 'Webanalyse',
				ea_dsgvo_webanalytics_cookies_text: 'Diese Cookies helfen uns diese Website zu verbessern.',
				ea_dsgvo_always_on: '(immer aktiv)'
			};

		default:
			return {};
	}
};
