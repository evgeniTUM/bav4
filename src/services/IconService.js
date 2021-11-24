import { loadBvvIcons, getBvvIconsUrl } from './provider/icons.provider';

const Svg_Encoding_B64_Flag = 'data:image/svg+xml;base64,';
const Svg_Marker_Name = 'marker';
const Svg_Marker_Content = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(255,255,255)" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><!-- MIT License --><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>';
/**
 * Service for managing icons
 *
 * This service provides a default-icon as IconResult with iconResult.id==='marker' and a list of icons based on svg-graphics as IconResult.
 * This list always contains the default-icon or a 'marker'-Icon provided by the icons.provider as first element.
 * @author thiloSchlemmer
 */
export class IconService {

	constructor(iconProvider = loadBvvIcons, urlProvider = getBvvIconsUrl) {
		this._iconProvider = iconProvider;
		this._iconUrlProvider = urlProvider;
		this._icons = null;
	}

	default() {
		return new IconResult(Svg_Marker_Name, Svg_Marker_Content);
	}

	async _load() {
		try {
			const isMarkerIcon = (iconResult) => iconResult.id === Svg_Marker_Name;
			const providerIcons = await this._iconProvider();
			const indexOfMarkerIcon = providerIcons.findIndex(isMarkerIcon);
			this._icons = indexOfMarkerIcon < 0 ? [this.default(), ...providerIcons] : [providerIcons[indexOfMarkerIcon], ...providerIcons.filter((i) => !isMarkerIcon(i))];
		}
		catch (e) {
			this._icons = [this.default(), ...loadFallbackIcons()];
			console.warn('Icons could not be fetched from backend.', e);
		}
		return this._icons;
	}

	/**
	 * Creates a list of all icons as IconResult
	 * @returns {Array<IconResult>}
	 */
	async all() {
		if (this._icons === null) {
			return await this._load();
		}
		return this._icons;
	}


	/**
	 * Creates a URL for the specified icon
	 * @param {string} idOrBase64 the icon-id or the base64-encoded icon itself
	 * @param {Array<number>} color the rgb-color
	 * @returns {string} the URL
	 */
	getUrl(idOrBase64, color) {
		const getUrlByBase64 = (base64String) => {
			if (this._icons === null) {
				console.warn('icons not loaded yet');
				return null;
			}
			const iconResult = this._icons.find(iconResult => iconResult.base64 === base64String);

			return iconResult ? this._iconUrlProvider(iconResult.id, color) : (this.default().base64 === base64String ? this._iconUrlProvider(this.default().id, color) : null);
		};

		const getUrlByName = (id) => {
			return this._iconUrlProvider(id, color);
		};

		const getIconUrl = () => {
			return idOrBase64.startsWith(Svg_Encoding_B64_Flag) ? getUrlByBase64(idOrBase64) : getUrlByName(idOrBase64);
		};
		try {
			return getIconUrl();
		}
		catch (e) {
			return null;
		}
	}

	/**
	 *
	   * @param {string} url
	  */
	decodeColor(url) {
		const getIconUrl = (url) => {
			if (url.includes('?url=')) {
				return decodeURIComponent(url.slice(url.lastIndexOf('?url=') + 5));
			}
			return url;
		};
		const iconUrl = getIconUrl(url);
		const components = iconUrl.split('/');
		return components[components.length - 2].split(',').map(c => parseInt(c));
	}

	/**
	 * creates a IconResult from a base64-encoded Version of an svg
	 * based on this article:
	 * https://newbedev.com/using-javascript-s-atob-to-decode-base64-doesn-t-properly-decode-utf-8-strings
	   * @param {string} id
	   * @param {string} encodedString
	   * @returns {IconResult|null} the IconResult
	  */
	fromBase64(id, encodedString) {
		if (encodedString.startsWith(Svg_Encoding_B64_Flag)) {
			const b64DecodeUnicode = (str) => {
				return decodeURIComponent(window.atob(str).split('').map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				}).join(''));
			};

			return new IconResult(id, b64DecodeUnicode(encodedString.replace(Svg_Encoding_B64_Flag, '')));
		}
		return null;
	}

}


