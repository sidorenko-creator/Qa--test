import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage.js';
import { LoginPage } from '../../pages/LoginPage.js';
import { CatalogPage } from '../../pages/CatalogPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';
import { MyAccountPage } from '../../pages/MyAccountPage.js';
import { createCardData, createUser } from '../../data/testdata.js';

test('user can register, log in, add products and complete checkout', async ({ page }) => {
  const user = createUser();
  const card = createCardData();

  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);
  const catalogPage = new CatalogPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const myAccountPage = new MyAccountPage(page);

  await registerPage.navigate();
  await registerPage.register(user);

  await loginPage.login(user.email, user.password);

  const products = await catalogPage.addProductsToCart();
  await cartPage.verifyProducts(products);
  await cartPage.verifyTotal();
  await cartPage.proceedToCheckout();

  await checkoutPage.completePayment(card);
  await checkoutPage.verifySuccessfulOrder();
  await checkoutPage.goToMyAccount();

  await myAccountPage.verifyOrderItemCount(2);
  await myAccountPage.logout();
});
