import { html, nothing } from 'lit-html';
import { clearPreviewGeoresourceId, setPreviewGeoresourceId } from '../../../../../ea/store/module/ea.action';
import { $injector } from '../../../../../injection';
import { addLayer, removeLayer } from '../../../../../store/layers/layers.action';
import { openModal } from '../../../../../store/modal/modal.action';
import { AbstractContentPanel } from '../../../../menu/components/mainMenu/content/AbstractContentPanel';
import infoSvg from '../assets/info.svg';
import css from './catalogLeaf.css';

/**
 * @class
 * @author taulinger
 * @author alsturm
 * @author costa_gi
 */
export class CatalogLeaf extends AbstractContentPanel {

	constructor() {
		super();

		const {
			GeoResourceService: geoResourceService,
			TranslationService: translationService,
			MapService: mapService,
			WmsCapabilitiesService: wmsCapabilitiesService
		}
			= $injector.inject('GeoResourceService', 'TranslationService', 'MapService', 'WmsCapabilitiesService');

		this._geoResourceService = geoResourceService;
		this._translationService = translationService;
		this._mapService = mapService;
		this._wmsCapabilitiesService = wmsCapabilitiesService;

		this._wmsLayers = [];
	}

	set data(catalogPart) {
		this._catalogPart = catalogPart;
		this.updateState();
	}


	createView(state) {

		const { layersStoreReady, checked, geoResourceId } = state;
		const translate = (key) => this._translationService.translate(key);

		if (geoResourceId && layersStoreReady) {

			const geoR = this._geoResourceService.byId(geoResourceId);
			const label = geoR ? geoR.label : geoResourceId;
			const title = geoR ? geoR.label : translate('topics_catalog_leaf_no_georesource_title');

			const onToggle = (event) => {
				if (event.detail.checked) {
					addLayer(geoR.id, { label: geoR.label });
				}
				else {
					removeLayer(geoR.id);
				}
			};

			const openGeoResourceInfoPanel = async () => {
				const content = html`<ba-georesourceinfo-panel .geoResourceId=${geoResourceId}></ba-georesourceinfo-panel>`;
				openModal(label, content);
			};

			const onMouseEnter = async () => {
				setPreviewGeoresourceId(geoResourceId);
			};

			const onMouseLeave = async () => {
				clearPreviewGeoresourceId();
			};


			let validResolution = true;
			if (this._wmsLayers.length > 0) {
				const resolution = state.mapResolution;
				validResolution = this._wmsLayers
					.some(l => resolution > l.maxResolution && resolution < l.minResolution);
			}
			else {
				setTimeout(async () => {
					this._wmsLayers = await this._wmsCapabilitiesService.getWmsLayers(geoResourceId);
					this.updateState();
				});
			}
			const createTitle = (text, validResolution) =>
				validResolution ? text : title + translate('ea_notification_layer_not_visible');


			return html`
			<style>
			${css}		
			</style>
			<span class="ba-list-item" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave}>		
					<ba-checkbox class="ba-list-item__text" @toggle=${onToggle}  .disabled=${!geoR || (!validResolution && !checked)} .checked=${checked} tabindex='0' .title=${createTitle(title, validResolution)}><span>${label}</span></ba-checkbox>						
					<div class="ba-icon-button ba-list-item__after vertical-center separator">									                                                                                          
						<ba-icon id='info' data-test-id .icon='${infoSvg}' .color=${'var(--primary-color)'} .color_hover=${'var(--text3)'} .size=${2} .title=${translate('layerManager_move_up')} @click=${openGeoResourceInfoPanel}></ba-icon>                    							 
					</div>
				</span>
        	`;
		}
		return nothing;
	}

	extractState(globalState) {
		//our local state contains values derived form the global state and local data (_catalogPart)
		const {
			layers: { active: activeLayers, ready: layersStoreReady },
			ea: { mapResolution }
		} = globalState;

		const geoResourceId = this._catalogPart ? this._catalogPart.geoResourceId : null;
		const checked = geoResourceId ? activeLayers.map(geoResource => geoResource.id).includes(geoResourceId) : false;

		return { layersStoreReady, geoResourceId, checked, mapResolution };
	}


	static get tag() {
		return 'ba-catalog-leaf';
	}
}
