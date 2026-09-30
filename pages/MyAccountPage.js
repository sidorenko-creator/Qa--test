import { expect } from '@playwright/test';

/** Личный кабинет: история заказов и выход из аккаунта. */
export class MyAccountPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.orderItems = page.locator('#account-order-0 ul > li');
    this.totalAmount = page.locator('#account-order-0 p', { hasText: 'Total Amount:' });
    this.logoutButton = page.locator('#account-logout-button');
  }

  async open() {
    await this.page.goto('/account');
  }

  // Эти две проверки были закомментированы в исходном тесте и до сих пор
  // НЕ вызываются ни в одном спеке. Включить, когда локаторы подтверждены на сайте.
  async verifyOrderItemCount(expectedCount) {
    await expect(this.orderItems).toHaveCount(expectedCount);
  }

  async verifyTotalAmount(expectedAmount) {
    await expect(this.totalAmount).toContainText(expectedAmount);
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login/);
  }
}
