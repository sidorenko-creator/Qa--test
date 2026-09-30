import { expect } from '@playwright/test';

/** Shopping cart: list of added products and the total. */
export class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.firstProductName = page.locator('#cart-item-name-6');
    this.secondProductName = page.locator('#cart-item-name-5');
    this.firstProductPrice = page.locator('#cart-item-price-6');
    this.secondProductPrice = page.locator('#cart-item-price-5');
    this.total = page.locator('#cart-total');
    this.checkoutButton = page.locator('#cart-checkout-button');
  }

  /** Cart shows the same names and prices as the catalog did. */
  async verifyProducts(products) {
    await expect(this.firstProductName).toHaveText(products.coffeeMachine.name);
    await expect(this.secondProductName).toHaveText(products.tablet.name);
    await expect(this.firstProductPrice).toHaveText(products.coffeeMachine.price);
    await expect(this.secondProductPrice).toHaveText(products.tablet.price);
  }

  /** Total equals the sum of both product prices. */
  async verifyTotal() {
    const firstPrice = this.#parsePrice(await this.firstProductPrice.innerText());
    const secondPrice = this.#parsePrice(await this.secondProductPrice.innerText());
    const total = this.#parsePrice(await this.total.innerText());

    expect(total).toBe(firstPrice + secondPrice);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout/);
  }

  #parsePrice(value) {
    const normalized = value.replace(/[^0-9.,-]/g, '').replace(',', '.');
    return Number.parseFloat(normalized);
  }
}
