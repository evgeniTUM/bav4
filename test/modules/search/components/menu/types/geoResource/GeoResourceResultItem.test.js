import { createDefaultLayer, layersReducer } from '../../../../../../../src/store/layers/layers.reducer';
import { createNoInitialStateMainMenuReducer } from '../../../../../../../src/store/mainMenu/mainMenu.reducer';
import {
	GeoResourceResultItem,
	LOADING_PREVIEW_DELAY_MS
} from '../../../../../../../src/modules/search/components/menu/types/geoResource/GeoResourceResultItem';
import { GeoResourceSearchResult } from '../../../../../../../src/modules/search/services/domain/searchResult';
import { TestUtils } from '../../../../../../test-utils.js';
import { TabIds } from '../../../../../../../src/domain/mainMenu';
import { $injector } from '../../../../../../../src/injection';
import { positionReducer } from '../../../../../../../src/store/position/position.reducer';
import { Spinner } from '../../../../../../../src/modules/commons/components/spinner/Spinner';
import { GeoResourceFuture } from '../../../../../../../src/domain/geoResources';
import { eaReducer } from '../../../../../../../src/ea/store/module/ea.reducer.js';
import { setMapResolution } from '../../../../../../../src/ea/store/module/ea.action.js';

window.customElements.define(GeoResourceResultItem.tag, GeoResourceResultItem);

describe('LAYER_ADDING_DELAY_MS', () => {
	it('exports a const defining amount of time waiting before adding a layer', async () => {
		expect(LOADING_PREVIEW_DELAY_MS).toBe(500);
	});
});

