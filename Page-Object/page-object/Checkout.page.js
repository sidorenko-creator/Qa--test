import { expect } from "@playwright/test";

export class Checkoutpage {
  constructor(page) {
    this.page = page;

    // Виправлено getByPlaceholder (з великої літери P)
    this.cardNumberField = page.getByPlaceholder('Card Number (16 digits)');

    // Залишаємо один правильний локатор для кнопки
    this.payNowBtn = page.getByRole('button', { name: 'Pay Now' });
    this.cardData = page.getByPlaceholder('MM/YY');
    this.cardCVV = page.getByPlaceholder('CVV (3 digits)')

    this.succesfulOrder = page.locator('id="checkout-success');
    this.myAccountButton = page.locator('[href="/account"]')
  }


  async fillPaymentData(cardNumber, cardDate, cardCVV) {
    await this.cardNumberField.fill(cardNumber,{delay: 100});
    await this.cardNumberField.press('Enter');
    await this.cardData.fill(String(cardDate));
    await this.cardCVV.fill(String(cardCVV))
    await this.payNowBtn.click();
    //await this.page.pause();


  }
  async successOrderMessage() {
    
    await expect(this.page).toHaveURL('https://aqa-app.vercel.app/checkout');
  }

  async goToMyAccount() {
    await this.myAccountButton.click();
    await expect(this.page).toHaveURL('https://aqa-app.vercel.app/account');
    
  }
}

