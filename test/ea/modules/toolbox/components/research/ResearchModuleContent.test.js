import { Types } from '../../../../../../src/ea/domain/researchTypes';
import { AbstractModuleContentPanel } from '../../../../../../src/ea/modules/toolbox/components/moduleContainer/AbstractModuleContentPanel';
import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { $injector } from '../../../../../../src/injection';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(ResearchModuleContent.tag, ResearchModuleContent);

const THEME_GROUPS = [
	{
		groupName: 'Group1',
		themes: [
			{ themeId: 'id1', displayName: 'name1' },
			{ themeId: 'id2', displayName: 'name2' }
		]
	},
	{
		groupName: 'Group2',
		themes: [
			{ themeId: 'id3', displayName: 'name3' },
			{ themeId: 'id4', displayName: 'name4' }
		]
	}
];

const THEME_METADATA = {
	themeid: 'id1',
	featureresource: 'feature1',
	propertydefinitions: [
		{
			originalkey: 'key1',
			displayname: 'name1',
			type: Types.INTEGER,
			queryable: true,
			displayable: true,
			exportable: true,
			min: 1,
			max: 100
		},
		{
			originalkey: 'key2',
			displayname: 'name2',
			type: Types.INTEGER,
			queryable: false,
			displayable: true,
			exportable: true,
			min: 5,
			max: 10
		},
		{
			originalkey: 'key3',
			displayname: 'name3',
			type: Types.CHARACTER,
			queryable: true,
			displayable: true,
			exportable: true,
			values: ['a', 'b', 'c']
		},
		{
			originalkey: 'key4',
			displayname: 'name4',
			type: Types.GEOMETRY,
			queryable: true,
			displayable: true,
			exportable: true
		}
	]
};

describe('ResearchModuleContent', () => {
	const testState = {};

	const researchServiceMock = {
		loadThemeGroups: () => THEME_GROUPS,
		queryMetadata: () => THEME_METADATA,
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

	describe('theme metadata', () => {
		it('shows the correct filters for theme', async () => {
			const element = await setup();

			await TestUtils.timeout();

			const step2 = element.shadowRoot.querySelector('#step2');
			const children = Array.from(step2.children);
			expect(children).toHaveSize(3);

			const numericFilter = step2.querySelector('.numeric-filter');
			expect(numericFilter).not.toBeNull();
			expect(numericFilter.querySelector('#min').value).toEqual(5);
			expect(numericFilter.querySelector('#max').value).toEqual(5);
			// expect(numericFilter.querySelector('label[for="min"]').textContent).toEqual('Min: 1');
			// expect(numericFilter.querySelector('#name1-max')).toEqual(100);
		});
	});
});
