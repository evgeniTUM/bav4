/* eslint-disable no-undef */

import { AdditionalMenu } from '../../../../../../src/ea/modules/menu/components/mainMenu/content/additionalMenu/AdditionalMenu';
import { EaMiscContentPanel } from '../../../../../../src/ea/modules/menu/components/mainMenu/content/misc/EaMiscContentPanel';
import { EaMainMenu } from '../../../../../../src/ea/modules/menu/components/mainMenu/EaMainMenu';
import { EaTopicsContentPanel } from '../../../../../../src/ea/modules/topics/components/menu/EaTopicsContentPanel';
import { $injector } from '../../../../../../src/injection';
import { FeatureInfoPanel } from '../../../../../../src/modules/featureInfo/components/featureInfoPanel/FeatureInfoPanel';
import { MapsContentPanel } from '../../../../../../src/modules/menu/components/mainMenu/content/maps/MapsContentPanel';
import { MainMenu } from '../../../../../../src/modules/menu/components/mainMenu/MainMenu';
import { SearchResultsPanel } from '../../../../../../src/modules/search/components/menu/SearchResultsPanel';
import { TabIds } from '../../../../../../src/domain/mainMenu';
import { setTab } from '../../../../../../src/store/mainMenu/mainMenu.action';
import { createNoInitialStateMainMenuReducer } from '../../../../../../src/store/mainMenu/mainMenu.reducer';
import { createNoInitialStateMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { TEST_ID_ATTRIBUTE_NAME } from '../../../../../../src/utils/markup';
import { TestUtils } from '../../../../../test-utils';

window.customElements.define(EaMainMenu.tag, EaMainMenu);

describe('EaMainMenu', () => {
	const setup = (state = {}, config = {}) => {
		const { embed = false } = config;

		const initialState = {
			mainMenu: {
				open: true,
				tab: null
			},
			media: {
				portrait: false,
				minWidth: true,
				observeResponsiveParameter: true
			},
			...state
		};
		TestUtils.setupStoreAndDi(initialState, {
			mainMenu: createNoInitialStateMainMenuReducer(),
			media: createNoInitialStateMediaReducer()
		});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed
			})
			.registerSingleton('TranslationService', { translate: (key) => key });

		return TestUtils.render(EaMainMenu.tag);
	};

	describe('when instantiated', () => {
		it('inherits MainMenu', async () => {
			const element = await setup();

			expect(element instanceof MainMenu).toBeTrue();
		});
	});

	describe('when initialized', () => {
		it('renders the content panels', async () => {
			const element = await setup();

			const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');
			expect(contentPanels.length).toBe(Object.keys(TabIds).length);
			for (let i = 0; i < contentPanels.length; i++) {
				switch (i) {
					case TabIds.SEARCH:
						expect(contentPanels[i].innerHTML.toString().includes(SearchResultsPanel.tag)).toBeTrue();
						break;
					case TabIds.TOPICS:
						expect(contentPanels[i].innerHTML.toString().includes(EaTopicsContentPanel.tag)).toBeTrue();
						break;
					case TabIds.FEATUREINFO:
						expect(contentPanels[i].innerHTML.toString().includes(FeatureInfoPanel.tag)).toBeTrue();
						break;
					case TabIds.MAPS:
						expect(contentPanels[i].innerHTML.toString().includes(MapsContentPanel.tag)).toBeTrue();
						break;
					case TabIds.MISC:
						expect(contentPanels[i].innerHTML.toString().includes(EaMiscContentPanel.tag)).toBeFalse();
						break;
					case TabIds.EXTENSION:
						expect(contentPanels[i].innerHTML.toString().includes(AdditionalMenu.tag)).toBeTrue();
				}
			}
		});

		it('contains test-id attributes', async () => {
			const element = await setup();

			expect(element.shadowRoot.querySelectorAll(`[${TEST_ID_ATTRIBUTE_NAME}]`)).toHaveSize(6);
			expect(element.shadowRoot.querySelector(SearchResultsPanel.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
			expect(element.shadowRoot.querySelector(FeatureInfoPanel.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
			expect(element.shadowRoot.querySelector(MapsContentPanel.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
			expect(element.shadowRoot.querySelector(EaMiscContentPanel.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();

			expect(element.shadowRoot.querySelector(EaTopicsContentPanel.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
			expect(element.shadowRoot.querySelector(AdditionalMenu.tag).hasAttribute(TEST_ID_ATTRIBUTE_NAME)).toBeTrue();
		});

		describe('when tab-index changes', () => {
			const check = (index, panels) => {
				for (let i = 0; i < panels.length; i++) {
					expect(panels[i].classList.contains('is-active')).toBe(Object.values(TabIds)[i] === index);
				}
			};

			it('displays the extension content panel', async () => {
				const element = await setup();
				const contentPanels = element.shadowRoot.querySelectorAll('.tabcontent');

				setTab(TabIds.EXTENSION);
				check(TabIds.EXTENSION, contentPanels);
			});
		});
	});
});
