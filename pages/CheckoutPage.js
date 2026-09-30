import { expect } from '@playwright/test';

/** Форма оплаты — открывается после «Checkout» в корзине. */
export class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cardNumber = page.getByPlaceholder('Card Number (16 digits)');
    this.cardDate = page.getByPlaceholder('MM/YY');
    this.cardCVV = page.getByPlaceholder('CVV (3 digits)');
    this.payNowButton = page.getByRole('button', { name: 'Pay Now' });
    this.successMessage = page.locator('#checkout-success');
    this.myAccountButton = page.locator('[href="/account"]');
  }

  /** Вводит данные карты и нажимает «Pay Now». */
  async completePayment(card) {
    await this.cardNumber.fill(card.cardNumber);
    await this.cardDate.fill(card.cardDate);
    await this.cardCVV.fill(card.cardCVV);
    await this.payNowButton.click();
  }

  async verifySuccessfulOrder() {
    await expect(this.page).toHaveURL(/\/checkout/);
    // Проверка сообщения об успехе была закомментирована в исходном тесте.
    // Включить, когда локатор #checkout-success подтверждён на сайте:
    // await expect(this.successMessage).toBeVisible();
  }

  async goToMyAccount() {
    await this.myAccountButton.click();
    await expect(this.page).toHaveURL(/\/account/);
  }
}
