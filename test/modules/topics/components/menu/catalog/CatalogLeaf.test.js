import { CatalogLeaf } from '../../../../../../src/modules/topics/components/menu/catalog/CatalogLeaf';
import { loadExampleCatalog } from '../../../../../../src/modules/topics/services/provider/catalog.provider';
import { TestUtils } from '../../../../../test-utils.js';
import { $injector } from '../../../../../../src/injection';
import { topicsReducer } from '../../../../../../src/store/topics/topics.reducer';
import { layersReducer } from '../../../../../../src/store/layers/layers.reducer';
import { createDefaultLayerProperties } from '../../../../../../src/store/layers/layers.reducer';
import { WMTSGeoResource } from '../../../../../../src/domain/geoResources';
import { Checkbox } from '../../../../../../src/modules/commons/components/checkbox/Checkbox';
import { modalReducer } from '../../../../../../src/store/modal/modal.reducer';
import { isTemplateResult } from '../../../../../../src/utils/checks';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../../../src/utils/markup';
import { positionReducer } from '../../../../../../src/store/position/position.reducer';
import { eaReducer } from '../../../../../../src/ea/store/module/ea.reducer';
import { setMapResolution, setPreviewGeoresourceId } from '../../../../../../src/ea/store/module/ea.action';



window.customElements.define(CatalogLeaf.tag, CatalogLeaf);
window.customElements.define(Checkbox.tag, Checkbox);

