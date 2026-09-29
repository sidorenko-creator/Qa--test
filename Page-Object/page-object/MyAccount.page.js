import { expect } from "@playwright/test";

export class MyAccountPage {
  constructor(page) {
    this.page = page;

    this.items = page.locator('#account-order-0 ul > li');
    this.totalAmountFiled = page.locator('#account-order-0 p', { hasText: 'Total Amount:' });
    this.logoutButton = page.locator('[id="account-logout-button"]');
  }

//   async checkFinalOrder(firstItemPrice, lastItemPrice) {
//     const totalPrice = Number(firstItemPrice.replace('$', '')) + Number(lastItemPrice.replace('$', ''));
//     await expect(this.totalAmountFiled).toContainText(`$${totalPrice}`);
//   }

//   async checkTwoItems() {
//     await expect(this.items.first()).toBeVisible();
//     await expect(this.items.last()).toBeVisible();
//     await expect(this.logoutButton).toBeEnabled();
//   }

  async logout() {
    await this.logoutButton.click();
    
  }
}