/**
* @class
* @author thiloSchlemmer
*/
export class IconResult {

	/**
	 *
	 * @param {string} id the id(name) of this IconResult
	 * @param {string} svg the content of this Icon as SVG
	 */
	constructor(id, svg) {

		this._id = id;
		this._svg = svg;
		this._base64 = this._toBase64(svg);
	}

	/**
	 * creates a base64-encoded Version of the svg for embedding-purposes
	 * based on this article:
	 * https://newbedev.com/using-javascript-s-atob-to-decode-base64-doesn-t-properly-decode-utf-8-strings
	   * @param {IconResult} iconResult
	   * @returns {string} the encoded (base64) string
	  */
	_toBase64() {
		const b64EncodeUnicode = (str) => {
			return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
				(match, p1) => String.fromCharCode('0x' + p1)));
		};

		return Svg_Encoding_B64_Flag + b64EncodeUnicode(this._svg);
	}

	get id() {
		return this._id;
	}

	get svg() {
		return this._svg;
	}

	get base64() {
		return this._base64;
	}

}


/**
 * @returns {Map} with fallback icons loaded locally
 */
const loadFallbackIcons = () => {
	return [
		new IconResult('triangle-stroked', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(255,255,255)" class="bi bi-triangle" viewBox="0 0 16 16"><!-- MIT License --><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/></svg>'),
		new IconResult('triangle', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(255,255,255)" class="bi bi-triangle-fill" viewBox="0 0 16 16"><!-- MIT License --><path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/></svg > '),
		new IconResult('square-stroked', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(255,255,255)" class="bi bi-square" viewBox="0 0 16 16"><!-- MIT License --><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg>'),
		new IconResult('square', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="rgb(255,255,255)" class="bi bi-square-fill" viewBox="0 0 16 16"><!-- MIT License --><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/></svg>'),
		new IconResult('car', '<svg id="car" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32.0" fill="rgb(255,255,255)" height="32.0" viewBox="0.0 0.0 48.0 48.0" preserveAspectRatio="none slice"><!-- MIT License --><path d="M14.96875,9.984375Q12.78125,9.984375,11.984375,11.984375L9.0,20.015625Q9.0,20.078125,8.0,21.4375Q7.0,22.796875,7.0,24.0L7.0,34.03125L10.984375,34.03125L10.984375,36.015625Q10.984375,36.75,11.609375,37.390625Q12.25,38.015625,12.984375,38.015625L14.96875,38.015625Q15.765625,38.015625,16.390625,37.390625Q17.03125,36.75,17.03125,36.015625L17.03125,34.03125L30.96875,34.03125L30.96875,36.015625Q30.96875,36.75,31.59375,37.390625Q32.234375,38.015625,33.03125,38.015625L35.03125,38.015625Q35.75,38.015625,36.375,37.390625Q37.015625,36.75,37.015625,36.015625L37.015625,34.03125L41.0,34.03125L41.0,24.0Q41.0,22.875,40.0625,21.640625Q39.140625,20.40625,39.015625,20.015625L36.015625,11.984375Q35.21875,9.984375,33.03125,9.984375L14.96875,9.984375ZM16.03125,13.96875L31.96875,13.96875L34.03125,20.015625L13.96875,20.015625L16.03125,13.96875ZM14.96875,25.984375Q15.828125,25.984375,16.421875,26.59375Q17.03125,27.1875,17.03125,27.984375Q17.03125,28.84375,16.421875,29.40625Q15.828125,29.96875,14.96875,29.96875Q14.171875,29.96875,13.578125,29.40625Q12.984375,28.84375,12.984375,27.984375Q12.984375,27.1875,13.578125,26.59375Q14.171875,25.984375,14.96875,25.984375ZM33.03125,25.984375Q33.828125,25.984375,34.421875,26.59375Q35.03125,27.1875,35.03125,27.984375Q35.03125,28.84375,34.421875,29.40625Q33.828125,29.96875,33.03125,29.96875Q32.171875,29.96875,31.5625,29.40625Q30.96875,28.84375,30.96875,27.984375Q30.96875,27.1875,31.5625,26.59375Q32.171875,25.984375,33.03125,25.984375Z"/></svg>')
	];
};
