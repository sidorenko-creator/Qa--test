// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { AUTH_STATE_PATH } from './utils/paths.js';

dotenv.config({ quiet: true });

// ═══════════════════════════ Переменные окружения ═══════════════════════════
const isCI = !!process.env.CI; // GitHub Actions сам выставляет CI=true
const uiBaseURL = process.env.UI_BASE_URL ?? 'https://aqa-app.vercel.app';
const apiBaseURL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';
const headless = process.env.HEADED !== 'true';
const slowMo = Number(process.env.SLOW_MO ?? 0);
const workers = process.env.WORKERS ? Number(process.env.WORKERS) : isCI ? 2 : undefined;

// ═════════════════ Окружение браузера (урок 25) ═════════════════
// Общее для всех UI-проектов. Любой спек может переопределить через test.use({ ... }).
const browserEnvironment = {
  baseURL: uiBaseURL,
  headless,
  locale: 'en-US',
  timezoneId: 'Europe/Kiev', // старое имя Europe/Kyiv; его понимают все браузеры
  geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Киев
  permissions: ['geolocation'],
  colorScheme: 'light',
  launchOptions: { slowMo },
};

// Все UI-проекты стартуют уже залогиненными: сессию создаёт проект "setup"
const authenticatedUI = {
  ...browserEnvironment,
  storageState: AUTH_STATE_PATH,
};

const UI_TESTS = '**/ui/**/*.spec.js';

/**
 * Собирает UI-проект: одинаковые testMatch, зависимость от setup и окружение.
 * Так добавить новый браузер или устройство — это одна строка, а не копипаста.
 * @param {string} name   имя проекта (как в --project=...)
 * @param {object} device устройство из devices[...]
 * @param {import('@playwright/test').Project} [extra] доп. настройки проекта
 * @returns {import('@playwright/test').Project}
 */
const uiProject = (name, device, extra = {}) => ({
  name,
  testMatch: UI_TESTS,
  dependencies: ['setup'],
  use: { ...device, ...authenticatedUI },
  ...extra,
});

// Дополнительные браузеры прогоняют только тесты с тегом @smoke (быстрая «дымовая» проверка),
// а полный набор работает в chromium. Так кросс-браузерность есть, а время прогона не x5.
const smokeOnly = { grep: /@smoke/ };

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // ═══════════ Контроль выполнения: тайминги, воркеры, ретраи (уроки 22–23) ═══════════
  timeout: 30_000, //            максимум на один тест (вместе с хуками)
  expect: { timeout: 5_000 }, //  максимум на одну проверку expect() с автоповтором
  globalTimeout: isCI ? 15 * 60_000 : 0, // на весь прогон; 0 = без лимита (локально)
  fullyParallel: true, //         тесты внутри одного файла тоже идут параллельно
  forbidOnly: isCI, //            на CI падаем, если в коде забыт test.only
  retries: isCI ? 2 : 0, //       повторяем упавшие тесты только на CI
  workers, //                     CI: 2; локально — половина ядер CPU (WORKERS=4 чтобы изменить)
  maxFailures: isCI ? 10 : 0, //  на CI останавливаемся, если сломалось всё подряд

  // ═══════════════════════════ Отчёты (урок 21) ═══════════════════════════
  // list — в консоль, html — красивый отчёт, json/junit — для машин и дашбордов,
  // github — подсветка ошибок прямо в GitHub Actions.
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'reports/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'reports/results.json' }]],

  // Выполняется один раз после всех проектов (удаляет сохранённую сессию)
  globalTeardown: './global-teardown.js',

  use: {
    actionTimeout: 10_000, //      один click / fill и т.п.
    navigationTimeout: 20_000, //  один переход на страницу
    trace: 'retain-on-failure', // трассировка, скриншот и видео сохраняются только при падении
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // ═══════════════════════════════ Проекты ═══════════════════════════════
  projects: [
    // 1) SETUP — регистрирует пользователя, логинится, сохраняет storageState (урок 20–21)
    {
      name: 'setup',
      testMatch: '**/*.setup.js',
      use: { ...devices['Desktop Chrome'], ...browserEnvironment },
    },

    // 2) UI в основном браузере — ВСЕ UI-тесты (урок 24)
    uiProject('chromium', devices['Desktop Chrome']),

    // 3) Другие десктопные браузеры — только @smoke
    uiProject('firefox', devices['Desktop Firefox'], smokeOnly),
    uiProject('webkit', devices['Desktop Safari'], smokeOnly),

    // 4) Мобильные устройства (эмуляция) — только @smoke
    uiProject('mobile-chrome', devices['Pixel 7'], smokeOnly),
    uiProject('mobile-safari', devices['iPhone 14'], smokeOnly),

    // 5) API — без браузера и без setup
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.js',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },

    // 6) UNIT — проверка вспомогательных функций, браузер не нужен
    {
      name: 'unit',
      testMatch: '**/unit/**/*.spec.js',
    },
  ],
});
