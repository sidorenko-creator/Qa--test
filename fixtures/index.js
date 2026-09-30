import { test as base, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { MyAccountPage } from '../pages/MyAccountPage.js';
import { createCardData } from '../data/testdata.js';
import { loadSession } from '../utils/session.js';

/**
 * Custom `test` with ready-to-use page objects and test data.
 * Import it instead of '@playwright/test':
 *   import { test, expect } from '../../fixtures/index.js';
 */
export const test = base.extend({
  // ── Page objects (created per test, share the test's `page`) ──
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  myAccountPage: async ({ page }, use) => use(new MyAccountPage(page)),

  // ── Test data ──
  card: async ({}, use) => use(createCardData()),

  // ── Saved by the "setup" project: { user, catalogPath }.
  //    Loaded once per worker. ──
  session: [async ({}, use) => use(loadSession()), { scope: 'worker' }],
});

export { expect };
