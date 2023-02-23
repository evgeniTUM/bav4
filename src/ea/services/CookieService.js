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
	setCookie = function (name, settings, exdays) {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + exdays);
		const host = this.getDomainWithoutSubdomain(window.location.href);
		const options = {
			expires: expirationDate,
			sameSite: 'lax',
			path: '/',
			domain: host
		};
		document.cookie = serialize(name, settings, options);
	};
	/**
	 * get a Cookie by name which is not yet expired
	 * @param {String} name  identification name of cookie
	 * @return {Object | undefined }
	 */
	getCookie = function (name) {
		const cookie = parse(document.cookie)[name];
		return cookie;
	};

	deleteCookie(name) {
		if (this.getCookie(name)) {
			const host = this.getDomainWithoutSubdomain(window.location.href);
			document.cookie = name + '=' + ';path=/' + ';domain=' + host + ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
		}
	}
}
