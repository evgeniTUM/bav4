import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { $injector } from '../../../injection';
import css from './geometryInfo.css';
import { MvuElement } from '../../MvuElement';

const Update_Statistics = 'update_statistics';

export const EMPTY_GEOMETRY_STATISTICS = { coordinate: null, azimuth: null, length: null, area: null } ;

export class GeometryInfo extends MvuElement {
	constructor() {
		super({ statistics: EMPTY_GEOMETRY_STATISTICS });

		const { CoordinateService, UnitsService, TranslationService } = $injector.inject('CoordinateService', 'UnitsService', 'TranslationService');
		this._translationService = TranslationService;
		this._coordinateService = CoordinateService;
		this._unitsService = UnitsService;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_Statistics:
				return { ...model, statistics: data };
		}
	}


	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const getContent = statistics => {
			if (statistics.coordinate) {
				const title = translate('geometryInfo_title_coordinate');
				const formattedCoordinate = this._coordinateService.stringify(
					this._coordinateService.toLonLat(statistics.coordinate), 4326, { digits: 5 });
				return html`<div class='stats-point stats-content' title=${title}><span>${title}:</span>${formattedCoordinate}</div>`;
			}
			if (statistics.length && statistics.azimuth) {
				const titleAzimuth = translate('geometryInfo_title_azimuth');
				const titleLength = translate('geometryInfo_title_line_length');
				return html`<div class='stats-line-azimuth stats-content' title=${titleAzimuth}><span>${titleAzimuth}:</span>${statistics.azimuth.toFixed(2)}°</div>
					<div class='stats-line-length stats-content' title=${titleLength}><span>${titleLength}:</span>${this._unitsService.formatDistance(statistics.length, 2)}</div>`;
			}

			if (statistics.length && statistics.area) {
				const titleArea = translate('geometryInfo_title_polygon_area');
				const titleLength = translate('geometryInfo_title_line_length');
				return html`<div class='stats-polygon-length stats-content' title=${titleLength}><span>${titleLength}:</span>${this._unitsService.formatDistance(statistics.length, 2)}</div>
					<div class='stats-polygon-area stats-content' title=${titleArea}><span>${titleArea}:</span>${unsafeHTML(this._unitsService.formatArea(statistics.area, 2))}</div>`;
			}
			if (statistics.length) {
				const title = translate('geometryInfo_title_line_length');
				return html`<div class='stats-line-length stats-content' title=${title}><span>${title}:</span>${this._unitsService.formatDistance(statistics.length, 2)}</div>`;
			}
			return null;
		};

		const content = getContent(model.statistics);

		return content ? html`
        <style>${css}</style>
		<div>
			<div class="stats-container">
			${content}
			<div>
		</div>` : nothing;
	}

	static get tag() {
		return 'ba-geometry-info';
	}

	set statistics(value) {
		this.signal(Update_Statistics, value);
	}
}
