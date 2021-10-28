import { LayerInfoPanel } from '../../../../src/modules/layerInfo/components/LayerInfoPanel';
import { TestUtils } from '../../../test-utils';
import { $injector } from '../../../../src/injection';
import { LayerInfo } from '../../../../src/modules/layerInfo/services/layerInfo';

window.customElements.define(LayerInfoPanel.tag, LayerInfoPanel);

describe('LayerInfoPanel', () => {

	const layerInfoServiceMock = {
		byId() { }
	};

	TestUtils.setupStoreAndDi();
	$injector.registerSingleton('LayerInfoService', layerInfoServiceMock);

	describe('when initialized', () => {

		it('should render the nothing when geoResourceId is null by default', async () => {

			const element = await TestUtils.render(LayerInfoPanel.tag);

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('should show a layerInfo on the panel', async () => {

			const layerInfo = new LayerInfo('<b>content</b>', null);
			spyOn(layerInfoServiceMock, 'byId').withArgs('914c9263-5312-453e-b3eb-5104db1bf788').and.returnValue(layerInfo);

			const element = await TestUtils.render(LayerInfoPanel.tag);

			element.geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';
			element.signal('UPDATE_LAYERINFO', layerInfo);
			const divs = element.shadowRoot.querySelectorAll('div');

			expect(divs.length).toBe(1);
			expect(divs[0].innerText).toBe('content');
		});

		it('should show the nothing when no layerinfo found', async () => {

			spyOn(layerInfoServiceMock, 'byId').withArgs('914c9263-5312-453e-b3eb-5104db1bf788').and.returnValue(Promise.reject(new Error('something got wrong')));

			const element = await TestUtils.render(LayerInfoPanel.tag);
			element.geoResourceId = '914c9263-5312-453e-b3eb-5104db1bf788';
			element.signal('UPDATE_LAYERINFO', null);

			expect(element.shadowRoot.children.length).toBe(0);
		});
	});
});
