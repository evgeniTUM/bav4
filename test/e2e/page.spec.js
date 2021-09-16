const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.URL || 'http://localhost:8080';

test.describe('page', () => {

	test.beforeEach(async ({ page }) => {
		// Go to the starting url before each test.
		await page.goto(`${BASE_URL}`);

	});

	test.describe('when loaded', () => {

		test('should contain a lang attribute', async ({ page }) => {
			expect(await page.$('html[lang=\'en\']')).toBeTruthy();
		});

		test('should contain a title tag', async ({ page }) => {
			const title = await page.title();
			expect(title).toBe('BAv4 (#nomigration)');
		});

		test('should contain a viewport meta tag', async ({ page }) => {
			const content = await page.getAttribute('head > meta[name=\'viewport\']', 'content');

			expect(content).toContain('width=device-width');
			expect(content).toContain('initial-scale=1');
			expect(content).toContain('maximum-scale=1');
			expect(content).toContain('user-scalable=0');
		});

		test('should contain a charset meta tag', async ({ page }) => {
			expect(await page.$('head > meta[charset=\'utf-8\']')).toBeTruthy();
		});

		test('should contain a <ba-header> component', async ({ page }) => {
			expect(await page.$$('ba-header')).toHaveLength(1);
		});

		test('should contain a <ba-main-menu> component', async ({ page }) => {
			expect(await page.$$('ba-main-menu')).toHaveLength(1);
		});
		test('should contain a <ba-ol-map> component', async ({ page }) => {
			expect(await page.$$('ba-ol-map')).toHaveLength(1);
		});

		test('should contain a <ba-map-button-container> component', async ({ page }) => {
			expect(await page.$$('ba-map-button-container')).toHaveLength(1);
		});

		test('should contain a <ba-tool-bar> component', async ({ page }) => {
			expect(await page.$$('ba-tool-bar')).toHaveLength(1);
		});

		test('should contain a <ba-footer> component', async ({ page }) => {
			expect(await page.$$('ba-footer')).toHaveLength(1);
		});

		test('should contain a <ba-tool-container> component', async ({ page }) => {
			expect(await page.$$('ba-tool-container')).toHaveLength(1);
		});

		test('should contain a <ba-context-menue> component', async ({ page }) => {
			expect(await page.$$('ba-context-menue')).toHaveLength(1);
		});
		test('should contain a <ba-nonembedded-hint> component', async ({ page }) => {
			expect(await page.$$('ba-nonembedded-hint')).toHaveLength(1);
		});

		test('should contain a <ba-theme-provider> component', async ({ page }) => {
			expect(await page.$$('ba-theme-provider')).toHaveLength(1);
		});

		test('should contain a <ba-modal> component', async ({ page }) => {
			expect(await page.$$('ba-modal')).toHaveLength(1);
		});
	});
});
