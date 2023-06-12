import { $injector } from '../../../../../src/injection';
import { ExportVectorDataChip } from '../../../../../src/modules/export/components/assistChip/ExportVectorDataChip';
import { ExportDialogContent } from '../../../../../src/modules/export/components/dialog/ExportDialogContent';
import { modalReducer } from '../../../../../src/store/modal/modal.reducer';
import { TestUtils } from '../../../../test-utils';
import downloadSvg from '../../../../../src/modules/export/components/assistChip/assets/download.svg';

window.customElements.define(ExportDialogContent.tag, ExportDialogContent);
window.customElements.define(ExportVectorDataChip.tag, ExportVectorDataChip);

describe('ExportVectorDataChip', () => {
	let store;

	const geoResourceServiceMock = {
		async init() {},
		all() {},
		byId() {}
	};

	const setup = async () => {
		const windowMock = { navigator: {}, open() {} };
		store = TestUtils.setupStoreAndDi({}, { modal: modalReducer });
		$injector
			.registerSingleton('EnvironmentService', {
				getWindow: () => windowMock
			})
			.registerSingleton('GeoResourceService', geoResourceServiceMock)
			.registerSingleton('TranslationService', { translate: (key) => key });

		return TestUtils.render(ExportVectorDataChip.tag);
	};

	describe('when instantiated', () => {
		it('has a model containing default values', async () => {
			const element = await setup();

			expect(element.getModel()).toEqual({ data: null });
		});

		it('properly implements abstract methods', async () => {
			const element = await setup();

			expect(element.getLabel()).toBe('chips_assist_chip_export');
			expect(element.getIcon()).toBe(downloadSvg);
		});
	});

	describe('when initialized', () => {
		it('renders the view with given exportData', async () => {
			const element = await setup();
			element.exportData = 'some';

			expect(element.isVisible()).toBeTrue();
		});

		it('does NOT renders the view with missing exportData', async () => {
			const element = await setup();

			expect(element.isVisible()).toBeFalse();
		});
	});

	describe('when chip is clicked', () => {
		it('opens the modal with the exportDialogContent component and exportData', async () => {
			const element = await setup();
			element.exportData = 'some';

			const button = element.shadowRoot.querySelector('button');
			button.click();

			await TestUtils.timeout();

			expect(store.getState().modal.data.title).toBe('export_assistChip_export_vector_data');

			const contentElement = TestUtils.renderTemplateResult(store.getState().modal.data.content);
			expect(contentElement.querySelectorAll('ba-export-content')).toHaveSize(1);
		});
	});
});
