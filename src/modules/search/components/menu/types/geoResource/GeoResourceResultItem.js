/**
 * @module modules/search/components/menu/types/geoResource/GeoResourceResultItem
 */
import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { addLayer, removeLayer } from '../../../../../../store/layers/layers.action';
import css from './geoResourceResultItem.css';
import { MvuElement } from '../../../../../MvuElement';
import { $injector } from '../../../../../../injection';
import { createUniqueId } from '../../../../../../utils/numberUtils';
import { clearPreviewGeoresourceId, setPreviewGeoresourceId } from '../../../../../../ea/store/module/ea.action';
import { fitLayer } from '../../../../../../store/position/position.action';
import { GeoResourceFuture } from '../../../../../../domain/geoResources';
import { checkIfResolutionValid } from '../../../../../../ea/utils/eaUtils';

const Update_GeoResourceSearchResult = 'update_geoResourceSearchResult';
const Update_LoadingPreviewFlag = 'update_loadingPreviewFlag';
const Update_ActiveLayers = 'update_activeLayers';
const Update_MapResolution = 'update_mapResolution';

/**
 * Amount of time waiting before adding a layer in ms.
 */
export const LOADING_PREVIEW_DELAY_MS = 500;

/**
 * Renders a search result item for a geoResource.
 *
 * Properties:
 * - `data`
 *
 * @class
 * @author taulinger
 */
export class GeoResourceResultItem extends MvuElement {
	constructor() {
		super({
			geoResourceSearchResult: null,
			loadingPreview: false,
			activeLayers: []
		});

		const { GeoResourceService: geoResourceService, WmsCapabilitiesService: wmsCapabilitiesService } = $injector.inject(
			'GeoResourceService',
			'WmsCapabilitiesService'
		);

		this._geoResourceService = geoResourceService;
		this._timeoutId = null;
		this._wmsCapabilitiesService = wmsCapabilitiesService;
		this._wmsLayers = null;
	}

	update(type, data, model) {
		switch (type) {
			case Update_GeoResourceSearchResult:
				return { ...model, geoResourceSearchResult: data };
			case Update_LoadingPreviewFlag:
				return { ...model, loadingPreview: data };
			case Update_ActiveLayers:
				return { ...model, activeLayers: data.map((l) => ({ geoResourceId: l.geoResourceId, id: l.id })) };
			case Update_MapResolution:
				return { ...model, mapResolution: data };
		}
	}

	onInitialize() {
		this.observe(
			(state) => state.layers.active,
			(activeLayers) => this.signal(Update_ActiveLayers, activeLayers),
			true
		);
		this.observe(
			(state) => state.ea.mapResolution,
			(mapResolution) => this.signal(Update_MapResolution, mapResolution),
			true
		);
	}

	set data(geoResourceSearchResult) {
		this.signal(Update_GeoResourceSearchResult, geoResourceSearchResult);
	}

	static _tmpLayerId(id) {
		return `tmp_${GeoResourceResultItem.name}_${id}`;
	}

	createView(model) {
		const { geoResourceSearchResult, loadingPreview, mapResolution } = model;

		const validResolution = geoResourceSearchResult && checkIfResolutionValid(geoResourceSearchResult.geoResourceId, this, mapResolution);

		const isLayerActive = (geoResourceId) => {
			return model.activeLayers
				.filter((l) => l.id !== GeoResourceResultItem._tmpLayerId(geoResourceId))
				.some((l) => l.geoResourceId === geoResourceId);
		};

		/**
		 * Uses mouseenter and mouseleave events for adding/removing a preview layer.
		 * These events are not fired on touch devices, so there's no extra handling needed.
		 */
		const onMouseEnter = (result) => {
			if (isLayerActive(result.geoResourceId)) return;

			const id = GeoResourceResultItem._tmpLayerId(result.geoResourceId);
			//add a preview layer
			this._timeoutId = setTimeout(() => {
				addLayer(id, { geoResourceId: result.geoResourceId, constraints: { hidden: true } });

				setPreviewGeoresourceId(result.geoResourceId);

				const geoRes = this._geoResourceService.byId(result.geoResourceId);

				if (geoRes instanceof GeoResourceFuture) {
					this.signal(Update_LoadingPreviewFlag, true);
					geoRes.onResolve(() => this.signal(Update_LoadingPreviewFlag, false));
				}
				fitLayer(id);
				this._timeoutId = null;
			}, LOADING_PREVIEW_DELAY_MS);
		};
		const onMouseLeave = (result) => {
			//remove the preview layer
			removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
			clearPreviewGeoresourceId();
			if (this._timeoutId) {
				clearTimeout(this._timeoutId);
				this._timeoutId = null;
			}
			this.signal(Update_LoadingPreviewFlag, false);
		};
		const onClick = (result) => {
			if (isLayerActive(result.geoResourceId)) {
				model.activeLayers.filter((l) => l.geoResourceId === result.geoResourceId).forEach((l) => removeLayer(l.id));
			} else {
				//remove the preview layer
				removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
				//add the "real" layer after some delay, which gives the user a better feedback
				const id = `${result.geoResourceId}_${createUniqueId()}`;
				const geoR = this._geoResourceService.byId(result.geoResourceId);
				const opacity = geoR?.opacity || 1;

				addLayer(id, { geoResourceId: result.geoResourceId, opacity });
			}
		};
		const getActivePreviewClass = () => {
			return loadingPreview ? 'loading' : '';
		};

		if (geoResourceSearchResult) {
			return html`
				<style>
					${css}
				</style>
				<li
					class="ba-list-item ${getActivePreviewClass()}"
					tabindex="0"
					@mouseenter=${() => onMouseEnter(geoResourceSearchResult)}
					@mouseleave=${() => onMouseLeave(geoResourceSearchResult)}
				>
					<span class="ba-list-item__pre ">
						<ba-checkbox
							id="toggle_layer"
							class="ba-list-item__text"
							@toggle=${() => onClick(geoResourceSearchResult)}
							.disabled=${!validResolution}
							.checked=${isLayerActive(geoResourceSearchResult.geoResourceId)}
							tabindex="0"
							>
							<span class="ba-list-item__text ">
								${
									loadingPreview
										? html`<ba-spinner .label=${geoResourceSearchResult.labelFormatted}></ba-spinner>`
										: html`${unsafeHTML(geoResourceSearchResult.labelFormatted)}`
								}
							</span>
						</ba-checkobx>
					</span>
				</li>
			`;
		}
		return nothing;
	}

	static get tag() {
		return 'ba-search-content-panel-georesource-item';
	}
}