describe('GeoResourceResultItem', () => {
	const geoResourceService = {
		byId: () => {},
		addOrReplace: () => {}
	};

	const wmsCapabilitiesService = {
		getWmsLayers: () => []
	};

	let store;
	const setup = (state = {}) => {
		const initialState = {
			...state
		};

		store = TestUtils.setupStoreAndDi(initialState, {
			layers: layersReducer,
			mainMenu: createNoInitialStateMainMenuReducer(),
			position: positionReducer,
			ea: eaReducer
		});

		$injector.registerSingleton('GeoResourceService', geoResourceService);
		$injector.registerSingleton('WmsCapabilitiesService', wmsCapabilitiesService);

		return TestUtils.render(GeoResourceResultItem.tag);
	};

	describe('static methods', () => {
		it('generates an id for a temporary layer', async () => {
			expect(GeoResourceResultItem._tmpLayerId('foo')).toBe('tmp_GeoResourceResultItem_foo');
		});
	});

	describe('when initialized', () => {
		it('renders nothing when no data available', async () => {
			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('renders the view', async () => {
			const data = new GeoResourceSearchResult('id', 'label', 'labelFormatted');
			const element = await setup();

			element.data = data;

			expect(element.shadowRoot.querySelector('li').innerText).toBe('labelFormatted');
		});

		it('checkbox is not checked if layer not active', async () => {
			const geoResourceId = 'geoResourceId';
			const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
			const element = await setup();
			element.data = data;

			const checkbox = element.shadowRoot.querySelector('#toggle_layer');

			expect(checkbox.checked).toBeFalse();
		});

		it('checkbox is checked if layer already active', async () => {
			const geoResourceId = 'geoResourceId';
			const layer = createDefaultLayer('id1', geoResourceId);
			const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
			const element = await setup({
				layers: {
					active: [layer]
				}
			});
			element.data = data;

			const checkbox = element.shadowRoot.querySelector('#toggle_layer');

			expect(checkbox.checked).toBeTrue();
		});

		fit('checkbox is disabled if layer not visible', async () => {
			const geoResourceId = 'geoResourceId';
			spyOn(wmsCapabilitiesService, 'getWmsLayers')
				.withArgs(geoResourceId)
				.and.returnValue([
					{
						minResolution: 80,
						maxResolution: 20
					}
				]);

			const layer = createDefaultLayer(geoResourceId);
			const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
			const element = await setup({
				layers: {
					active: [layer]
				}
			});
			element.data = data;

			setMapResolution(10);
			await TestUtils.timeout();
			const checkbox = element.shadowRoot.querySelector('#toggle_layer');

			expect(checkbox.disabled).toBeTrue();
		});
	});

	describe('events', () => {
		beforeEach(() => {
			jasmine.clock().install();
		});

		afterEach(() => {
			jasmine.clock().uninstall();
		});

		describe('on mouse enter', () => {
			it('adds a preview layer', async () => {
				const geoResourceId = 'geoResourceId';
				const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
				const element = await setup();
				element.data = data;

				const target = element.shadowRoot.querySelector('li');
				target.dispatchEvent(new Event('mouseenter'));
				expect(element._timeoutId).not.toBeNull();
				jasmine.clock().tick(LOADING_PREVIEW_DELAY_MS + 100);

				expect(element._timeoutId).toBeNull();
				expect(store.getState().layers.active.length).toBe(1);
				expect(store.getState().layers.active[0].id).toBe(GeoResourceResultItem._tmpLayerId(geoResourceId));
				expect(store.getState().layers.active[0].constraints.hidden).toBeTrue();
				expect(store.getState().layers.active[0].geoResourceId).toBe(geoResourceId);
				expect(store.getState().position.fitLayerRequest.payload).not.toBeNull();
				expect(element.shadowRoot.querySelectorAll(Spinner.tag)).toHaveSize(0);
				expect(target.classList.contains('loading')).toBeFalse();
			});

			it('shows and hides a loading hint for a GeoResourceFuture', async () => {
				const geoResFuture = new GeoResourceFuture('geoResourceId0', async () => ({ label: 'updatedLabel' }));
				const geoResourceId = 'geoResourceId';
				const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
				const element = await setup();
				spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResFuture);
				element.data = data;

				const target = element.shadowRoot.querySelector('li');
				target.dispatchEvent(new Event('mouseenter'));
				jasmine.clock().tick(LOADING_PREVIEW_DELAY_MS + 100);

				expect(store.getState().layers.active.length).toBe(1);
				expect(store.getState().layers.active[0].id).toBe(GeoResourceResultItem._tmpLayerId(geoResourceId));
				expect(store.getState().layers.active[0].geoResourceId).toBe(geoResourceId);
				expect(store.getState().position.fitLayerRequest.payload).not.toBeNull();
				expect(element.shadowRoot.querySelectorAll(Spinner.tag)).toHaveSize(1);
				expect(element.shadowRoot.querySelector(Spinner.tag).label).toBe('labelFormatted');
				expect(target.classList.contains('loading')).toBeTrue();

				await geoResFuture.get();

				expect(element.shadowRoot.querySelectorAll(Spinner.tag)).toHaveSize(0);
				expect(target.classList.contains('loading')).toBeFalse();
				expect(element.shadowRoot.querySelector('li').innerText).toBe('labelFormatted');
			});
		});

		describe('on mouse leave', () => {
			it('removes the preview layer', async () => {
				const geoResourceId = 'geoResourceId';
				const previewLayer = createDefaultLayer(GeoResourceResultItem._tmpLayerId(geoResourceId), geoResourceId);
				const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
				const element = await setup({
					layers: {
						active: [previewLayer]
					}
				});
				element.data = data;

				const target = element.shadowRoot.querySelector('li');
				target.dispatchEvent(new Event('mouseleave'));

				expect(store.getState().layers.active.length).toBe(0);
			});

			it('clears a GeoResourceFuture timeout function', async () => {
				const geoResFuture = new GeoResourceFuture('geoResourceId0', async () => ({ label: 'updatedLabel' }));
				const geoResourceId = 'geoResourceId';
				const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
				const element = await setup();
				spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResFuture);
				element.data = data;
				const target = element.shadowRoot.querySelector('li');

				target.dispatchEvent(new Event('mouseenter'));
				expect(element.__timeoutId).not.toBeNull();

				target.dispatchEvent(new Event('mouseleave'));

				expect(element._timeoutId).toBeNull();
			});
		});

		describe('on click', () => {
			const geoResourceId = 'geoResourceId';
			// const layerId = 'layerId';

			const setupOnClickTests = async () => {
				const previewLayer = createDefaultLayer(GeoResourceResultItem._tmpLayerId(geoResourceId), geoResourceId);
				const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
				const element = await setup({
					layers: {
						active: [previewLayer]
					},
					mainMenu: {
						tab: TabIds.SEARCH,
						open: true
					}
				});
				element.data = data;

				return element;
			};

			it('removes the preview layer and adds the real layer', async () => {
				const element = await setupOnClickTests();
				const target = element.shadowRoot.querySelector('li');

				target.click();

				expect(store.getState().layers.active.length).toBe(1);
				expect(store.getState().layers.active[0].id).toContain(geoResourceId);
			});

			it('sets the opacity to 1 if layer is unknown', async () => {
				const element = await setupOnClickTests();
				const target = element.shadowRoot.querySelector('li');
				spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(null);

				target.click();

				expect(store.getState().layers.active.length).toBe(1);
				expect(store.getState().layers.active[0].opacity).toBe(1);
			});

			it('sets the opacity to the the correct value', async () => {
				const element = await setupOnClickTests();
				spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue({ opacity: 0.5 });

				const checkbox = element.shadowRoot.querySelector('#toggle_layer');

				checkbox.dispatchEvent(
					new CustomEvent('toggle', {
						detail: { checked: true }
					})
				);

				expect(store.getState().layers.active[0].opacity).toBe(0.5);
			});
		});

		describe('when this geoResourceId is already active', () => {
			const layerId1 = 'layerId0';
			const geoResourceId = 'geoResourceId';
			const layer1 = {
				constraints: [],
				id: layerId1,
				geoResourceId,
				visible: false,
				zIndex: 0
			};
			const layerId2 = 'layerId0';
			const layer2 = {
				constraints: [],
				id: layerId2,
				geoResourceId,
				visible: false,
				zIndex: 0
			};

			describe('on mouse enter', () => {
				it('does not add a preview layer', async () => {
					const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
					const state = {
						layers: {
							active: [layer1, layer2],
							background: 'bg0'
						}
					};
					const element = await setup(state);
					element.data = data;

					const target = element.shadowRoot.querySelector('li');
					target.dispatchEvent(new Event('mouseenter'));
					expect(element._timeoutId).toBeNull();
					jasmine.clock().tick(LOADING_PREVIEW_DELAY_MS + 100);

					expect(element._timeoutId).toBeNull();
					expect(store.getState().layers.active.length).toBe(2);
					expect(store.getState().layers.active[0].id).toBe(layerId1);
					expect(store.getState().layers.active[1].id).toBe(layerId2);
				});
			});

			describe('on click', () => {
				const setupOnClickTests = async () => {
					const data = new GeoResourceSearchResult(geoResourceId, 'label', 'labelFormatted');
					const state = {
						layers: {
							active: [layer1, layer2]
						},
						mainMenu: {
							tab: TabIds.SEARCH,
							open: true
						}
					};
					const element = await setup(state);
					element.data = data;

					return element;
				};

				it('removes all layers with this geoResourceId', async () => {
					const element = await setupOnClickTests();
					const checkbox = element.shadowRoot.querySelector('#toggle_layer');

					checkbox.dispatchEvent(
						new CustomEvent('toggle', {
							detail: { checked: true }
						})
					);

					expect(store.getState().layers.active.length).toBe(0);
				});
			});
		});
	});
});
