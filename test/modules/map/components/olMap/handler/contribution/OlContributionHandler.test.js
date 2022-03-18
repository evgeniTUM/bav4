import { DrawEvent } from 'ol/interaction/Draw';
import { Style } from 'ol/style';
import { $injector } from '../../../../../../../src/injection';
import { CONTRIBUTION_LAYER_ID, OlContributionHandler } from '../../../../../../../src/modules/map/components/olMap/handler/contribution/OlContributionHandler';
import { OverlayService } from '../../../../../../../src/modules/map/components/olMap/services/OverlayService';
import { DRAW_LAYER_ID } from '../../../../../../../src/plugins/DrawPlugin';
import { IconResult } from '../../../../../../../src/services/IconService';
import { drawReducer, INITIAL_STYLE } from '../../../../../../../src/store/draw/draw.reducer';
import { layersReducer } from '../../../../../../../src/store/layers/layers.reducer';
import { measurementReducer } from '../../../../../../../src/store/measurement/measurement.reducer';
import { notificationReducer } from '../../../../../../../src/store/notifications/notifications.reducer';
import { sharedReducer } from '../../../../../../../src/store/shared/shared.reducer';
import { toolsReducer } from '../../../../../../../src/store/tools/tools.reducer';
import { TestUtils } from '../../../../../../test-utils.js';




describe('OlContribution', () => {
	class MockClass {
		constructor() {
			this.get = 'I\'m a StyleService.';
		}

		addStyle() { }

		updateStyle() { }

		removeStyle() { }

		getStyleFunction() {
			const styleFunction = () => {
				const styles = [
					new Style()
				];

				return styles;
			};

			return styleFunction;
		}

	}


	const geoResourceServiceMock = {
		addOrReplace() { },
		// eslint-disable-next-line no-unused-vars
		byId() {
			return null;
		}
	};

	const interactionStorageServiceMock = {
		async store() { },
		isValid() {
			return false;
		},
		isStorageId() {
			return false;
		},
		setStorageId() { },
		getStorageId() {
			return null;
		}
	};

	const fileStorageServiceMock = {
		async save() {
			return { fileId: 'saveFooBarBazId' };
		},
		isFileId(id) {
			return id.startsWith('f_');
		},
		isAdminId(id) {
			return id.startsWith('a_');
		}

	};

	const translationServiceMock = { translate: (key) => key };
	const environmentServiceMock = { isTouch: () => false, isStandalone: () => false };
	const initialState = {
		active: false,
		mode: null,
		type: null,
		style: INITIAL_STYLE,
		reset: null,
		description: null,
		fileSaveResult: { adminId: 'init', fileId: 'init' }
	};

	const setup = (state = initialState) => {
		const drawState = {
			draw: state,
			layers: {
				active: [],
				background: 'null'
			},
			shared: {
				termsOfUseAcknowledged: false,
				fileSaveResult: null
			},
			notifications: {
				notification: null
			}
		};
		const store = TestUtils.setupStoreAndDi(drawState, { draw: drawReducer, measurement: measurementReducer, layers: layersReducer, shared: sharedReducer, notifications: notificationReducer, tools: toolsReducer });
		$injector.registerSingleton('TranslationService', translationServiceMock)
			.registerSingleton('MapService', { getSrid: () => 3857, getDefaultGeodeticSrid: () => 25832 })
			.registerSingleton('EnvironmentService', environmentServiceMock)
			.registerSingleton('GeoResourceService', geoResourceServiceMock)
			.registerSingleton('InteractionStorageService', interactionStorageServiceMock)
			.registerSingleton('FileStorageService', fileStorageServiceMock)
			.registerSingleton('IconService', { getDefault: () => new IconResult('foo', 'bar') })
			.registerSingleton('UnitsService', {
				// eslint-disable-next-line no-unused-vars
				formatDistance: (distance, decimals) => {
					return distance + ' m';
				},
				// eslint-disable-next-line no-unused-vars
				formatArea: (area, decimals) => {
					return area + ' m²';
				}
			})
			.register('OverlayService', OverlayService)
			.register('StyleService', MockClass);
		return store;
	};

	const simulateDrawEvent = (type, draw, feature) => {
		const eventType = type;
		const drawEvent = new DrawEvent(eventType, feature);

		draw.dispatchEvent(drawEvent);
	};

	const simulateKeyEvent = (keyCode) => {
		const keyEvent = new KeyboardEvent('keyup', { keyCode: keyCode, which: keyCode });

		document.dispatchEvent(keyEvent);
	};

	it('has two methods', () => {
		setup();
		const handler = new OlContributionHandler();
		expect(handler).toBeTruthy();
		expect(handler.activate).toBeTruthy();
		expect(handler.deactivate).toBeTruthy();
		expect(handler.id).toBe(CONTRIBUTION_LAYER_ID);
	});

});



