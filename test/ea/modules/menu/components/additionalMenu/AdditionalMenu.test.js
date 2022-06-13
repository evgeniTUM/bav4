/* eslint-disable no-undef */

import { AdditionalMenu } from '../../../../../../src/ea/modules/menu/components/additionalMenu/AdditionalMenu';
import { Analyse3DModuleContent } from '../../../../../../src/ea/modules/toolbox/components/analyse3d/Analyse3DModuleContent';
import { EAContribution } from '../../../../../../src/ea/modules/toolbox/components/contribution/EAContribution';
import { MixerModuleContent } from '../../../../../../src/ea/modules/toolbox/components/mixerModuleContent/MixerModuleContent';
import { RedesignModuleContent } from '../../../../../../src/ea/modules/toolbox/components/redesignModuleContent/RedesignModuleContent';
import { ResearchModuleContent } from '../../../../../../src/ea/modules/toolbox/components/researchModuleContent/ResearchModuleContent';
import { contributionReducer, SET_STATE } from '../../../../../../src/ea/store/contribution/contribution.reducer';
import { moduleReducer, SET_CURRENT_MODULE } from '../../../../../../src/ea/store/module/module.reducer';
import { $injector } from '../../../../../../src/injection';
import { MvuElement } from '../../../../../../src/modules/MvuElement';
import { createNoInitialStateMediaReducer } from '../../../../../../src/store/media/media.reducer';
import { networkReducer } from '../../../../../../src/store/network/network.reducer';
import { TestUtils } from '../../../../../test-utils';

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
			module: moduleReducer,
			contribution: contributionReducer
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

		it('toggles contribution module', async () => {
			const element = await setup();

			element.shadowRoot.getElementById('contribution').click();

			let setStateActions = storeActions.filter(e => e.type === SET_STATE);
			expect(setStateActions.length).toBe(1);

			let setModuleActions = storeActions.filter(e => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(EAContribution.tag);

			storeActions.length = 0;
			element.shadowRoot.getElementById('contribution').click();

			setStateActions = storeActions.filter(e => e.type === SET_STATE);
			expect(setStateActions.length).toBe(1);

			setModuleActions = storeActions.filter(e => e.type === SET_CURRENT_MODULE);
			expect(setModuleActions.length).toBe(1);
			expect(setModuleActions[0].payload).toBe(null);
		});

		it('toggles modules', async () => {
			const element = await setup();

			const modules = [
				{ id: 'mixer', tag: MixerModuleContent.tag },
				{ id: 'redesign', tag: RedesignModuleContent.tag },
				{ id: 'research', tag: ResearchModuleContent.tag },
				{ id: 'analyse3d', tag: Analyse3DModuleContent.tag }
			];

			modules.forEach((module) => {
				storeActions.length = 0;
				element.shadowRoot.getElementById(module.id).click();

				let setModuleActions = storeActions.filter(e => e.type === SET_CURRENT_MODULE);
				expect(setModuleActions.length).toBe(1);
				expect(setModuleActions[0].payload).toBe(module.tag);

				storeActions.length = 0;
				element.shadowRoot.getElementById(module.id).click();

				setModuleActions = storeActions.filter(e => e.type === SET_CURRENT_MODULE);
				expect(setModuleActions.length).toBe(1);
				expect(setModuleActions[0].payload).toBe(null);
			});
		});

	});
});