describe('CatalogLeaf', () => {

	const geoResourceServiceMock = {
		byId() { }
	};

	const mapServiceMock = {
		calcResolution: () => {
			return 50;
		},
		getMaxZoomLevel: () => 100,
		getMinZoomLevel: () => 0
	};

	const wmsCapabilitiesServiceMock = { getWmsLayers: () => ([]) };

	let store;

	const layer = { ...createDefaultLayerProperties(), id: 'atkis_sw' };

	const setup = (topics = 'foo', layers = [layer], ready = true) => {

		const state = {
			topics: { current: topics },
			layers: {
				active: layers,
				ready: ready

			}
		};

		store = TestUtils.setupStoreAndDi(state, {
			topics: topicsReducer,
			layers: layersReducer,
			position: positionReducer,
			modal: modalReducer,
			ea: eaReducer
		});

		$injector
			.registerSingleton('GeoResourceService', geoResourceServiceMock)
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('MapService', mapServiceMock)
			.registerSingleton('WmsCapabilitiesService', wmsCapabilitiesServiceMock);

		return TestUtils.render(CatalogLeaf.tag);
	};

	describe('when initialized', () => {

		it('renders the nothing', async () => {

			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});
	});

	describe('when model changes', () => {

		describe('and layers are NOT yet loaded', () => {

			it('renders the nothing', async () => {
				const leaf = (await loadExampleCatalog('foo')).pop();
				const element = await setup('foo', [layer], false);

				//assign data
				element.data = leaf;

				expect(element.shadowRoot.children.length).toBe(0);
			});

		});

		describe('and layers are loaded', () => {

			it('renders a leaf', async () => {
				const geoResourceLabel = 'someLabel';
				spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(new WMTSGeoResource(layer.id, geoResourceLabel, 'someUrl'));
				//load leaf data
				const leaf = (await loadExampleCatalog('foo')).pop();
				const element = await setup();

				//assign data
				element.data = leaf;

				const checkbox = element.shadowRoot.querySelector('ba-checkbox');
				expect(checkbox).toBeTruthy();
				expect(checkbox.title).toBe(geoResourceLabel);
				expect(element.shadowRoot.querySelectorAll('.ba-icon-button')).toHaveSize(1);
				expect(element.shadowRoot.querySelector('.ba-list-item__text').innerText).toBe(geoResourceLabel);
				expect(element.shadowRoot.querySelectorAll('.ba-icon-button')).toHaveSize(1);
				expect(element.shadowRoot.querySelectorAll('ba-icon')).toHaveSize(1);

				expect(element.shadowRoot.querySelector('#info').hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
			});

			it('renders a checkbox unchecked', async () => {
				const geoResourceLabel = 'someLabel';
				spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(new WMTSGeoResource(layer.id, geoResourceLabel, 'someUrl'));
				//load leaf data
				const leaf = (await loadExampleCatalog('foo')).pop();
				const element = await setup('foo', []);

				//assign data
				element.data = leaf;

				const checkbox = element.shadowRoot.querySelector('ba-checkbox');
				expect(checkbox.checked).toBeFalse();
			});

			it('renders a checkbox checked', async () => {
				const geoResourceLabel = 'someLabel';
				spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(new WMTSGeoResource(layer.id, geoResourceLabel, 'someUrl'));
				//load leaf data
				const leaf = (await loadExampleCatalog('foo')).pop();
				const element = await setup();

				//assign data
				element.data = leaf;

				const checkbox = element.shadowRoot.querySelector('ba-checkbox');
				expect(checkbox.checked).toBeTrue();
			});

			describe('geoResource not available', () => {

				it('sets the georesourceId as fallback label', async () => {
					spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(null);
					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup();

					//assign data
					element.data = leaf;

					const checkbox = element.shadowRoot.querySelector('ba-checkbox');
					expect(checkbox.disabled).toBeTrue();
					expect(checkbox.title).toBe('topics_catalog_leaf_no_georesource_title');
					expect(element.shadowRoot.querySelector('.ba-list-item__text').innerText).toBe(layer.id);
				});
			});

			describe('resolution handling', () => {

				it('disables entry when resolution changes and wms is not shown', async () => {
					spyOn(geoResourceServiceMock, 'byId')
						.withArgs(layer.id)
						.and.returnValue(new WMTSGeoResource(layer.id, 'label', 'someUrl'));

					spyOn(wmsCapabilitiesServiceMock, 'getWmsLayers')
						.withArgs(layer.id)
						.and.returnValue([{
							minResolution: 20,
							maxResolution: 80
						}]);

					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup('foo', []);

					//assign data
					element.data = leaf;
					await TestUtils.timeout();

					setMapResolution(10);

					const checkbox = element.shadowRoot.querySelector('ba-checkbox');
					expect(checkbox.disabled).toBeTrue();
					expect(checkbox.title).toBe('ea_mainmenu_layer_not_visible');
				});
			});

			describe('mouse events', () => {

				it('sets the georesource preview id when mouse on mouseenter', async () => {
					spyOn(geoResourceServiceMock, 'byId')
						.withArgs(layer.id)
						.and.returnValue(new WMTSGeoResource(layer.id, 'label', 'someUrl'));

					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup('foo', []);

					//assign data
					element.data = leaf;

					const listItem = element.shadowRoot.querySelector('.ba-list-item');
					listItem.dispatchEvent(new Event('mouseenter'));

					expect(store.getState().ea.legendGeoresourceId).toEqual('atkis_sw');
				});

				it('removes the georesource preview id on mouseleave', async () => {
					spyOn(geoResourceServiceMock, 'byId')
						.withArgs(layer.id)
						.and.returnValue(new WMTSGeoResource(layer.id, 'label', 'someUrl'));

					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup('foo', []);

					//assign data
					element.data = leaf;
					setPreviewGeoresourceId('test-resource');

					const listItem = element.shadowRoot.querySelector('.ba-list-item');
					listItem.dispatchEvent(new Event('mouseleave'));

					expect(store.getState().ea.legendGeoresourceId).toBeNull();
				});
			});

			describe('checkbox events', () => {

				it('adds and removes a layer', async () => {
					const geoResourceLabel = 'someLabel';
					spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(new WMTSGeoResource(layer.id, geoResourceLabel, 'someUrl'));
					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup('foo', []);
					//assign data
					element.data = leaf;
					const checkbox = element.shadowRoot.querySelector('ba-checkbox');

					checkbox.click();

					expect(store.getState().layers.active[0].id).toBe(layer.id);

					checkbox.click();

					expect(store.getState().layers.active.length).toBe(0);
				});
			});

			describe('icon info events', () => {

				it('shows a georesourceinfo panel as modal', async () => {
					const geoResourceLabel = 'someLabel';
					spyOn(geoResourceServiceMock, 'byId').withArgs(layer.id).and.returnValue(new WMTSGeoResource(layer.id, geoResourceLabel, 'someUrl'));
					//load leaf data
					const leaf = (await loadExampleCatalog('foo')).pop();
					const element = await setup('foo', []);
					//assign data
					element.data = leaf;
					const icon = element.shadowRoot.querySelector('ba-icon');

					icon.click();

					expect(store.getState().modal.data.title).toBe('someLabel');
					expect(isTemplateResult(store.getState().modal.data.content)).toBeTrue();
				});
			});
		});
	});
});
