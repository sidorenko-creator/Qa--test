import { test, expect } from '../../fixtures/index.js';
import { reportTestResult } from '../../utils/hooks.js';

// Эти тесты НЕ проверяют магазин. Они проверяют, что настройки окружения браузера
// из playwright.config.js (язык, часовой пояс, геолокация, разрешения, тема)
// действительно применились. Это тема урока 25.
test.describe('Browser environment', { tag: '@env' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // подойдёт любая https-страница приложения
  });

  test.afterEach(reportTestResult);

  test('locale and timezone come from the project config', async ({ page }) => {
    await test.step('Язык браузера — en-US', async () => {
      expect(await page.evaluate(() => navigator.language)).toBe('en-US');
    });

    await test.step('Часовой пояс — Киев (UTC+2 в январе)', async () => {
      // 12:00 UTC 15 января → 14:00 в Киеве. Сравниваем время, а не название пояса:
      // так результат не зависит от того, как браузер называет Europe/Kyiv или Europe/Kiev
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

    // Координаты Киева из конфига (точность 3 знака после запятой ≈ 100 м)
    expect(position.latitude).toBeCloseTo(50.4501, 3);
    expect(position.longitude).toBeCloseTo(30.5234, 3);
  });

  test('geolocation permission is granted', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Permissions API вне Chromium возвращает состояние иначе');

    const state = await page.evaluate(async () => (await navigator.permissions.query({ name: 'geolocation' })).state);
    expect(state).toBe('granted');
  });

  test('color scheme is light by default', async ({ page }) => {
    expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: light)').matches)).toBe(true);
  });

  // Любую опцию из конфига можно переопределить для группы тестов через test.use
  test.describe('with overridden environment', () => {
    test.use({ colorScheme: 'dark', locale: 'uk-UA' });

    test('dark theme and Ukrainian locale', async ({ page }) => {
      expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true);
      expect(await page.evaluate(() => navigator.language)).toBe('uk-UA');
    });
  });
});
