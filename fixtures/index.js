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
 * Свой `test` с готовыми Page Object и тестовыми данными.
 * Вместо `new CartPage(page)` в каждом тесте просто просим `cartPage` в аргументах.
 *
 *   import { test, expect } from '../../fixtures/index.js';
 *   test('...', async ({ cartPage, card }) => { ... });
 *
 * Фикстура создаётся только если тест её запросил — лишнего не выполняется.
 */
export const test = base.extend({
  // ── Page Object: создаются на каждый тест, используют его `page` ──
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  myAccountPage: async ({ page }, use) => use(new MyAccountPage(page)),

  // ── Тестовые данные: новая карта на каждый тест ──
  card: async ({}, use) => use(createCardData()),

  // ── Сессия, сохранённая проектом "setup": { user, catalogPath }.
  //    scope: 'worker' — читается с диска один раз на воркер, а не на каждый тест. ──
  session: [async ({}, use) => use(loadSession()), { scope: 'worker' }],
});

export { expect };
