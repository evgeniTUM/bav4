import { HttpService, NetworkStateSyncHttpService } from '../../src/services/HttpService';
import { networkReducer } from '../../src/store/network/network.reducer';
import { TestUtils } from '../test-utils';

describe('HttpService', () => {
	beforeEach(function () {
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});

	describe('static properties', () => {
		it('provides a DefaultRequestMode', () => {
			expect(HttpService.DEFAULT_REQUEST_MODE).toBe('cors');
		});
	});

	describe('fetch', () => {
		it('provides a result', async () => {
			const httpService = new HttpService();
			const spy = spyOn(window, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.fetch('something');

			expect(spy).toHaveBeenCalled();
			expect(result.text()).toBe(42);
		});

		it('provides a result by calling a response interceptor', async () => {
			const httpService = new HttpService();
			const spy = spyOn(window, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);
			const interceptorSpy = jasmine.createSpy().and.callFake(async (response) => response);

			const result = await httpService.fetch('something', undefined, undefined, { response: interceptorSpy });

			expect(spy).toHaveBeenCalled();
			expect(interceptorSpy).toHaveBeenCalledWith(jasmine.objectContaining({ text: jasmine.any(Function) }), jasmine.any(Function), 'something');
			expect(result.text()).toBe(42);
		});

		it('provides a result with customized timeout ', async () => {
			const httpService = new HttpService();

			const fetchSpy = spyOn(window, 'fetch').and.callFake(() => {
				// we wait 2000ms in order to exceed the default timeout limit
				jasmine.clock().tick(2000);
				// and return mocked result
				return Promise.resolve({
					text: () => {
						return 42;
					}
				});
			});

			const result = await httpService.fetch('something', { timeout: 3000 });

			expect(fetchSpy).toHaveBeenCalled();
			expect(result.text()).toBe(42);
		});

		it('aborts the request when default timeout limit is exceeded', async () => {
			const httpService = new HttpService();

			const controller = new AbortController();
			const controllerSpy = spyOn(controller, 'abort');
			const fetchSpy = spyOn(window, 'fetch').and.callFake(() => {
				// we wait 2000ms in order to exceed the default timeout limit
				jasmine.clock().tick(3500);
			});

			await httpService.fetch('something', {}, controller);

			expect(fetchSpy).toHaveBeenCalled();
			expect(controllerSpy).toHaveBeenCalled();
		});
	});

	describe('get', () => {
		it('provides a result with default options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.get('something');

			expect(spy).toHaveBeenCalledWith('something', { mode: HttpService.DEFAULT_REQUEST_MODE }, undefined, {});
			expect(result.text()).toBe(42);
		});

		it('provides a result by calling a response interceptor', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);
			const interceptors = { response: jasmine.createSpy().and.callFake(async (response) => response) };

			const result = await httpService.get('something', {}, interceptors);

			expect(spy).toHaveBeenCalledWith('something', { mode: HttpService.DEFAULT_REQUEST_MODE }, undefined, interceptors);
			expect(result.text()).toBe(42);
		});

		it('provides a result with custom options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.get('something', { timeout: 2000 });

			expect(spy).toHaveBeenCalledWith('something', { mode: HttpService.DEFAULT_REQUEST_MODE, timeout: 2000 }, undefined, {});
			expect(result.text()).toBe(42);
		});
	});

	describe('delete', () => {
		it('provides a result with default options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.delete('something');

			expect(spy).toHaveBeenCalledWith('something', { mode: HttpService.DEFAULT_REQUEST_MODE, method: 'DELETE' });
			expect(result.text()).toBe(42);
		});

		it('provides a result with custom options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.delete('something', { timeout: 2000 });

			expect(spy).toHaveBeenCalledWith('something', { mode: HttpService.DEFAULT_REQUEST_MODE, method: 'DELETE', timeout: 2000 });
			expect(result.text()).toBe(42);
		});
	});

	describe('post', () => {
		it('post data and provides a result with default options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.post('something', 'someData', 'someContentType');

			expect(spy).toHaveBeenCalledWith('something', {
				method: 'POST',
				body: 'someData',
				mode: HttpService.DEFAULT_REQUEST_MODE,
				headers: {
					'Content-Type': 'someContentType'
				}
			});
			expect(result.text()).toBe(42);
		});

		it('post data and provides a result with custom options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);

			const result = await httpService.post('something', 'someData', 'someContentType', { timeout: 2000 });

			expect(spy).toHaveBeenCalledWith('something', {
				method: 'POST',
				body: 'someData',
				mode: HttpService.DEFAULT_REQUEST_MODE,
				timeout: 2000,
				headers: {
					'Content-Type': 'someContentType'
				}
			});
			expect(result.text()).toBe(42);
		});
	});

	describe('head', () => {
		it('provides a result with default options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					ok: true
				})
			);

			const result = await httpService.head('something');

			expect(spy).toHaveBeenCalledWith(
				'something',
				{
					method: 'HEAD',
					mode: HttpService.DEFAULT_REQUEST_MODE
				},
				undefined,
				{}
			);
			expect(result.ok).toBeTrue();
		});

		it('provides a result by calling a response interceptor', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					text: () => {
						return 42;
					}
				})
			);
			const interceptors = { response: jasmine.createSpy().and.callFake(async (response) => response) };

			const result = await httpService.head('something', {}, interceptors);

			expect(spy).toHaveBeenCalledWith('something', { method: 'HEAD', mode: HttpService.DEFAULT_REQUEST_MODE }, undefined, interceptors);
			expect(result.text()).toBe(42);
		});

		it('provides a result with custom options', async () => {
			const httpService = new HttpService();
			const spy = spyOn(httpService, 'fetch').and.returnValue(
				Promise.resolve({
					ok: true
				})
			);

			const result = await httpService.head('something', { timeout: 2000 });

			expect(spy).toHaveBeenCalledWith(
				'something',
				{
					method: 'HEAD',
					mode: HttpService.DEFAULT_REQUEST_MODE,
					timeout: 2000
				},
				undefined,
				{}
			);
			expect(result.ok).toBeTrue();
		});
	});
});

