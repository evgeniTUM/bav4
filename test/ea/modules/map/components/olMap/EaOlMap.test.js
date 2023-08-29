import VectorLayer from 'ol/layer/Vector';
import { EaOlMap } from '../../../../../../src/ea/modules/map/components/olMap/EaOlMap';
import { geofeatureReducer } from '../../../../../../src/ea/store/geofeature/geofeature.reducer';
import { mapclickReducer } from '../../../../../../src/ea/store/mapclick/mapclick.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../src/injection';
import { getDefaultLayerOptions } from '../../../../../../src/modules/olMap/handler/OlLayerHandler';
import { WmsGeoResource } from '../../../../../../src/domain/geoResources';
import { addLayer, removeLayer } from '../../../../../../src/store/layers/layers.action';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { mapReducer } from '../../../../../../src/store/map/map.reducer';
import { measurementReducer } from '../../../../../../src/store/measurement/measurement.reducer';
import { createNoInitialStateMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { networkReducer } from '../../../../../../src/store/network/network.reducer';
import { notificationReducer } from '../../../../../../src/store/notifications/notifications.reducer';
import { pointerReducer } from '../../../../../../src/store/pointer/pointer.reducer';
import { changeZoom } from '../../../../../../src/store/position/position.action';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { TestUtils } from '../../../../../test-utils';
import { setMapCursorStyle } from '../../../../../../src/ea/store/module/ea.action';

window.customElements.define(EaOlMap.tag, EaOlMap);

describe('EaOlMap', () => {
	const minZoomLevel = 5;
	const maxZoomLevel = 21;

	const mapServiceStub = {
		getMinimalRotation() {
			return 0.05;
		},
		getMinZoomLevel() {
			return minZoomLevel;
		},
		getMaxZoomLevel() {
			return maxZoomLevel;
		},
		getScaleLineContainer() {}
	};

	const geoResourceServiceStub = {
		byId(id) {
			switch (id) {
				case 'geoResourceId0':
					return new WmsGeoResource(id, 'Label0', 'https://something0.url', 'layer0', 'image/png');
				case 'geoResourceId1':
					return new WmsGeoResource(id, 'Label1', 'https://something1.url', 'layer1', 'image/png');
			}
			return null;
		},
		addOrReplace() {}
	};

	const layerServiceMock = {
		toOlLayer() {}
	};

	const environmentServiceMock = {
		isTouch() {}
	};

	const measurementLayerHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'measurementLayerHandlerMockId';
		},
		get active() {
			return false;
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};
	const drawLayerHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'drawLayerHandlerMockId';
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};
	const geolocationLayerHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'geolocationLayerHandlerMockId';
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};
	const highlightLayerHandlerMock = {
		deactivate() {},
		get id() {
			return 'highlightLayerHandlerMockId';
		},
		get active() {
			return false;
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};
	const featureInfoHandlerMock = {
		register() {},
		get id() {
			return 'featureInfoHandlerMockId';
		}
	};

	const geoFeatureLayerHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'geofeatureLayerHandlerMockId';
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};

	const selectLocationLayerHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'selectLocationLayerHandlerMockId';
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};

	const elevationProfileHandlerMock = {
		register() {},
		get id() {
			return 'elevationProfileHandlerMockId';
		}
	};

	const mfpHandlerMock = {
		activate() {},
		deactivate() {},
		get id() {
			return 'mfpLayerHandlerMockId';
		},
		get options() {
			return getDefaultLayerOptions();
		}
	};

	const olElevationProfileHandlerMock = {
		register() {},
		get id() {
			return 'olElevationProfileHandlerMockId';
		}
	};

	const vectorLayerServiceMock = {};

	let store;

	const setup = (state) => {
		const defaultState = {
			position: {
				fitRequest: null
			},
			media: {
				portrait: false,
				observeResponsiveParameter: true
			}
		};

		const combinedState = {
			...defaultState,
			...state
		};

		store = TestUtils.setupStoreAndDi(combinedState, {
			map: mapReducer,
			pointer: pointerReducer,
			position: positionReducer,
			layers: layersReducer,
			measurement: measurementReducer,
			network: networkReducer,
			media: createNoInitialStateMediaReducer(),
			notifications: notificationReducer,
			geofeature: geofeatureReducer,
			mapclick: mapclickReducer,
			ea: eaReducer
		});

		$injector
			.registerSingleton('MapService', mapServiceStub)
			.registerSingleton('GeoResourceService', geoResourceServiceStub)
			.registerSingleton('EnvironmentService', environmentServiceMock)
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('OlMeasurementHandler', measurementLayerHandlerMock)
			.registerSingleton('OlDrawHandler', drawLayerHandlerMock)
			.registerSingleton('OlGeolocationHandler', geolocationLayerHandlerMock)
			.registerSingleton('OlHighlightLayerHandler', highlightLayerHandlerMock)
			.registerSingleton('OlFeatureInfoHandler', featureInfoHandlerMock)
			.registerSingleton('OlElevationProfileHandler', olElevationProfileHandlerMock)
			.registerSingleton('VectorLayerService', vectorLayerServiceMock)
			.registerSingleton('LayerService', layerServiceMock)
			.registerSingleton('OlSelectLocationHandler', selectLocationLayerHandlerMock)
			.registerSingleton('OlMfpHandler', mfpHandlerMock)
			.registerSingleton('OlGeoFeatureLayerHandler', geoFeatureLayerHandlerMock)
			.registerSingleton('ElevationProfileHandler', elevationProfileHandlerMock);

		return TestUtils.render(EaOlMap.tag);
	};

	describe('when initialized', () => {
		describe('select_location handler', () => {
			it('registers the handler', async () => {
				const element = await setup();

				expect(element._layerHandler.get('selectLocationLayerHandlerMockId')).toEqual(selectLocationLayerHandlerMock);
			});

			it('activates and deactivates the handler', async () => {
				const olLayer = new VectorLayer({});
				const activateSpy = spyOn(selectLocationLayerHandlerMock, 'activate').and.returnValue(olLayer);
				const deactivateSpy = spyOn(selectLocationLayerHandlerMock, 'deactivate').and.returnValue(olLayer);
				const element = await setup();
				const map = element._map;

				addLayer(selectLocationLayerHandlerMock.id);

				expect(activateSpy).toHaveBeenCalledWith(map);
				activateSpy.calls.reset();
				expect(deactivateSpy).not.toHaveBeenCalledWith(map);

				removeLayer(selectLocationLayerHandlerMock.id);
				expect(activateSpy).not.toHaveBeenCalledWith(map);
				expect(deactivateSpy).toHaveBeenCalledWith(map);
			});

			it('sets the map resolution', async () => {
				await setup();

				expect(store.getState().ea.mapResolution).toEqual(4891.96981025128);
			});

			it('sets the map resolution on zoom change', async () => {
				await setup();

				changeZoom(10);

				expect(store.getState().ea.mapResolution).toEqual(152.8740565703525);
			});
		});

		describe('geofeature handler', () => {
			it('registers the handler', async () => {
				const element = await setup();

				expect(element._layerHandler.get('geofeatureLayerHandlerMockId')).toEqual(geoFeatureLayerHandlerMock);
			});

			it('activates and deactivates the handler', async () => {
				const olLayer = new VectorLayer({});
				const activateSpy = spyOn(geoFeatureLayerHandlerMock, 'activate').and.returnValue(olLayer);
				const deactivateSpy = spyOn(geoFeatureLayerHandlerMock, 'deactivate').and.returnValue(olLayer);
				const element = await setup();
				const map = element._map;

				addLayer(geoFeatureLayerHandlerMock.id);

				expect(activateSpy).toHaveBeenCalledWith(map);
				activateSpy.calls.reset();
				expect(deactivateSpy).not.toHaveBeenCalledWith(map);

				removeLayer(geoFeatureLayerHandlerMock.id);
				expect(activateSpy).not.toHaveBeenCalledWith(map);
				expect(deactivateSpy).toHaveBeenCalledWith(map);
			});
		});

		it('changes mouse cursor to mapclick.mapCursorStyle', async () => {
			const element = await setup();

			expect(element._cursorStyle).toEqual('auto');
			const renderSpy = spyOn(element, 'render');

			setMapCursorStyle('crosshair');

			expect(element._cursorStyle).toEqual('crosshair');
			expect(renderSpy).toHaveBeenCalled();
		});
	});
});
