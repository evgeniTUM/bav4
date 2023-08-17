import { html } from 'lit-html';
import { GlobalCoordinateRepresentations } from '../../../../../domain/coordinateRepresentation';
import { $injector } from '../../../../../injection';
import { AbstractMvuContentPanel } from '../../../../../modules/menu/components/mainMenu/content/AbstractMvuContentPanel';
import { setLocation, setTaggingMode } from '../../../../store/contribution/contribution.action';
import css from './analyse3d.css';

const Update = 'update';
const Reset = 'reset';

const initialModel = {
	isPortrait: false,
	hasMinWidth: false,
	tagging: false,
	position: undefined
};

export class Analyse3DModuleContent extends AbstractMvuContentPanel {
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
	onAfterRender() {
		setTaggingMode(true);
	}

	/**
	 * @override
	 */
	onInitialize() {
		const openLinkWithCoordinates = (position) => {
			// if (position) {
			// 	const utmCoorinates = this._coordinateService.stringify(position, GlobalCoordinateRepresentations.WGS84, { digits: 5 }).replace(' ', ',');
			// 	const url = `${this._configService.getValue('ANALYSE3D_URL')}${utmCoorinates}`;
			// 	window.open(url, '_blank');
			// }
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
	}

	/**
	 * @override
	 */
	createView() {
		const translate = (key) => this._translationService.translate(key);

		return html` <div>
			<style>
				${css}
			</style>
			<div class="container">
				<div class="header">${translate('ea_menu_analyse3d')}</div>
				<div class="content"></div>
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
