/* eslint-disable no-undef */

import { AdditionalMenu } from '../../../../../../../../src/ea/modules/menu/components/mainMenu/content/additionalMenu/AdditionalMenu';
import { Analyse3DModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EnergyMarketModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/contribution/EnergyMarketModuleContent';
import { EnergyReportingModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/contribution/EnergyReportingModuleContent';
import { GeothermModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/geotherm/GeothermModuleContent';
import { MixerModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/mixer/MixerModuleContent';
import { ResearchModuleContent } from '../../../../../../../../src/ea/modules/toolbox/components/research/ResearchModuleContent';
import { eaReducer, SET_CURRENT_MODULE } from '../../../../../../../../src/ea/store/module/ea.reducer';
import { $injector } from '../../../../../../../../src/injection';
import { MvuElement } from '../../../../../../../../src/modules/MvuElement';
import { createNoInitialStateMediaReducer } from '../../../../../../../../src/store/media/media.reducer';
import { networkReducer } from '../../../../../../../../src/store/network/network.reducer';
import { TestUtils } from '../../../../../../../test-utils';

window.customElements.define(AdditionalMenu.tag, AdditionalMenu);

describe('AdditionalMenu', () => {
	const storeActions = [];

	const setup = (state = {}, config = {}) => {
		const { embed = false } = config;
		storeActions.length = 0;

		const initialState = {
			media: {
				portrait: false,
				minWidth: true,
				observeResponsiveParameter: true
			},
			...state
		};
		TestUtils.setupStoreAndDi(initialState, {
			spyReducer: (state, action) => storeActions.push(action),
			media: createNoInitialStateMediaReducer(),
			network: networkReducer,
			ea: eaReducer
		});
		$injector
			.registerSingleton('EnvironmentService', {
				isEmbedded: () => embed
			})
			.registerSingleton('TranslationService', { translate: (key) => key });

		return TestUtils.render(AdditionalMenu.tag);
	};

	describe('when instantiated', () => {
		it('inherits MvuElement', async () => {
			const element = await setup();

			expect(element instanceof MvuElement).toBeTrue();
		});
	});

	describe('when initialized', () => {
		it('skips rendering when in embedded mode', async () => {
			const element = await setup({}, { embed: true });

			expect(element.isRenderingSkipped()).toBeTrue();
		});

		it('renders when not in embedded mode', async () => {
			const element = await setup({}, { embed: false });

			expect(element.isRenderingSkipped()).toBeFalse();
		});

		it('toggles contribution module for energy-market', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('energy-market').click();

			let setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(EnergyMarketModuleContent.name);

			storeActions.length = 0;
			element.shadowRoot.getElementById('energy-market').click();

			setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(null);
		});

		it('toggles contribution module for energy-reporting', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('energy-reporting').click();

			let setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(EnergyReportingModuleContent.name);

			storeActions.length = 0;
			element.shadowRoot.getElementById('energy-reporting').click();

			setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(null);
		});

		it('toggles modules', async () => {
			const element = await setup();

			const modules = [
				{ id: 'mixer', name: MixerModuleContent.name },
				{ id: 'research', name: ResearchModuleContent.name },
				{ id: 'analyse3d', name: Analyse3DModuleContent.name },
				{ id: 'geotherm', name: GeothermModuleContent.name },
				{ id: 'energy-market', name: EnergyMarketModuleContent.name },
				{ id: 'energy-reporting', name: EnergyReportingModuleContent.name }
			];

			modules.forEach((module) => {
				storeActions.length = 0;
				element.shadowRoot.getElementById(module.id).click();

				let setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
				expect(setModuleActions.length).toBe(1);
				expect(setModuleActions[0].payload).toBe(module.name);

				storeActions.length = 0;
				element.shadowRoot.getElementById(module.id).click();

				setModuleActions = storeActions.filter((e) => e.type === SET_CURRENT_MODULE);
				expect(setModuleActions.length).toBe(1);
				expect(setModuleActions[0].payload).toBe(null);
			});
		});

		it('respects a specific order of menu items', async () => {
			const element = await setup();

			const itemIds = Array.from(element.shadowRoot.querySelectorAll('li')).map((i) => i.id);
			expect(itemIds).toEqual(['research', 'mixer', 'analyse3d', 'geotherm', 'energy-market', 'energy-reporting']);
		});
	});
});
