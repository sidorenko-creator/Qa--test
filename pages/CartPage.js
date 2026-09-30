import { expect } from '@playwright/test';
import { parsePrice } from '../utils/price.js';

/** Корзина: список добавленных товаров и итоговая сумма. */
export class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.total = page.locator('#cart-total');
    this.checkoutButton = page.locator('#cart-checkout-button');
  }

  // ── Локаторы строки корзины по ID товара ──
  itemName = (id) => this.page.locator(`#cart-item-name-${id}`);
  itemPrice = (id) => this.page.locator(`#cart-item-price-${id}`);

  /**
   * В корзине те же названия и цены, что были в каталоге.
   * @param {import('../data/products.js').Product[]} products
   */
  async verifyProducts(products) {
    for (const product of products) {
      await expect(this.itemName(product.id)).toHaveText(product.name);
      await expect(this.itemPrice(product.id)).toHaveText(product.price);
    }
  }

  /**
   * «Итого» равно сумме цен товаров в корзине.
   * toBeCloseTo вместо toBe: у дробных чисел 0.1 + 0.2 !== 0.3, точное сравнение
   * могло бы случайно падать из-за округления.
   * @param {import('../data/products.js').Product[]} products
   */
  async verifyTotal(products) {
    let expectedTotal = 0;
    for (const product of products) {
      expectedTotal += parsePrice(await this.itemPrice(product.id).innerText());
    }

    const actualTotal = parsePrice(await this.total.innerText());
    expect(actualTotal, 'Итого в корзине = сумма цен товаров').toBeCloseTo(expectedTotal, 2);
  }

  /** Нажимает «Checkout» и проверяет, что открылась страница оплаты. */
  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout/);
  }
}
