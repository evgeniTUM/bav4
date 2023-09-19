import { AdministrationService } from '../../src/services/AdministrationService';
import { isOutOfBavaria, loadBvvAdministration } from '../../src/services/provider/administration.provider';

describe('AdministrationService', () => {
	const setup = (provider1 = loadBvvAdministration, provider2 = isOutOfBavaria) => {
		return new AdministrationService(provider1, provider2);
	};

	describe('init', () => {
		it('initializes the service with custom provider', async () => {
			const customProvider = async () => 1;
			const customProvider2 = async () => 2;
			const instanceUnderTest = setup(customProvider, customProvider2);
			expect(instanceUnderTest._administrationProvider).toBeDefined();
			expect(instanceUnderTest._administrationProvider).toEqual(customProvider);
			expect(instanceUnderTest._isOutOfBavariaProvider).toBeDefined();
			expect(instanceUnderTest._isOutOfBavariaProvider).toEqual(customProvider2);
		});

		it('initializes the service with default provider', async () => {
			const instanceUnderTest = new AdministrationService();
			expect(instanceUnderTest._administrationProvider).toEqual(loadBvvAdministration);
			expect(instanceUnderTest._isOutOfBavariaProvider).toEqual(isOutOfBavaria);
		});

		it('provides the administration values', async () => {
			const administrationMock = { gemeinde: 'LDBV', gemarkung: 'Ref42' };
			const instanceUnderTest = setup(async () => {
				return administrationMock;
			});
			const mockCoordinate = [0, 0];

			const result = await instanceUnderTest.getAdministration(mockCoordinate);

			expect(result.gemeinde).toEqual(administrationMock.gemeinde);
			expect(result.gemarkung).toEqual(administrationMock.gemarkung);
		});

		it('provides the administration values', async () => {
			[true, false].forEach((v) => async () => {
				const instanceUnderTest = setup(
					async () => {},
					async () => v
				);
				const mockCoordinate = [0, 0];

				const result = await instanceUnderTest.isOutsideOfBavaria(mockCoordinate);

				expect(result).toEqual(v);
			});
		});
	});

	describe('Error handling', () => {
		it('rejects when backend is not available', async () => {
			const administrationProviderError = new Error('Administration Provider error');
			const instanceUnderTest = setup(async () => {
				throw administrationProviderError;
			});

			const mockCoordinate = [0, 0];

			await expectAsync(instanceUnderTest.getAdministration(mockCoordinate)).toBeRejectedWith(
				jasmine.objectContaining({
					message: 'Could not load administration from provider',
					cause: administrationProviderError
				})
			);
		});

		it('rejects when no coordinates are delivered', async () => {
			const instanceUnderTest = setup();

			await expectAsync(instanceUnderTest.getAdministration()).toBeRejectedWithError(TypeError, "Parameter 'coordinate3857' must be a coordinate");
		});

		it('rejects when false coordinates are delivered', async () => {
			const instanceUnderTest = setup();

			await expectAsync(instanceUnderTest.getAdministration('invalid input')).toBeRejectedWithError(
				TypeError,
				"Parameter 'coordinate3857' must be a coordinate"
			);
		});
	});
});
