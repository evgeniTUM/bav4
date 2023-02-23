import { html } from 'lit-html';
import css from './zoomButtons.css';
import { $injector } from '../../../../injection';
import { increaseZoom, decreaseZoom } from '../../../../store/position/position.action';
import { MvuElement } from '../../../MvuElement';

const Update_zoom_level = 'Update_zoom_level';

/**
 * Buttons that changes the zoom level of the map.
 * @class
 * @author taulinger
 */
export class ZoomButtons extends MvuElement {
	constructor() {
		super({
			zoomLevel: 0
		});
		const { TranslationService } = $injector.inject('TranslationService');
		this._translationService = TranslationService;
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_zoom_level:
				return { ...model, zoomLevel: data };
		}
	}

	/**
	 * @override
	 */
	onInitialize() {
		this.observe(
			(state) => state.position.zoom,
			(zoomLevel) => this.signal(Update_zoom_level, zoomLevel)
		);
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const zoom = model.zoomLevel;

		const zoomInTooltip = translate('map_zoomButtons_in').replace('{zoom}', zoom);
		const zoomOutTooltip = translate('map_zoomButtons_out').replace('{zoom}', zoom);

		return html`
			<style>${css}</style>
			<div class="zoom-buttons">
				<button class="button" title="${zoomInTooltip}" @click="${increaseZoom}"><span class="icon zoom-in"></button>
				<button class="button" title="${zoomOutTooltip}" @click="${decreaseZoom}"><span class="icon zoom-out"></button>
			</div>
		`;
	}

	static get tag() {
		return 'ba-zoom-buttons';
	}
}
