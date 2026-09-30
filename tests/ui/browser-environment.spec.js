import { test, expect } from '../../fixtures/index.js';
import { reportTestResult } from '../../utils/hooks.js';

// These tests do not depend on the shop itself — they check that the browser
// environment from playwright.config.js (locale, timezone, geolocation,
// permissions, color scheme) is really applied.
test.describe('Browser environment', { tag: '@env' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // any https page of the app is enough
  });

  test.afterEach(reportTestResult);

  test('locale and timezone come from the project config', async ({ page }) => {
    await test.step('Locale is en-US', async () => {
      expect(await page.evaluate(() => navigator.language)).toBe('en-US');
    });

    await test.step('Timezone is Europe/Kyiv (UTC+2 in January)', async () => {
      // 12:00 UTC on 15 Jan → 14:00 in Kyiv, independent of the tz database name
      const kyivTime = await page.evaluate(() =>
        new Date(Date.UTC(2026, 0, 15, 12, 0)).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
      expect(kyivTime).toBe('14:00');
    });
  });

  test('geolocation is mocked to Kyiv', async ({ page }) => {
    const position = await page.evaluate(
      () =>
        new Promise((resolve) =>
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
            (error) => resolve({ error: error.message }),
          ),
        ),
    );

    expect(position.latitude).toBeCloseTo(50.4501, 3);
    expect(position.longitude).toBeCloseTo(30.5234, 3);
  });

  test('geolocation permission is granted', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Permissions API reports state differently outside Chromium');

    const state = await page.evaluate(async () => (await navigator.permissions.query({ name: 'geolocation' })).state);
    expect(state).toBe('granted');
  });

  test('color scheme is light by default', async ({ page }) => {
    expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches)).toBe(true);
  });

  // Any option from the config can be overridden for a group of tests
  test.describe('with overridden environment', () => {
    test.use({ colorScheme: 'dark', locale: 'uk-UA' });

    test('dark theme and Ukrainian locale', async ({ page }) => {
      expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true);
      expect(await page.evaluate(() => navigator.language)).toBe('uk-UA');
    });
  });
});
