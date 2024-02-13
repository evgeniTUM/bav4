import { $injector } from '../../src/injection';
import { AuthService } from '../../src/services/AuthService';
import { bvvSignInProvider } from '../../src/services/provider/auth.provider';

describe('AuthService', () => {
	const geoResourceService = {
		byId() {}
	};

	beforeAll(() => {
		$injector.registerSingleton('GeoResourceService', geoResourceService);
	});

	afterAll(() => {
		$injector.reset();
	});

	const setup = (signInProvider = bvvSignInProvider) => {
		return new AuthService(signInProvider);
	};

	describe('constructor', () => {
		it('initializes the service with default providers', async () => {
			const instanceUnderTest = new AuthService();
			expect(instanceUnderTest._singInProvider).toEqual(bvvSignInProvider);
		});

		it('initializes the service with custom provider', async () => {
			const customSignInProvider = async () => {};
			const instanceUnderTest = setup(customSignInProvider);
			expect(instanceUnderTest._singInProvider).toEqual(customSignInProvider);
		});
	});

	describe('getRoles', () => {
		describe('and user is not signed in', () => {
			it('returns an empty array', () => {
				const instanceUnderTest = setup();

				expect(instanceUnderTest.getRoles()).toHaveSize(0);
			});
		});
	});

	describe('isSignedIn', () => {
		describe('and user is not signed in', () => {
			it('returns an empty array', () => {
				const instanceUnderTest = setup();

				expect(instanceUnderTest.isSignedIn()).toBeFalse();
			});
		});
	});

	describe('signIn', () => {
		describe('is successful', () => {
			it('returns `true` and updates the internal state', async () => {
				const roles = ['TEST'];
				const credential = { username: 'u', password: 'p' };
				const signInProvider = jasmine.createSpy().withArgs(credential).and.resolveTo(roles);
				const instanceUnderTest = setup(signInProvider);

				await expectAsync(instanceUnderTest.signIn(credential)).toBeResolvedTo(true);
				expect(instanceUnderTest.getRoles()).toEqual(roles);
				expect(instanceUnderTest.isSignedIn()).toBeTrue();
			});
		});
		describe('is NOT successful', () => {
			it('returns `false`', async () => {
				const credential = { username: 'u', password: 'p' };
				const signInProvider = jasmine.createSpy().withArgs(credential).and.resolveTo([]);
				const instanceUnderTest = setup(signInProvider);

				await expectAsync(instanceUnderTest.signIn(credential)).toBeResolvedTo(false);
				expect(instanceUnderTest.getRoles()).toEqual([]);
				expect(instanceUnderTest.isSignedIn()).toBeFalse();
			});
		});
	});
	describe('isAuthorizedFor', () => {
		describe('and user is NOT signed in', () => {
			it('returns `false`', async () => {
				const geoResourceId = 'id';
				const geoResource = { authRoles: [] };
				spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResource);
				const instanceUnderTest = setup();

				expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeFalse();
			});
			describe('and GeoResource is unknown', () => {
				it('returns `false`', async () => {
					const geoResourceId = 'id';
					spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(null);
					const instanceUnderTest = setup();

					expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeFalse();
				});
			});
		});
		describe('and user is signed in', () => {
			describe('and user has the wrong role', () => {
				it('returns `false`', async () => {
					const geoResourceId = 'id';
					const geoResource = { restricted: true, authRoles: ['FOO', 'BAR'] };
					spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResource);
					const instanceUnderTest = setup();
					instanceUnderTest._roles = ['TEST'];

					expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeFalse();
				});
			});
			describe('and user has a suitable role', () => {
				it('returns `true`', async () => {
					const geoResourceId = 'id';
					const geoResource = { restricted: true, authRoles: ['FOO', 'BAR'] };
					spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResource);
					const instanceUnderTest = setup();
					instanceUnderTest._roles = ['BAR'];

					expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeTrue();
				});
			});
			describe('and GeoResource is NOT restricted', () => {
				it('returns `true`', async () => {
					const geoResourceId = 'id';
					const geoResource = { restricted: false, authRoles: [] };
					spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(geoResource);
					const instanceUnderTest = setup();
					instanceUnderTest._roles = ['BAR'];

					expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeTrue();
				});
			});
			describe('and GeoResource is unknown', () => {
				it('returns `false`', async () => {
					const geoResourceId = 'id';
					spyOn(geoResourceService, 'byId').withArgs(geoResourceId).and.returnValue(null);
					const instanceUnderTest = setup();
					instanceUnderTest._roles = ['TEST'];

					expect(instanceUnderTest.isAuthorizedFor(geoResourceId)).toBeFalse();
				});
			});
		});
	});
});
