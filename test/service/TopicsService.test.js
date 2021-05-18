import { TopicsService } from '../../src/services/TopicsService';
import { Topic } from '../../src/services/domain/topic';
import { loadBvvTopics } from '../../src/services/provider/topics.provider';
import { $injector } from '../../src/injection';

describe('Topicservice', () => {
	
	const configService = {
		getValue: () => { }
	};

	beforeAll(() => {
		$injector
			.registerSingleton('ConfigService', configService);
	});

	const topic0 = new Topic('topic0', 'Topic 0', 'This is Topic 0...', ['bg0']);
	const topic1 = new Topic('topic1', 'Topic 1', 'This is Topic 1...', ['bg1']);

	const loadMockTopics = async () => {

		return [
			topic0,
			topic1
		];
	};

	const setup = (provider = loadMockTopics) => {
		return new TopicsService(provider);
	};

	describe('init', () => {

		it('initializes the service', async () => {
			const instanceUnderTest = setup();
			expect(instanceUnderTest._topics).toBeNull();

			const topics = await instanceUnderTest.init();

			expect(topics.length).toBe(2);
		});

		it('initializes the service with default provider', async () => {
			const instanceUnderTest = new TopicsService();
			expect(instanceUnderTest._provider).toEqual(loadBvvTopics);
		});


		it('just provides the topics when already initialized', async () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0];

			const topic = await instanceUnderTest.init();

			expect(topic.length).toBe(1);
		});

		it('loads fallback topics when provider cannot fulfill', async () => {

			const instanceUnderTest = setup(async () => {
				throw new Error('Topics could not be loaded');
			});
			const warnSpy = spyOn(console, 'warn');

			expect(instanceUnderTest._topics).toBeNull();

			const topics = await instanceUnderTest.init();

			expect(topics.length).toBe(2);
			expect(topics[0].id).toBe('fallback0');
			expect(topics[0].baseGeoRs.length).toBe(2);
			expect(topics[0].baseGeoRs[0]).toBe('atkis');
			expect(topics[0].baseGeoRs[1]).toBe('atkis_sw');
			expect(topics[1].id).toBe('fallback1');
			expect(topics[1].baseGeoRs.length).toBe(2);
			expect(topics[1].baseGeoRs[0]).toBe('atkis');
			expect(topics[1].baseGeoRs[1]).toBe('atkis_sw');
			expect(warnSpy).toHaveBeenCalledWith('Topics could not be fetched from backend. Using fallback topics ...');
		});
	});

	describe('all', () => {

		it('provides all topics', () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0];

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

	describe('byId', () => {

		it('provides a topic by id', () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0];

			const topic = instanceUnderTest.byId('topic0');

			expect(topic).toBeTruthy();
			expect(topic.id).toBe('topic0');
		});

		it('provides null if for an unknown id', () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0];

			const topic = instanceUnderTest.byId('something');

			expect(topic).toBeNull();
		});

		it('logs a warn statement when when service hat not been initialized', () => {
			const instanceUnderTest = setup();
			const warnSpy = spyOn(console, 'warn');

			expect(instanceUnderTest.byId('unknownId')).toBeNull();
			expect(warnSpy).toHaveBeenCalledWith('TopicsService not yet initialized');
		});
	});

	describe('default', () => {

		it('provides the configured default topic', () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0, topic1];
			spyOn(configService, 'getValue').and.returnValue(topic1.id);

			const topic = instanceUnderTest.default();

			expect(topic).toBeTruthy();
			expect(topic.id).toBe('topic1');
		});

		it('provides the first available topic', () => {
			const instanceUnderTest = setup();
			instanceUnderTest._topics = [topic0, topic1];
			spyOn(configService, 'getValue').and.returnValue('unkwown');

			const topic = instanceUnderTest.default();

			expect(topic).toBeTruthy();
			expect(topic.id).toBe('topic0');
		});

		it('logs a warn statement when when service hat not been initialized', () => {
			const instanceUnderTest = setup();
			const warnSpy = spyOn(console, 'warn');

			expect(instanceUnderTest.default()).toBeNull();
			expect(warnSpy).toHaveBeenCalledWith('TopicsService not yet initialized');
		});
	});
});
