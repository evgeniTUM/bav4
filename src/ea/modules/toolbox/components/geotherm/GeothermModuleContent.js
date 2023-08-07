import { html } from 'lit-html';
import { $injector } from '../../../../../injection';
import { setLocation, setTaggingMode } from '../../../../store/contribution/contribution.action';
import { AbstractModuleContentPanel } from '../../components/moduleContainer/AbstractModuleContentPanel';
import { MODUS } from './CheckModus';
import css from './container.css';
import collapsableContentCss from './collapsableContent.css';
import { BvvCoordinateRepresentations, GlobalCoordinateRepresentations } from '../../../../../domain/coordinateRepresentation';

const Reset = 'reset';
const ActivateMapClick = 'activateMapclick';
const Update = 'update';
const Position_Change = 'position_change';

const initialModel = {
	mode: undefined,
	isPortrait: false,
	hasMinWidth: false,
	position: undefined,
	additionalInfo: '',
	statusMessage: undefined,
	openSections: ['step1']
};

export class GeothermModuleContent extends AbstractModuleContentPanel {
	constructor() {
		super(initialModel);

		const {
			EnvironmentService: environmentService,
			ConfigService: configService,
			TranslationService: translationService,
			CoordinateService: coordinateService,
			MapService: mapService
		} = $injector.inject('EnvironmentService', 'ConfigService', 'TranslationService', 'CoordinateService', 'MapService');

		this._environmentService = environmentService;
		this._configService = configService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;
		this._mapService = mapService;
	}

	_getCoordinatesString(position) {
		const transformedCoord = this._coordinateService.transform(position, this._mapService.getSrid(), GlobalCoordinateRepresentations.WGS84);
		return transformedCoord;
	}

	_getReportUrl(model) {
		let url;
		if (model.mode === MODUS.sonden) {
			url = `${this._configService.getValue('GEOTHERM_CHECK_URL_SONDEN')}`;
		} else if (model.mode === MODUS.kollektoren) {
			url = `${this._configService.getValue('GEOTHERM_CHECK_URL_KOLLEKTOREN')}`;
		} else if (model.mode === MODUS.pumpen) {
			url = `${this._configService.getValue('GEOTHERM_CHECK_URL_PUMPEN')}`;
		}
		// dynamische Parameter
		const wgs84_coordinate = this._getCoordinatesString(model.position);
		const params = '&location=' + wgs84_coordinate[0] + ',' + wgs84_coordinate[1];
		url = url + params;
		return url;
	}
	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Reset:
				return { ...initialModel, ...data };

