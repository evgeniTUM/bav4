/**
 * @module modules/search/components/menu/types/geoResource/GeoResourceResultItem
 */
import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { addLayer, removeLayer } from '../../../../../../store/layers/layers.action';
import { close as closeMainMenu, setTab } from '../../../../../../store/mainMenu/mainMenu.action';
import { TabIds } from '../../../../../../domain/mainMenu';
import css from './geoResourceResultItem.css';
import { MvuElement } from '../../../../../MvuElement';
import { $injector } from '../../../../../../injection';
import { createUniqueId } from '../../../../../../utils/numberUtils';
import { fitLayer } from '../../../../../../store/position/position.action';
import { GeoResourceFuture, VectorGeoResource } from '../../../../../../domain/geoResources';
import routingSvg from '../../assets/zoomToExtent.svg';
import infoSvg from '../../assets/info.svg';
import { MenuTypes } from '../../../../../commons/components/overflowMenu/OverflowMenu';
import { openModal } from '../../../../../../store/modal/modal.action';

const Update_IsPortrait = 'update_isPortrait';
const Update_GeoResourceSearchResult = 'update_geoResourceSearchResult';
const Update_LoadingPreviewFlag = 'update_loadingPreviewFlag';

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
	#geoResourceService;
	constructor() {
		super({
			geoResourceSearchResult: null,
			isPortrait: false,
			loadingPreview: false
		});

		const { GeoResourceService: geoResourceService, TranslationService: translationService } = $injector.inject(
			'GeoResourceService',
			'TranslationService'
		);
		this.#geoResourceService = geoResourceService;
		this._translationService = translationService;
		this._timeoutId = null;
	}

	update(type, data, model) {
		switch (type) {
			case Update_GeoResourceSearchResult:
				return { ...model, geoResourceSearchResult: data };
			case Update_IsPortrait:
				return { ...model, isPortrait: data };
			case Update_LoadingPreviewFlag:
				return { ...model, loadingPreview: data };
		}
	}

	onInitialize() {
		this.observe(
			(state) => state.media,
			(media) => this.signal(Update_IsPortrait, media.portrait)
		);
	}

	set data(geoResourceSearchResult) {
		this.signal(Update_GeoResourceSearchResult, geoResourceSearchResult);
	}

	static _tmpLayerId(id) {
		return `tmp_${GeoResourceResultItem.name}_${id}`;
	}

	createView(model) {
		const { isPortrait, geoResourceSearchResult, loadingPreview } = model;
		const translate = (key) => this._translationService.translate(key);
		/**
		 * Uses mouseenter and mouseleave events for adding/removing a preview layer.
		 * These events are not fired on touch devices, so there's no extra handling needed.
		 */
		const onMouseEnter = (result) => {
			//add a preview layer if GeoResource is accessible
			if (this.#geoResourceService.isAllowed(result.geoResourceId)) {
				const id = GeoResourceResultItem._tmpLayerId(result.geoResourceId);
				this._timeoutId = setTimeout(() => {
					addLayer(id, { geoResourceId: result.geoResourceId, constraints: { hidden: true } });

					const geoRes = this.#geoResourceService.byId(result.geoResourceId);

					if (geoRes instanceof GeoResourceFuture) {
						this.signal(Update_LoadingPreviewFlag, true);
						geoRes.onResolve(() => this.signal(Update_LoadingPreviewFlag, false));
					}
					this._timeoutId = null;
				}, LOADING_PREVIEW_DELAY_MS);
			}
		};
		const onMouseLeave = (result) => {
			//remove the preview layer
			removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
			if (this._timeoutId) {
				clearTimeout(this._timeoutId);
				this._timeoutId = null;
			}
			this.signal(Update_LoadingPreviewFlag, false);
		};
		const onClick = (result) => {
			//remove the preview layer
			removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
			//add the "real" layer after some delay, which gives the user a better feedback
			const id = `${result.geoResourceId}_${createUniqueId()}`;
			//we ask the GeoResourceService for an optionally updated label
			addLayer(id, { geoResourceId: result.geoResourceId });

			if (isPortrait) {
				//close the main menu
				closeMainMenu();
			} else {
				//switch to "maps" tab in main menu
				setTab(TabIds.MAPS);
			}
		};

		const onClickZoomToExtent = (result) => {
			const id = GeoResourceResultItem._tmpLayerId(result.geoResourceId);
			fitLayer(id);
			//remove the preview layer
			removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
			if (this._timeoutId) {
				clearTimeout(this._timeoutId);
				this._timeoutId = null;
			}
			this.signal(Update_LoadingPreviewFlag, false);
		};

		const onClickOpenGeoResourceInfoPanel = async (result) => {
			const content = html`<ba-georesourceinfo-panel .geoResourceId=${result.geoResourceId}></ba-georesourceinfo-panel>`;
			openModal('label', content);
			//remove the preview layer
			removeLayer(GeoResourceResultItem._tmpLayerId(result.geoResourceId));
			if (this._timeoutId) {
				clearTimeout(this._timeoutId);
				this._timeoutId = null;
			}
			this.signal(Update_LoadingPreviewFlag, false);
		};

		const getActiveClass = () => {
			return loadingPreview ? 'loading' : '';
		};

		const getBadges = (keywords) => {
			const toBadges = (keywords) =>
				keywords.map((keyword) => html`<ba-badge .color=${'var(--text3)'} .background=${'var(--roles-color)'} .label=${keyword}></ba-badge>`);
			return keywords.length === 0 ? nothing : toBadges(keywords);
		};

		const getZoomToExtentButton = (result) => {
			const geoRes = this.#geoResourceService.byId(result.geoResourceId);
			const menuitems = [
				{ label: translate('search_result_item_info'), icon: infoSvg, action: () => onClickOpenGeoResourceInfoPanel(result) },
				{
					label: translate('search_result_item_zoom_to_extent'),
					disabled: !(geoRes instanceof VectorGeoResource) && this.#geoResourceService.isAllowed(result.geoResourceId),
					icon: routingSvg,
					action: () => onClickZoomToExtent(result)
				}
			];

			return html` <div class="ba-icon-button ba-list-item__after separator">
				<ba-overflow-menu .type=${MenuTypes.KEBAB} .items=${menuitems}></ba-overflow-menu>
			</div>`;
		};

		if (geoResourceSearchResult) {
			const keywords = [...this.#geoResourceService.getKeywords(geoResourceSearchResult.geoResourceId)];
			return html`
				<style>
					${css}
				</style>
				<li
					class="ba-list-item ${getActiveClass()}"
					tabindex="0"
					@click=${() => onClick(geoResourceSearchResult)}
					@mouseenter=${() => onMouseEnter(geoResourceSearchResult)}
					@mouseleave=${() => onMouseLeave(geoResourceSearchResult)}
				>
					<span class="ba-list-item__pre ">
						<span class="ba-list-item__icon"> </span>
					</span>
					<span class="ba-list-item__text ">
						${loadingPreview
							? html`<ba-spinner .label=${geoResourceSearchResult.labelFormatted}></ba-spinner>`
							: html`${unsafeHTML(geoResourceSearchResult.labelFormatted)} ${getBadges(keywords)}`}
					</span>
					${getZoomToExtentButton(geoResourceSearchResult)}
				</li>
			`;
		}
		return nothing;
	}

	static get tag() {
		return 'ba-search-content-panel-georesource-item';
	}
}
