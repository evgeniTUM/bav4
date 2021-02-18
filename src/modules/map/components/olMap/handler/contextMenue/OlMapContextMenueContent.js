import { html, nothing } from 'lit-html';
import { BaElement } from '../../../../../BaElement';
import css from './olMapContextMenueContent.css';
import { $injector } from '../../../../../../injection';
import clipboardIcon from './assets/clipboard.svg';


export class OlMapContextMenueContent extends BaElement {

	constructor() {
		super();
		const {
			MapService: mapService,
			CoordinateService: coordinateService,
			TranslationService: translastionService,
			ShareService: shareService
		} = $injector.inject('MapService', 'CoordinateService', 'TranslationService', 'ShareService');

		this._mapService = mapService;
		this._coordinateService = coordinateService;
		this._translationService = translastionService;
		this._shareService = shareService;
	}

	set coordinate(coordinateInMapSrid) {
		this._coordinate = coordinateInMapSrid;
	}


	createView() {
		const translate = (key) => this._translationService.translate(key);
		const copyCoordinate = (coordinate) => {
			this._shareService.copyToClipboard(coordinate.join(', '));
		};

		if (this._coordinate) {
			const sridDefinitions = this._mapService.getSridDefinitionsForView(this._coordinate);
			const stringifiedCoords = sridDefinitions.map(definition => {
				const { label, code } = definition;
				const transformedCoordinate = this._coordinateService.transform(this._coordinate, this._mapService.getSrid(), code);
				const stringifiedCoord = this._coordinateService.stringify(transformedCoordinate, code);
				return html`<span class='label'>${label}</span><span class='coordinate'>${stringifiedCoord}</span>
				<span class='icon'><ba-icon class='close' icon='${clipboardIcon}' title=${translate('map_context_menue_content_icon')} size=16} @click=${copyCoordinate(transformedCoordinate)}></ba-icon></span>`;
			});

			return html`
			<style>${css}</style>

			<div class="container">
  				<ul class="content">
				${stringifiedCoords.map((strCoord) => html`<li>${strCoord}</li>`)}
  				</ul>
			</div>
			`;

		}

		return nothing;
	}

	static get tag() {
		return 'ba-ol-map-context-menue-content';
	}

}