describe('NetworkStateSyncHttpService', () => {
	beforeEach(function () {
		jasmine.clock().install();
	});

	afterEach(function () {
		jasmine.clock().uninstall();
	});

	const setup = () => {
		return TestUtils.setupStoreAndDi(
			{},
			{
				network: networkReducer
			}
		);
	};

	describe('fetch', () => {
		it("calls parent's fetch and updates the store", async () => {
			const store = setup();
			const instanceUnderTest = new NetworkStateSyncHttpService();
			spyOn(window, 'fetch').and.callFake(() => {
				expect(store.getState().network.fetching).toBeTrue();
				return Promise.resolve({
					text: () => {
						return 42;
					}
				});
			});
			const parentFetchSpy = spyOn(HttpService.prototype, 'fetch').and.callThrough();

			const result = await instanceUnderTest.fetch('something');

			expect(store.getState().network.fetching).toBeFalse();
			expect(result.text()).toBe(42);
			expect(parentFetchSpy).toHaveBeenCalledWith('something', {}, jasmine.any(AbortController), {});
		});

		it('regards pending responses', async () => {
			const store = setup();
			const instanceUnderTest = new NetworkStateSyncHttpService();
			spyOn(window, 'fetch').and.callFake(async () => {});

			instanceUnderTest.fetch('first');
			instanceUnderTest.fetch('second');

			expect(store.getState().network.fetching).toBeTrue();

			await instanceUnderTest.fetch('third');

			expect(store.getState().network.fetching).toBeFalse();
		});

		it('regards pending responses when not resolved', async () => {
			const store = setup();
			const instanceUnderTest = new NetworkStateSyncHttpService();
			spyOn(window, 'fetch').and.callFake(async () => {
				throw new Error('oops');
			});

			try {
				await instanceUnderTest.fetch('first');
				throw new Error('Promise should not be resolved');
			} catch {
				expect(store.getState().network.fetching).toBeFalse();
			}
		});

		it('updates the store when fetch call fails', async () => {
			const store = setup();
			const instanceUnderTest = new NetworkStateSyncHttpService();
			spyOn(window, 'fetch').and.callFake(() => {
				expect(store.getState().network.fetching).toBeTrue();
				return Promise.reject('something got wrong');
			});

			try {
				await instanceUnderTest.fetch('something');
				throw new Error('Promise should not be resolved');
			} catch {
				expect(store.getState().network.fetching).toBeFalse();
			}
		});
	});
});
