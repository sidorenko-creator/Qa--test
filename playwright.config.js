// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { AUTH_STATE_PATH } from './utils/paths.js';

dotenv.config({ quiet: true });

// ───────────────────────────── Environment ─────────────────────────────
const isCI = !!process.env.CI;
const uiBaseURL = process.env.UI_BASE_URL ?? 'https://aqa-app.vercel.app';
const apiBaseURL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';
const headless = process.env.HEADED !== 'true';
const slowMo = Number(process.env.SLOW_MO ?? 0);
const workers = process.env.WORKERS ? Number(process.env.WORKERS) : isCI ? 2 : undefined;

// ──────────────────── Browser environment (lesson 25) ───────────────────
// Shared by every UI project. Individual specs can override any of it
// with test.use({ ... }) – see tests/ui/browser-environment.spec.js.
const browserEnvironment = {
  baseURL: uiBaseURL,
  headless,
  locale: 'en-US',
  timezoneId: 'Europe/Kiev', // IANA alias of Europe/Kyiv, accepted by every browser
  geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Kyiv
  permissions: ['geolocation'],
  colorScheme: 'light',
  launchOptions: { slowMo },
};

// Every UI project starts already logged in (storageState from "setup").
const authenticatedUI = {
  ...browserEnvironment,
  storageState: AUTH_STATE_PATH,
};

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // ─────────────── Execution control: timings, workers, retries ──────────────
  // (lessons 22 and 23)
  timeout: 30_000, //            max time for one test (incl. hooks)
  expect: { timeout: 5_000 }, //  max time for one expect() with auto-retry
  globalTimeout: isCI ? 15 * 60_000 : 0, // whole run, 0 = unlimited locally
  fullyParallel: true, //         tests inside one file run in parallel too
  forbidOnly: isCI, //            fail the CI run if test.only is left in code
  retries: isCI ? 2 : 0, //       retry failed tests only on CI
  workers, //                     CI: 2, local: half of CPU cores (override: WORKERS=4)
  maxFailures: isCI ? 10 : 0, //  stop early on CI when everything is broken

  // ─────────────────────────────── Reporting ──────────────────────────────
  // (lesson 21) list/line = console, html = rich report, json/junit = machine
  // readable (for dashboards / CI), github = annotations inside GitHub Actions.
  reporter: isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'reports/results.json' }],
      ],

  // Runs once after all projects (removes the saved auth session).
  globalTeardown: './global-teardown.js',

  use: {
    actionTimeout: 10_000, //      one click/fill/etc.
    navigationTimeout: 20_000, //  goto / redirects
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // ─────────────────────────────── Projects ───────────────────────────────
  projects: [
    // 1) SETUP — registers a user, logs in and saves storageState (lesson 20/21)
    {
      name: 'setup',
      testMatch: '**/*.setup.js',
      use: { ...devices['Desktop Chrome'], ...browserEnvironment },
    },

    // 2) DESKTOP BROWSERS (lesson 24) — depend on setup, start authenticated
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], ...authenticatedUI },
    },
    {
      name: 'firefox',
      testMatch: '**/ui/**/*.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], ...authenticatedUI },
    },
    {
      name: 'webkit',
      testMatch: '**/ui/**/*.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Desktop Safari'], ...authenticatedUI },
    },

    // 3) MOBILE BROWSERS (lesson 24) — device emulation
    {
      name: 'mobile-chrome',
      testMatch: '**/ui/**/*.spec.js',
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], ...authenticatedUI },
    },
    {
      name: 'mobile-safari',
      testMatch: '**/ui/**/*.spec.js',
      dependencies: ['setup'],
      use: { ...devices['iPhone 14'], ...authenticatedUI },
    },

    // 4) API — no browser, no setup needed
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.js',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