			case Update: {
				return { ...model, ...data };
			}
			case ActivateMapClick: {
				//				setLocation(null);
				//				setTaggingMode(true);
				return { ...model, ...data };
			}
			case Position_Change: {
				if (model.position !== null) {
					//feature listener austrixen
					setTimeout(() => {
						setTaggingMode(false);
					}, 500);
					window.open(this._getReportUrl(model), '_blank');
					return { ...model, mode: undefined, openSections: 'step1' };
				}
				return model;
			}
		}
	}
	reset() {
		setLocation(null);
		setTaggingMode(false);
		this.signal(Reset, {
			mode: undefined
		});
	}
	/**
	 * @override
	 */
	onDisconnect() {
		this.reset();
	}
	/**
	 * @override
	 */
	onInitialize() {
		this.observe(
			(state) => state.contribution,
			(data) => this.signal(Update, data)
		);
		this.observe(
			(state) => state.contribution.position,
			(data) => this.signal(Position_Change, data),
			false
		);
	}
	/**
	 * @override
	 */
	createView(model) {
		const translate = (key) => this._translationService.translate(key);

		const onToggle = (e) => {
			this.signal(Update, { openSections: [e.target.id] });
		};

		const onClickRequestButton = (mode) => () => {
			setLocation(null);
			setTaggingMode(true);
			this.signal(ActivateMapClick, { mode, openSections: ['step1', 'step2'] });
		};

		const introduction = html`<div class="introduction">
			<div class=".ba-tool-container__content">${translate('ea_geotherm_check_introduction')}</div>
		</div>`;

		const stepTitle = (text, subtext) =>
			html` <span style="color: var(--primary-color)">${text}${subtext ? ':' : ''}</span>
				<span style="font-style: italic">${subtext}</span>`;

		const firstButtonClass = model.mode ? (model.mode === MODUS.sonden ? 'active' : 'inactive') : 'unselected';
		const secondButtonClass = model.mode ? (model.mode === MODUS.kollektoren ? 'active' : 'inactive') : 'unselected';
		const thirdButtonClass = model.mode ? (model.mode === MODUS.pumpen ? 'active' : 'inactive') : 'unselected';

		const firstButton = html`
			<button
				class="button-container button"
				id="sonde"
				type="button"
				class=${firstButtonClass}
				@click=${onClickRequestButton(MODUS.sonden)}
				title=${translate('ea_geotherm_check_sonden_button_tag_tooltip')}
			>
				${translate('ea_geotherm_check_sonden_button_tag_title')}
			</button>
		`;

		const secondButton = html`
			<button
				class="button-container button"
				id="kollektor"
				type="button"
				class=${secondButtonClass}
				@click=${onClickRequestButton(MODUS.kollektoren)}
				title=${translate('ea_geotherm_check_kollektoren_button_tag_tooltip')}
			>
				${translate('ea_geotherm_check_kollektoren_button_tag_title')}
			</button>
		`;

		const thirdButton = html`
			<button
				class="button-container button"
				id="pumpe"
				type="button"
				class=${thirdButtonClass}
				@click=${onClickRequestButton(MODUS.pumpen)}
				title=${translate('ea_geotherm_check_pumpen_button_tag_tooltip')}
			>
				<span>${translate('ea_geotherm_check_pumpen_button_tag_title')}</span>
			</button>
		`;

		return html`
			<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_geotherm')}</div>
				<div class="content">
					${introduction}

					<collapsable-content
						id="step1"
						.customCSS=${collapsableContentCss}
						.title=${stepTitle('Schritt 1', 'Technik wählen')}
						.open=${model.openSections.includes('step1')}
						@toggle=${onToggle}
					>
						<ul class="ba-list button-container">
							<li class="ba-list-item  ba-list-inline ba-list-item__header">
								<span class="ba-list-item__pre"> ${firstButton} </span>
							</li>
							<li class="ba-list-item  ba-list-inline ba-list-item__header">
								<span class="ba-list-item__pre"> ${secondButton} </span>
							</li>
							<li class="ba-list-item  ba-list-inline ba-list-item__header">
								<span class="ba-list-item__pre"> ${thirdButton} </span>
							</li>
						</ul>
						<br />
					</collapsable-content>
					<collapsable-content
						id="step2"
						.customCSS=${collapsableContentCss}
						.title=${stepTitle('Schritt 2', 'Standort wählen')}
						.open=${model.openSections.includes('step2')}
						@toggle=${onToggle}
					>
						<br />
						Klicken Sie nun in die Karte um Ihren gewünschten Standort auszuwählen.
						<div>
							<span>Es öffnet sich ein PDF mit Infos zu:</span>
							<ul>
								<li>Voraussichtlicher Eignung</li>
								<li>Genehmigung</li>
								<li>Kontaktdaten zur zuständigen Behörde</li>
							</ul>
							<div class="popup-hint">
								<div class="bold">Pop-ups im Browser erlaubt?</div>
								<span>Bitte das Öffnen von Pop-up-Fenstern für die Domain</span>
								<span class="bold">${window.location.hostname}</span>
								<span>&nbsp;zulassen.</span>
							</div>
						</div>
					</collapsable-content>
					<div class="footer-content">
						<span
							>${translate('ea_geotherm_footer')}
							<a target="_blank" class="link_textteil">Oberfl&auml;chennahe Geothermie: Standortauskunft</a>.</span
						>
					</div>
				</div>
			</div>
		`;
	}

	isRenderingSkipped() {
		return this._environmentService.isEmbedded();
	}

	static get name() {
		return 'geotherm';
	}

	static get tag() {
		return 'ea-module-geotherm-content';
	}

	static get initialWidth() {
		return 39;
	}

	static get minWidth() {
		return 39;
	}
}
