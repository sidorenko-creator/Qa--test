// import {expect} from '@playwright/test';

// export class bucketPage {
//     constructor(page, cofeeMachineNameValue, tabletNameValue, cofeeMachinePriceValue, tabletPriceValue) {
//         this.page = page;
//         this.firstProductName = page.locator('[id="cart-item-name-6"]');
//         this.secondProductName = page.locator('[id="cart-item-name-5"]');

//         this.firstProductPrice = page.locator('[id="cart-item-price-6"]');
//         this.secondProductPrice = page.locator('[id="cart-item-price-5"]');

//         this.totalValue = page.locator('[id="cart-total"]');
//         this.checkoutButton = page.locator('[id="cart-checkout-button"');

//         this.addFirstItemButton = page.locator('[id="cart-item-increase-6"]');
//         this.decreaseFirstItemButton = page.locator('[id="cart-item-decrease-6"]');

//         this.tabletNameValue = tabletNameValue;
//         this.cofeeMachineNameValue = cofeeMachineNameValue;
//         this.tabletPriceValue = tabletPriceValue;
//         this.cofeeMachinePriceValue = cofeeMachinePriceValue;
//     }
//     async compareProductDetails() {
//         await expect(this.firstProductName).toHaveText(this.cofeeMachineNameValue);
//         await expect(this.secondProductName).toHaveText(this.tabletNameValue);
//         await expect(this.firstProductPrice).toHaveText(this.cofeeMachinePriceValue);
//         await expect(this.secondProductPrice).toHaveText(this.tabletPriceValue);
//     }  
// }
import { expect } from '@playwright/test';

export class BucketPage {
  constructor(page, tabletNameValue, coffeeMachineNameValue, tabletPriceValue, coffeeMachinePriceValue) {
    this.page = page;

    // Локатори кнопок та елементів
    this.removeFirstItemButton = page.locator('[id="cart-item-decrease-6"]');
    this.addFirstItemButton = page.locator('[id="cart-item-increase-6"]');

    this.firstProductItem = page.locator('[id="cart-item-name-6"]');
    this.secondProductItem = page.locator('[id="cart-item-name-5"]');
    this.firstItemPrice = page.locator('[id="cart-item-price-6"]');
    this.secondItemPrice = page.locator('[id="cart-item-price-5"]');

    // Локатори загальної вартості та кнопки оформлення
    this.totalValue = page.locator('[id="cart-total"]'); // перевірте id на вашому сайті
    this.checkoutButton = page.locator('[id="cart-checkout-button"]'); // перевірте id на вашому сайті

    // Збережені значення з каталогу
    this.tabletNameValue = tabletNameValue;
    this.coffeeMachineNameValue = coffeeMachineNameValue;
    this.tabletPriceValue = tabletPriceValue;
    this.coffeeMachinePriceValue = coffeeMachinePriceValue;
  }

  // Перевірка назв та цін товарів
  async compareProductsDetails() {
    await expect(this.firstProductItem).toHaveText(this.coffeeMachineNameValue);
    await expect(this.secondProductItem).toHaveText(this.tabletNameValue);
    await expect(this.firstItemPrice).toHaveText(this.coffeeMachinePriceValue);
    await expect(this.secondItemPrice).toHaveText(this.tabletPriceValue);
  }

  // перевірка загальної суми та перехід на checkout
  async checkTotalPrice() {
    const firstProductPriceNumber = Number((await this.firstItemPrice.innerText()).replace(/\D/g, ''));
    const secondProductPriceNumber = Number((await this.secondItemPrice.innerText()).replace(/\D/g, ''));
    
    // Отримуємо текст загальної суми, замінюємо кому на крапку та прибираємо знаки валюти
    const totalRawText = await this.totalValue.innerText();
    const totalNumber = Number(totalRawText.replace(/[^0-9.]/g, ''));

    // Перевірка (використовуємо Math.round або ділення на 100, якщо ціна в копійках)
    // Якщо totalValue містить ".00", беремо цілу частину або ділимо на 100:
    const normalizedTotal = totalNumber > 10000 ? totalNumber / 100 : totalNumber;

    expect(normalizedTotal).toBe(firstProductPriceNumber + secondProductPriceNumber);

    await this.checkoutButton.click();
    await this.page.waitForURL(/.*checkout/);
  }
}