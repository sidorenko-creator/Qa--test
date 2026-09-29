import { expect } from '@playwright/test';
export class CatalogPage {
    constructor(page) {
        this.page = page;
        this.coffemachineProduct = page.locator('[id="product-add-6"]');
        this.tabletProduct = page.locator('[id="product-add-5"]');
        this.busketcount = page.locator('[id="cart-count"]');
        
        this.tabletName = page.locator('[id="product-name-5"]');
        this.cofeeMachineName = page.locator('[id="product-name-6"]');
        
        this.tabletPrice = page.locator('[id="product-price-5"]');
        this.cofeeMachinePrice = page.locator('[id="product-price-6"]');

        this.tabletNameValue = '';
        this.cofeeMachineNameValue = '';
        this.tabletPriceValue = '';
        this.cofeeMachinePriceValue = '';
    
    }


    async selectProduct() { 
        await this.coffemachineProduct.click({delay: 1000});
        await this.tabletProduct.click({delay: 1000});
        // const productQuantity = await this.busketcount.innerText();
        // await this.page.waitForTimeout(5000);
        // await this.page.pause();
        await expect(this.busketcount).toHaveText('2'); 
        await this.safeProductDetails();
        await this.busketcount.click();
    }

    async safeProductDetails() {
        this.tabletNameValue = await this.tabletName.innerText();
        this.cofeeMachineNameValue = await this.cofeeMachineName.innerText();
        this.tabletPriceValue = await this.tabletPrice.innerText();
        this.cofeeMachinePriceValue = await this.cofeeMachinePrice.innerText();

        console.log(this.tabletNameValue);
        console.log(this.cofeeMachineNameValue);
        console.log(this.tabletPriceValue);
        console.log(this.cofeeMachinePriceValue);
    }
}
