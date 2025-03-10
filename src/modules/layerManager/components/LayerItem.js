/**
 * @module modules/layerManager/components/LayerItem
 */
import { html, nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { openModal } from '../../../../src/store/modal/modal.action';
import { GeoResourceFuture } from '../../../domain/geoResources';
import { checkIfResolutionValid } from '../../../ea/utils/eaUtils';
import { $injector } from '../../../injection';
import { AbstractMvuContentPanel } from '../../menu/components/mainMenu/content/AbstractMvuContentPanel';
import { modifyLayer, removeLayer } from './../../../store/layers/layers.action';
import arrowDownSvg from './assets/arrow-down-short.svg';
import arrowUpSvg from './assets/arrow-up-short.svg';
import infoSvg from './assets/info.svg';
import removeSvg from './assets/trash.svg';
import css from './layerItem.css';

const Update_Layer = 'update_layer';
const Update_Layer_Collapsed = 'update_layer_collapsed';
const Update_MapResolution = 'update_map_resolution';
const Default_Extra_Property_Values = {
	collapsed: true,
	opacity: 1,
	loading: false
};

/**
 * Child element of the LayerManager. Represents one layer and its state.
 * Events:
 * - onCollapse()
 *
 * Properties:
 * - `layer`
 *
 *
 * @class
 * @author thiloSchlemmer
 * @author taulinger
 * @author alsturm
 * @author costa_gi
 */
export class LayerItem extends AbstractMvuContentPanel {
	constructor() {
		super({
			layer: null
		});
		const { TranslationService, GeoResourceService, WmsCapabilitiesService } = $injector.inject(
			'TranslationService',
			'GeoResourceService',
			'WmsCapabilitiesService'
		);
		this._translationService = TranslationService;
		this._geoResourceService = GeoResourceService;
		this._wmsCapabilitiesService = WmsCapabilitiesService;

		this._wmsLayers = null;

		this._onCollapse = () => {};
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update_MapResolution:
				return {
					...model,
					mapResolution: data
				};

			case Update_Layer:
				return {
					...model,
					layer: {
						...data,
						visible: data.visible,
						collapsed: data.collapsed,
						opacity: data.opacity,
						loading: data.loading
					}
				};
			case Update_Layer_Collapsed:
				return { ...model, layer: { ...model.layer, collapsed: data } };
		}
	}

	/**
	 * @override
	 */
	onAfterRender(firsttime) {
		if (firsttime) {
			/* grab sliders on page */
			const sliders = this._root.querySelectorAll('input[type="range"]');

			/* take a slider element, return a percentage string for use in CSS */
			const rangeToPercent = (slider) => {
				const max = slider.getAttribute('max') || 100;
				const percent = (slider.value / max) * 100;
				return `${parseInt(percent)}%`;
			};

			/* on page load, set the fill amount */
			sliders.forEach((slider) => {
				slider.style.setProperty('--track-fill', rangeToPercent(slider));

				/* when a slider changes, update the fill prop */
				slider.addEventListener('input', (e) => {
					e.target.style.setProperty('--track-fill', rangeToPercent(e.target));
				});
			});
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);
		const { layer } = model;

		if (!layer) {
			return nothing;
		}
		const currentLabel = layer.label;
		const getCollapseTitle = () => {
			return layer.collapsed ? translate('layerManager_expand') : translate('layerManager_collapse');
		};

		const changeOpacity = (event) => {
			//state store change -> implicit call of #render()
			modifyLayer(layer.id, { opacity: parseInt(event.target.value) / 100 });
		};
		const toggleVisibility = (event) => {
			//state store change -> implicit call of #render()
			modifyLayer(layer.id, { visible: event.detail.checked });
		};
		const toggleCollapse = (e) => {
			const collapsed = !layer.collapsed;
			this.signal(Update_Layer_Collapsed, collapsed);
			this.dispatchEvent(
				new CustomEvent('collapse', {
					detail: {
						layer: { ...layer, collapsed: collapsed }
					}
				})
			);
			this._onCollapse(e);
		};
		const increaseIndex = () => {
			//state store change -> implicit call of #render()
			modifyLayer(layer.id, { zIndex: layer.zIndex + 1 });
		};
		const decreaseIndex = () => {
			//state store change -> implicit call of #render()
			if (layer.zIndex - 1 >= 0) {
				modifyLayer(layer.id, { zIndex: layer.zIndex - 1 });
			}
		};

		const remove = () => {
			//state store change -> implicit call of #render()
			removeLayer(layer.id);
		};

		const getSlider = () => {
			const onPreventDragging = (e) => {
				e.preventDefault();
				e.stopPropagation();
			};

			return html`<div class="slider-container">
				<input
					type="range"
					min="1"
					title=${translate('layerManager_opacity')}
					max="100"
					value=${layer.opacity * 100}
					class="opacity-slider"
					draggable="true"
					@input=${changeOpacity}
					@dragstart=${onPreventDragging}
					id="opacityRange"
				/>
			</div>`;
		};

		const getVisibilityTitle = () => {
			return layer.label + ' - ' + translate('layerManager_change_visibility');
		};

		const iconCollapseClass = {
			iconexpand: !layer.collapsed
		};

		const bodyCollapseClass = {
			iscollapse: layer.collapsed
		};

		const openGeoResourceInfoPanel = () => {
			const {
				layer: { label, geoResourceId }
			} = this.getModel();
			openModal(label, html`<ba-georesourceinfo-panel .geoResourceId=${geoResourceId}></ba-georesourceinfo-panel>`);
		};

		const validResolution = checkIfResolutionValid(layer.geoResourceId, this, model.mapResolution);
		this.observe(
			(state) => state.ea.mapResolution,
			(res) => this.signal(Update_MapResolution, res)
		);

		const createTitle = (validResolution) => (validResolution ? getVisibilityTitle() : translate('ea_mainmenu_layer_not_visible'));

		return html` <style>
				${css}
			</style>
			<div class="ba-section divider">
				<div class="ba-list-item">
					<ba-checkbox
						.title="${createTitle(validResolution)}"
						.disabled="${!validResolution}"
						class="ba-list-item__text"
						tabindex="0"
						.checked=${layer.visible}
						@toggle=${toggleVisibility}
						>${layer.loading ? html`<ba-spinner .label=${currentLabel}></ba-spinner>` : html`${currentLabel}`}</ba-checkbox
					>

					<button id="button-detail" data-test-id class="ba-list-item__after" title="${getCollapseTitle()}" @click="${toggleCollapse}">
						<i class="icon chevron icon-rotate-90 ${classMap(iconCollapseClass)}"></i>
					</button>
				</div>
				<div class="collapse-content  ${classMap(bodyCollapseClass)}">
					<div class="ba-list-item">
						${getSlider()}
						<div>
							<ba-icon
								id="increase"
								.icon="${arrowUpSvg}"
								.color=${'var(--primary-color)'}
								.color_hover=${'var(--text3)'}
								.size=${2.6}
								.title=${translate('layerManager_move_up')}
								@click=${increaseIndex}
							></ba-icon>
						</div>
						<div>
							<ba-icon
								id="decrease"
								.icon="${arrowDownSvg}"
								.color=${'var(--primary-color)'}
								.color_hover=${'var(--text3)'}
								.size=${2.6}
								.title=${translate('layerManager_move_down')}
								@click=${decreaseIndex}
							></ba-icon>
						</div>
						<div>
							<ba-icon
								id="remove"
								.icon="${removeSvg}"
								.color=${'var(--primary-color)'}
								.color_hover=${'var(--text3)'}
								.size=${2.6}
								.title=${translate('layerManager_remove')}
								@click=${remove}
							></ba-icon>
						</div>
						<div>
							<ba-icon
								id="info"
								.icon="${infoSvg}"
								.color=${'var(--primary-color)'}
								.color_hover=${'var(--text3)'}
								.size=${2.6}
								.title=${translate('layerManager_info')}
								.disabled=${!layer.constraints?.metaData}
								@click=${openGeoResourceInfoPanel}
							></ba-icon>
						</div>
					</div>
				</div>
			</div>`;
	}

	set layer(value) {
		const translate = (key) => this._translationService.translate(key);
		const geoResource = this._geoResourceService.byId(value.geoResourceId);

		this.signal(Update_Layer, {
			Default_Extra_Property_Values,
			...value,
			label: geoResource instanceof GeoResourceFuture ? translate('layerManager_loading_hint') : geoResource.label,
			loading: geoResource instanceof GeoResourceFuture
		});
	}

	/**
	 * @property {function} onCollapse - Callback function
	 */
	set onCollapse(callback) {
		this._onCollapse = callback;
	}

	static get tag() {
		return 'ba-layer-item';
	}
}
