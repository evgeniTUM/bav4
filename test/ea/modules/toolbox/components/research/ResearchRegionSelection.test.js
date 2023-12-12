import { AbstractModuleContentPanel } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel';
import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);

const THEME_GROUPS = [];

const themeMetadataMockFn = (themeId) => ({
	themeId,
	featureCount: 100,
	geoResourceId: 'a701a9ef-5af4-453e-8669-fd939246845f',
	propertyDefinitions: []
});

describe('ResearchModuleContent', () => {
	const testState = {};

	const researchServiceMock = {
		loadThemeGroups: () => THEME_GROUPS,
		queryMetadata: themeMetadataMockFn,
		queryFeatures: () => {}
	};

	const setup = async (customState, config = {}) => {
		const state = {
			...testState,
			...customState
		};

		const { embed = false, isTouch = false } = config;

		TestUtils.setupStoreAndDi(state, {});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed,
				isTouch: () => isTouch
			})
			.registerSingleton('TranslationService', { translate: (key) => key })
			.registerSingleton('ResearchService', researchServiceMock);
		return TestUtils.render(ResearchModuleContent.tag);
	};

	describe('class', () => {
		it('inherits from AbstracModuleContentPanel', async () => {
			const element = await setup();

			expect(element instanceof AbstractModuleContentPanel).toBeTrue();
		});
	});

	describe('theme selection', () => {
		it('shows the categories and themes', async () => {
			const element = await setup();

			await TestUtils.timeout();

			const category = element.shadowRoot.querySelector('#category');
			const theme = element.shadowRoot.querySelector('#theme');

			expect(Array.from(category.options).map((o) => o.label)).toEqual(['Group1', 'Group2']);
			expect(category.value).toEqual('Group1');

			expect(Array.from(theme.options).map((o) => o.label)).toEqual(['name1', 'name2']);
			expect(Array.from(theme.options).map((o) => o.value)).toEqual(['id1', 'id2']);
			expect(theme.value).toEqual('id1');

			category.value = 'Group2';
			category.dispatchEvent(new Event('change'));
			await TestUtils.timeout();

			expect(category.value).toEqual('Group2');
			expect(theme.value).toEqual('id3');
			expect(Array.from(theme.options).map((o) => o.label)).toEqual(['name3', 'name4']);
			expect(Array.from(theme.options).map((o) => o.value)).toEqual(['id3', 'id4']);
		});
	});
});
