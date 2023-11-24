import { $injector } from '../../../src/injection';
import { ResearchService } from '../../../src/ea/services/ResearchService';
import { researchProviders } from '../../../src/ea/services/provider/research.provider';

describe('ResearchService', () => {
	const configService = {
		getValue: () => {}
	};

	beforeAll(() => {
		$injector.registerSingleton('ConfigService', configService);
	});

	const loadMockTopics = async () => {
		return [];
	};

	const setup = (provider = loadMockTopics) => {
		return new ResearchService(provider);
	};

	describe('init', () => {
		it('initializes the service', async () => {
			const instanceUnderTest = setup();
			expect(instanceUnderTest._topics).toBeNull();

			const topics = await instanceUnderTest.init();

			expect(topics.length).toBe(2);
		});

		it('initializes the service with default providers', async () => {
			const instanceUnderTest = new ResearchService();
			expect(instanceUnderTest._providers).toEqual(researchProviders);
		});

		it('just provides the topics when already initialized', async () => {
			const instanceUnderTest = setup();

			const topic = await instanceUnderTest.init();

			expect(topic.length).toBe(1);
		});

		describe('provider cannot fulfill', () => {
			it('loads two fallback topics when we are in standalone mode', async () => {
				const instanceUnderTest = setup(async () => {
					throw new Error('Topics could not be loaded');
				});
				const warnSpy = spyOn(console, 'warn');

				const topics = await instanceUnderTest.init();

				expect(topics.length).toBe(2);
				expect(topics[0].baseGeoRs.raster[0]).toBe('tpo');
				expect(topics[0].baseGeoRs.raster[1]).toBe('tpo_mono');
				expect(topics[0].baseGeoRs.vector[0]).toBe('bmde_vector');
				expect(topics[0].baseGeoRs.vector[1]).toBe('bmde_vector_relief');
				expect(topics[1].baseGeoRs.raster[0]).toBe('tpo');
				expect(topics[1].baseGeoRs.raster[1]).toBe('tpo_mono');
				expect(warnSpy).toHaveBeenCalledWith('Topics could not be fetched from backend. Using fallback topics ...');
			});

			it('throws an error when we are NOT in standalone mode', async () => {
				const error = new Error('Topics could not be loaded');
				const instanceUnderTest = setup(async () => {
					throw error;
				});

				await expectAsync(instanceUnderTest.init()).toBeRejectedWith(jasmine.objectContaining({ message: 'No topics available', cause: error }));
			});
		});
	});

	describe('all', () => {
		it('provides all topics', () => {
			const instanceUnderTest = setup();

			const Topics = instanceUnderTest.all();

			expect(Topics.length).toBe(1);
		});

		it('logs a warn statement when service hat not been initialized', () => {
			const instanceUnderTest = setup();
			const warnSpy = spyOn(console, 'warn');

			expect(instanceUnderTest.all()).toEqual([]);
			expect(warnSpy).toHaveBeenCalledWith('TopicsService not yet initialized');
		});
	});
});
