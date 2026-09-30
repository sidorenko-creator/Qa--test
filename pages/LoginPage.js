import { expect } from '@playwright/test';

/** Форма логина. После успешного входа открывается каталог. */
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

  /** Входит через интерфейс и ждёт, пока появится каталог. */
  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.catalogTitle).toBeVisible();
  }

  /**
   * Страховка для тестов, которые стартуют с сохранённой сессией (storageState):
   * если сайт всё равно показал форму логина (сессия не восстановилась),
   * входим через интерфейс, а не падаем с непонятной ошибкой.
   */
  async ensureLoggedIn({ email, password }) {
    await expect(this.catalogTitle.or(this.loginButton)).toBeVisible();

    if (await this.loginButton.isVisible()) {
      console.warn('[auth] storageState не сработал — входим через интерфейс');
      await this.login(email, password);
    }
  }
}
