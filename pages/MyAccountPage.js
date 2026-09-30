import { expect } from '@playwright/test';

/** "My account" page: order history and logout. */
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

  // These two checks were commented out in the original test and are
  // still NOT called from any spec. Enable them when the locators are verified.
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
