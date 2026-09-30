import { expect } from '@playwright/test';

/**
 * Каталог товаров: список товаров с кнопками «добавить в корзину».
 * Локаторы строятся по ID товара (#product-add-6 и т.д.), поэтому страница
 * работает с любым товаром, а не только с двумя «зашитыми» в код.
 */
export class CatalogPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.cartCount = page.locator('#cart-count'); // бейдж с количеством товаров в корзине
  }

  // ── Локаторы товара по ID ──
  addButton = (id) => this.page.locator(`#product-add-${id}`);
  productName = (id) => this.page.locator(`#product-name-${id}`);
  productPrice = (id) => this.page.locator(`#product-price-${id}`);

  /**
   * Добавляет товары в корзину по очереди, проверяет счётчик и открывает корзину.
   * Предполагается, что в начале корзина пуста (у каждого теста — свежий контекст браузера).
   * @param {number[]} ids ID товаров
   * @returns {Promise<import('../data/products.js').Product[]>}
   *          название и цена каждого товара — с ними потом сверяется корзина
   */
  async addProductsToCart(ids) {
    for (const id of ids) {
      await this.addButton(id).click();
    }
    await expect(this.cartCount).toHaveText(String(ids.length));

    const products = [];
    for (const id of ids) {
      products.push(await this.getProduct(id));
    }

    await this.cartCount.click(); // клик по значку корзины = переход в корзину
    return products;
  }

  /**
   * Читает название и цену товара из каталога.
   * @param {number} id
   * @returns {Promise<import('../data/products.js').Product>}
   */
  async getProduct(id) {
    return {
      id,
      name: await this.productName(id).innerText(),
      price: await this.productPrice(id).innerText(),
    };
  }
}
