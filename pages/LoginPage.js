import { expect } from '@playwright/test';

/** Login form. After a successful login the catalog is shown. */
export class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.email = page.locator('#login-email');
    this.password = page.locator('#login-password');
    this.loginButton = page.locator('#login-button');
    this.catalogTitle = page.locator('#catalog-title');
  }

  async open() {
    await this.page.goto('/login');
  }

  /** Logs in through the UI and waits until the catalog is visible. */
  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.catalogTitle).toBeVisible();
  }

  /**
   * Safety net for tests that start with a saved storageState:
   * if the app still shows the login form (session was not restored),
   * log in through the UI instead of failing with a confusing error.
   */
  async ensureLoggedIn({ email, password }) {
    await expect(this.catalogTitle.or(this.loginButton)).toBeVisible();

    if (await this.loginButton.isVisible()) {
      console.warn('[auth] storageState was not applied — logging in through the UI');
      await this.login(email, password);
    }
  }
}
