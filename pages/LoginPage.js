import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('#login-email');
    this.password = page.locator('#login-password');
    this.loginButton = page.locator('#login-button');
    this.catalogTitle = page.locator('#catalog-title');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.catalogTitle).toBeVisible();
  }
}
