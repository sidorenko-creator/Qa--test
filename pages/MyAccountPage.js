import { expect } from '@playwright/test';

export class MyAccountPage {
  constructor(page) {
    this.page = page;
    this.orderItems = page.locator('#account-order-0 ul > li');
    this.totalAmount = page.locator('#account-order-0 p', { hasText: 'Total Amount:' });
    this.logoutButton = page.locator('#account-logout-button');
  }

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
