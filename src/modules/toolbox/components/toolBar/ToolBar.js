/**
 * @module modules/toolbox/components/toolBar/ToolBar
 */
import { html } from 'lit-html';
import css from './toolBar.css';
import { $injector } from '../../../../injection';
import { setCurrentTool } from '../../../../store/tools/tools.action';
import { MvuElement } from '../../../MvuElement';
import { Tools } from '../../../../domain/tools';

const Update_IsOpen = 'update_isOpen';
const Update_Fetching = 'update_fetching';
const Update_IsPortrait_HasMinWidth = 'update_isPortrait_hasMinWidth';
const Update_ToolId = 'update_toolid';

/**
 *
 * @class
 * @author alsturm
 * @author thiloSchlemmer
 * @author taulinger
 */
export class ToolBar extends MvuElement {
	constructor() {
		super({
			isOpen: true,
			isFetching: false,
			isPortrait: false,
			hasMinWidth: false,
			toolId: null
		});

		const { EnvironmentService: environmentService, TranslationService: translationService } = $injector.inject(
			'EnvironmentService',
			'TranslationService'
		);

		this._environmentService = environmentService;
		this._translationService = translationService;
	}

	update(type, data, model) {
		switch (type) {
			case Update_IsOpen:
				return { ...model, isOpen: data };
			case Update_Fetching:
				return { ...model, isFetching: data };
			case Update_IsPortrait_HasMinWidth:
				return { ...model, ...data };
			case Update_ToolId:
				return { ...model, toolId: data };
		}
	}

	onInitialize() {
		this.observe(
			(state) => state.network.fetching,
			(fetching) => this.signal(Update_Fetching, fetching)
		);
		this.observe(
			(state) => state.media,
			(media) => this.signal(Update_IsPortrait_HasMinWidth, { isPortrait: media.portrait, hasMinWidth: media.minWidth })
		);
		this.observe(
			(state) => state.tools.current,
			(current) => this.signal(Update_ToolId, current)
		);

		if (this.getModel().isPortrait || !this.getModel().hasMinWidth) {
			this.signal(Update_IsOpen, false);
		}
	}

	/**
	 * @override
	 */
	createView(model) {
		const { isFetching, isPortrait, hasMinWidth, isOpen, toolId } = model;

		const getOrientationClass = () => {
			return isPortrait ? 'is-portrait' : 'is-landscape';
		};

		const getMinWidthClass = () => {
			return hasMinWidth ? 'is-desktop' : 'is-tablet';
		};

		const getOverlayClass = () => {
			return isOpen ? 'is-open' : '';
		};

		const getButtonClass = () => {
			return isOpen ? 'hide-button' : '';
		};

		const getActiveClass = (id) => {
			return toolId === id ? 'is-active' : '';
		};

		const toggleTool = (id) => {
			const nextToolId = toolId === id ? null : id;

			setCurrentTool(nextToolId);
		};

		const getAnimatedBorderClass = () => {
			return isFetching ? 'animated-action-button__border__running' : '';
		};

		const translate = (key) => this._translationService.translate(key);

		return html`
			<style>
				${css}
			</style>
			<div class="${getOrientationClass()} ${getMinWidthClass()}">
				<button
					id="tools-button"
					data-test-id
					class="toolbar__button-tools ${getButtonClass()} "
					@click="${() => this.signal(Update_IsOpen, !isOpen)}"
				>
					<div class="wrench"></div>
				</button>
				<button id="action-button" data-test-id class="action-button">
					<div class="action-button__border animated-action-button__border ${getAnimatedBorderClass()}"></div>
					<div class="action-button__icon">
						<div class="ba"></div>
					</div>
				</button>
				<div class="tool-bar ${getOverlayClass()}">
					<button
						id="measure-button"
						data-test-id
						@click="${() => toggleTool(Tools.MEASURING)}"
						class="tool-bar__button ${getActiveClass(Tools.MEASURING)}"
					>
						<div class="tool-bar__button_icon measure"></div>
						<div class="tool-bar__button-text">${translate('toolbox_toolbar_measure_button')}</div>
					</button>
					<button id="draw-button" data-test-id @click="${() => toggleTool(Tools.DRAWING)}" class="tool-bar__button ${getActiveClass(Tools.DRAWING)}">
						<div class="tool-bar__button_icon pencil"></div>
						<div class="tool-bar__button-text">${translate('toolbox_toolbar_draw_button')}</div>
					</button>
					<button id="import-button" data-test-id @click="${() => toggleTool(Tools.IMPORT)}" class="tool-bar__button ${getActiveClass(Tools.IMPORT)}">
						<div class="tool-bar__button_icon import"></div>
						<div class="tool-bar__button-text">${translate('toolbox_toolbar_import_button')}</div>
					</button>
					<button id="export-button" data-test-id @click="${() => toggleTool(Tools.EXPORT)}" class="tool-bar__button ${getActiveClass(Tools.EXPORT)}">
						<div class="tool-bar__button_icon export"></div>
						<div class="tool-bar__button-text">${translate('toolbox_toolbar_export_button')}</div>
					</button>
					<button
						id="share-button"
						data-test-id
						@click="${() => toggleTool(Tools.SHARING)}"
						class="tool-bar__button ${getActiveClass(Tools.SHARING)}"
					>
						<div class="tool-bar__button_icon share"></div>
						<div class="tool-bar__button-text">${translate('toolbox_toolbar_share_button')}</div>
					</button>
					<button id="close-button" class="tool-bar__button tool-bar__button-close" @click="${() => this.signal(Update_IsOpen, !isOpen)}">
						<div class="tool-bar__button_icon close arrowright"></div>
					</button>
				</div>
			</div>
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get tag() {
		return 'ba-tool-bar';
	}
}
