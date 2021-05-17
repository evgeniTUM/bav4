import { BaseLayerInfo } from '../../../../../src/modules/footer/components/baseLayerInfo/BaseLayerInfo';
import { TestUtils } from '../../../../test-utils.js';
import { layersReducer, defaultLayerProperties } from '../../../../../src/store/layers/layers.reducer';
import { positionReducer } from '../../../../../src/store/position/position.reducer';
import { addLayer, removeLayer, modifyLayer } from '../../../../../src/store/layers/layers.action';
import { WMTSGeoResource } from '../../../../../src/services/domain/geoResources';
import { $injector } from '../../../../../src/injection';


window.customElements.define(BaseLayerInfo.tag, BaseLayerInfo);

describe('BaseLayerInfo', () => {

	const geoResourceServiceMock = {
		byId: () => { }
	};

	const setup = (state) => {
		TestUtils.setupStoreAndDi(state, {
			layers: layersReducer,
			position: positionReducer
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key });
		$injector
			.registerSingleton('GeoResourceService', geoResourceServiceMock);
		return TestUtils.render(BaseLayerInfo.tag);
	};

	describe('when initialized', () => {
		it('renders BaseLayerInfo component', async () => {
			const layer = { ...defaultLayerProperties, id: 'id0', label: 'label0' };
			const state = {
				layers: {
					active: [layer]
				},
				position: {
					zoom: 12
				}
			};

			const wmts = new WMTSGeoResource('someId', 'LDBV42', 'https://some{1-2}/layer/{z}/{x}/{y}');
			const geoServiceMock = spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(wmts);

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('map_baseLayerInfo_label');
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('LDBV42');
			expect(geoServiceMock).toHaveBeenCalledOnceWith(layer.id);
		});

		it('renders BaseLayerInfo component with georesource.getAttribution', async () => {
			const layer = { ...defaultLayerProperties, id: 'id0', label: 'label0' };
			const state = {
				layers: {
					active: [layer]
				},
				position: {
					zoom: 12
				}
			};

			const wmts = new WMTSGeoResource('someId', 'LDBV42', 'https://some{1-2}/layer/{z}/{x}/{y}');
			const geoServiceMock = spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(wmts);

			const attribution = { description: 'Ref42' };
			const getAttrMock = spyOn(wmts, 'getAttribution');
			getAttrMock.withArgs(12).and.returnValue([attribution]);

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('map_baseLayerInfo_label');
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain(attribution.description);

			expect(geoServiceMock).toHaveBeenCalledOnceWith(layer.id);
			expect(getAttrMock).toHaveBeenCalledOnceWith(12);
		});

		it('renders nothing when no layers are set', async () => {
			const stateEmpty = {
				layers: {
					active: []
				},
				position: {
					zoom: 12
				}
			};

			const element = await setup(stateEmpty);

			expect(element.shadowRoot.querySelector('div')).toBeFalsy();
		});

		it('renders nothing when geo resource could not be fetched', async () => {
			const layer = { ...defaultLayerProperties, id: 'id0', label: 'label0' };
			const state = {
				layers: {
					active: [layer]
				},
				position: {
					zoom: 12
				}
			};
			const geoServiceMock = spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(null);

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('div')).toBeFalsy();
			expect(geoServiceMock).toHaveBeenCalledOnceWith(layer.id);
		});

		it('renders fallback content if label is undefined', async () => {
			const layer = { ...defaultLayerProperties, id: 'id0', label: 'label0' };
			const state = {
				layers: {
					active: [layer]
				},
				position: {
					zoom: 12
				}
			};

			const wmts = new WMTSGeoResource('someId', null, 'https://some{1-2}/layer/{z}/{x}/{y}');
			const geoServiceMock = spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(wmts);

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('map_baseLayerInfo_fallback');
			expect(geoServiceMock).toHaveBeenCalledOnceWith(layer.id);

		});

		it('updates BaseLayerInfo component', async () => {
			const layer = { ...defaultLayerProperties, id: 'id0', label: 'label0', zIndex: 0 };
			const layer2 = { ...defaultLayerProperties, id: 'id1', label: 'label1', zIndex: 0 };
			const state = {
				layers: {
					active: [layer]
				}
			};

			const wmts = new WMTSGeoResource('someId', 'LDBV', 'https://some{1-2}/layer/{z}/{x}/{y}');
			const wmts2 = new WMTSGeoResource('someId2', 'Ref42', 'https://some{1-2}/layer/{z}/{x}/{y}');

			const geoServiceMock = spyOn(geoResourceServiceMock, 'byId');
			geoServiceMock.withArgs(layer.id).and.returnValue(wmts);
			geoServiceMock.withArgs(layer2.id).and.returnValue(wmts2);

			const element = await setup(state);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('LDBV');
			expect(element.shadowRoot.querySelector('div').innerHTML).not.toContain('Ref42');

			addLayer(layer2.id, layer2);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('Ref42');
			expect(element.shadowRoot.querySelector('div').innerHTML).not.toContain('LDBV');

			modifyLayer(layer.id, { zIndex: 0 });

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('LDBV');
			expect(element.shadowRoot.querySelector('div').innerHTML).not.toContain('Ref42');

			removeLayer(layer.id);

			expect(element.shadowRoot.querySelector('div')).toBeTruthy();
			expect(element.shadowRoot.querySelector('div').innerHTML).toContain('Ref42');
			expect(element.shadowRoot.querySelector('div').innerHTML).not.toContain('LDBV');

			expect(geoServiceMock).toHaveBeenCalledWith(layer.id);
			expect(geoServiceMock).toHaveBeenCalledWith(layer2.id);
		});
	});
});