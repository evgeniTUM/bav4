import { html, nothing } from 'lit-html';
import { setLegendGeoresourceId as setLegendGeoresourceId, clearLegendGeoresourceId as clearLegendGeoresourceId } from '../../../../../ea/store/module/module.action';
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
			TranslationService: translationService
		}
			= $injector.inject('GeoResourceService', 'TranslationService');

		this._geoResourceService = geoResourceService;
		this._translationService = translationService;
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
				setLegendGeoresourceId(geoResourceId);
			};

			const onMouseLeave = async () => {
				clearLegendGeoresourceId();
			};

			return html`
			<style>
			${css}		
			</style>
			<span class="ba-list-item" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave}>		
					<ba-checkbox class="ba-list-item__text" @toggle=${onToggle}  .disabled=${!geoR} .checked=${checked} tabindex='0' .title=${title}><span>${label}</span></ba-checkbox>						
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
		const { layers: { active: activeLayers, ready: layersStoreReady } } = globalState;

		const geoResourceId = this._catalogPart ? this._catalogPart.geoResourceId : null;
		const checked = geoResourceId ? activeLayers.map(geoResource => geoResource.id).includes(geoResourceId) : false;

		return { layersStoreReady, geoResourceId, checked };
	}


	static get tag() {
		return 'ba-catalog-leaf';
	}
}
