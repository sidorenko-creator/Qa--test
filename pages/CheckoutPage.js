import { expect } from '@playwright/test';

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.cardNumber = page.getByPlaceholder('Card Number (16 digits)');
    this.cardDate = page.getByPlaceholder('MM/YY');
    this.cardCVV = page.getByPlaceholder('CVV (3 digits)');
    this.payNowButton = page.getByRole('button', { name: 'Pay Now' });
    this.successMessage = page.locator('#checkout-success');
    this.myAccountButton = page.locator('[href="/account"]');
  }

  async completePayment(card) {
    await this.cardNumber.fill(card.cardNumber);
    await this.cardDate.fill(card.cardDate);
    await this.cardCVV.fill(card.cardCVV);
    await this.payNowButton.click();
  }

  async verifySuccessfulOrder() {
    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.successMessage).toBeVisible();
  }

  async goToMyAccount() {
    await this.myAccountButton.click();
    await expect(this.page).toHaveURL(/\/account/);
  }
}
