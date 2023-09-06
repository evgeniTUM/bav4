import { parse, serialize } from 'cookie';

/**
 *  Service for handling cookies
 * @class
 * @author kun
 */
export class CookieService {
	constructor() {}

	/**
	 *
	 * @param {type} url
	 * @returns {unresolved}
	 */
	getDomainWithoutSubdomain(url) {
		const urlParts = new URL(url).hostname.split('.');
		return urlParts
			.slice(0)
			.slice(-(urlParts.length > 3 ? 3 : urlParts.length))
			.join('.');
	}

	/**
	 * @param {String} name  identification name of cookie
	 * @param {String | Object } settings content of cookie
	 * @param {numer } exdays days until expiration from now
	 */
	setCookie(name, settings, exdays) {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + exdays);
		const domain = this.getDomainWithoutSubdomain(window.location.href);
		const options = {
			expires: expirationDate,
			path: '/',
			domain
		};
		document.cookie = serialize(name, settings, options);
	}
	/**
	 * get a Cookie by name which is not yet expired
	 * @param {String} name  identification name of cookie
	 * @return {Object | undefined }
	 */
	getCookie(name) {
		const cookie = parse(document.cookie)[name];
		return cookie;
	}

	/**
	 * Deletes old deprecated cookies.
	 */
	deleteDeprecatedCookies() {
		document.cookie = 'eab=;path=/;domain=www.karten.energieatlas.bayern.de;expires=Thu, 01 Jan 1970 00:00:01 GMT';
		document.cookie = 'eab=;path=/;domain=www.karten-test.energieatlas.bayern.de;expires=Thu, 01 Jan 1970 00:00:01 GMT';
	}

	deleteCookie(name) {
		if (this.getCookie(name)) {
			const domain = this.getDomainWithoutSubdomain(window.location.href);
			document.cookie = name + '=' + ';path=/' + ';domain=' + domain + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
		}
	}
}
