import { expect } from '@playwright/test';

export class CatalogPage {
  constructor(page) {
    this.page = page;
    this.coffeeMachineProduct = page.locator('#product-add-6');
    this.tabletProduct = page.locator('#product-add-5');
    this.cartCount = page.locator('#cart-count');
    this.tabletName = page.locator('#product-name-5');
    this.coffeeMachineName = page.locator('#product-name-6');
    this.tabletPrice = page.locator('#product-price-5');
    this.coffeeMachinePrice = page.locator('#product-price-6');
  }

  async addProductsToCart() {
    await this.coffeeMachineProduct.click();
    await this.tabletProduct.click();
    await expect(this.cartCount).toHaveText('2');

    const products = await this.getProductDetails();
    await this.cartCount.click();
    return products;
  }

  async getProductDetails() {
    return {
      tablet: {
        name: await this.tabletName.innerText(),
        price: await this.tabletPrice.innerText(),
      },
      coffeeMachine: {
        name: await this.coffeeMachineName.innerText(),
        price: await this.coffeeMachinePrice.innerText(),
      },
    };
  }
}
