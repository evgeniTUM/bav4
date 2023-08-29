import { html } from 'lit-html';
import { GlobalCoordinateRepresentations } from '../../../../../domain/coordinateRepresentation';
import { $injector } from '../../../../../injection';
import { setLocation, setTaggingMode } from '../../../../store/locationSelection/locationSelection.action';
import css from './analyse3d.css';
import { AbstractModuleContentPanel } from '../moduleContainer/AbstractModuleContentPanel';

const Update = 'update';
const Reset = 'reset';

const initialModel = {
	isPortrait: false,
	hasMinWidth: false,
	tagging: false,
	position: undefined
};

export class Analyse3DModuleContent extends AbstractModuleContentPanel {
	constructor() {
		super(initialModel);

		const {
			ConfigService: configService,
			EnvironmentService: environmentService,
			TranslationService: translationService,
			CoordinateService: coordinateService
		} = $injector.inject('ConfigService', 'EnvironmentService', 'TranslationService', 'CoordinateService');

		this._configService = configService;
		this._environmentService = environmentService;
		this._translationService = translationService;
		this._coordinateService = coordinateService;
		this._subscribers = [];
	}

	/**
	 * @override
	 */
	update(type, data, model) {
		switch (type) {
			case Update: {
				return { ...model, ...data };
			}
			case Reset: {
				return initialModel;
			}
		}
	}

	reset() {
		setLocation(null);
		setTaggingMode(false);
		this._subscribers.forEach((o) => o());
		this.signal(Reset);
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
		const openLinkWithCoordinates = (position) => {
			if (position) {
				const utmCoorinates = this._coordinateService.stringify(position, GlobalCoordinateRepresentations.WGS84, { digits: 5 }).replace(' ', ',');
				const url = `${this._configService.getValue('ANALYSE3D_URL')}${utmCoorinates}`;
				window.open(url, '_blank');
			}
		};

		this._subscribers = [
			this.observe(
				(state) => state.contribution.position,
				(data) => {
					this.signal(Update, { position: data });
					openLinkWithCoordinates(data);
				}
			),
			this.observe(
				(state) => state.contribution.tagging,
				(data) => {
					this.signal(Update, { tagging: data });
				}
			)
		];

		setTimeout(() => setTaggingMode(true));
	}

	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);

		return html`<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_analyse3d')}</div>
				<div class="content">
					Mit der 3D-Analyse können Sie sich in einer 3D-Landschaft Bayerns frei bewegen, Erneuerbare-Energien-Anlagen (Windenergie- und
					PV-Freiflächenanlagen) setzen und aus beliebiger Perspektive betrachten. So erhalten Sie einen Eindruck von der Sichtbarkeit geplanter
					Anlagen und dem landschaftlichen Wandel.
					<br />

					<div class="analyse3d-info">
						<div class="analyse3d-title">Start der Anwendung:</div>
						Klicken Sie in der Karte in den Bereich der geplanten Anlagen.<br />
						Die Anwendung öffnet sich im Browser.
					</div>

					<div>
						An der ausgewählten Stelle befindet sich der Mittelpunkt Ihres 3D-Projektgebietes. Es erstreckt sich über einen Radius von 15 km um diesen
						herum. Für den Wechsel in ein anderes Gebiet klicken Sie an die betreffende Stelle in der Karte links.
					</div>

					<div class="popup-hint">
						<div class="bold">Pop-ups im Browser erlaubt?</div>
						<span>Bitte das Öffnen von Pop-up-Fenstern für die Domain</span>
						<span class="bold">${window.location.hostname}</span><span>&nbsp;zulassen.</span>
					</div>
				</div>

				<div class="footer-content">
					<span
						>Weitere Informationen zur 3D-Analyse finden Sie in der
						<a target="_blank" href="https://www.energieatlas.bayern.de/hilfe/karten/HilfeZusatzfunktionen/HilfeAnalyse3D" class="link_textteil"
							>Energie-Atlas-Hilfe</a
						>.</span
					>
				</div>
			</div>`;
	}

	static get name() {
		return 'analyse3d';
	}

	static get tag() {
		return 'ea-module-analyse3d-content';
	}

	static get initialWidth() {
		return 39;
	}

	static get minWidth() {
		return 39;
	}
}
