// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const uiBaseURL = process.env.UI_BASE_URL ?? 'https://aqa-app.vercel.app';
const apiBaseURL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';
const headless = process.env.HEADED !== 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['line']],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBaseURL,
        headless,
      },
    },
    {
      name: 'api-tests',
      testMatch: '**/api/**/*.spec.js',
      use: {
        baseURL: apiBaseURL,
      },
    },
  ],
});
