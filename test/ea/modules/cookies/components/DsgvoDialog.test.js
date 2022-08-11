import { parse, serialize } from 'cookie';
import { DsgvoDialog } from '../../../../../src/ea/modules/cookies/components/DsgvoDialog';
import { eaReducer } from '../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../src/injection';
import { TestUtils } from '../../../../test-utils';

window.customElements.define(DsgvoDialog.tag, DsgvoDialog);

describe('DsgvoDialog', () => {

	let store;

	const setup = async (state = {}) => {

		store = TestUtils.setupStoreAndDi(state, {
			ea: eaReducer
		});
		$injector
			.registerSingleton('TranslationService', { translate: (key) => key });

		return await TestUtils.render(DsgvoDialog.tag);
	};

	describe('rendering,', () => {
		it('is not shown when base cookie is set', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('is shown when base cookie is not set', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});

		it('is shown when base cookie is false', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: false, webanalyse: false }));

			const element = await setup();

			expect(element.shadowRoot.children.length).toBeGreaterThan(0);
		});
	});

	describe('web analytics', () => {
		it('activates web analytics if cookie eab.webanalyse is true', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: true }));

			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeTrue();
		});

		it('deactivates web analytics if cookie eab.webanalyse is false', async () => {
			document.cookie = serialize('eab', JSON.stringify({ base: true, webanalyse: false }));

			await setup();

			expect(store.getState().ea.webAnalyticsActive).toBeFalse();
		});

		it('save cookies and reload on "accept all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('acceptAll').click();

			expect(JSON.parse(parse(document.cookie).eab)).toEqual({ base: true, webanalyse: true });
			expect(element.shadowRoot.children.length).toBe(0);
		});

		it('save cookies and reload on "reject all" button click', async () => {
			document.cookie = serialize('eab', {}, { maxAge: 0 });

			const element = await setup();

			element.shadowRoot.getElementById('rejectAll').click();

			expect(JSON.parse(parse(document.cookie).eab)).toEqual({ base: true, webanalyse: false });
			expect(element.shadowRoot.children.length).toBe(0);
		});
	});
});
