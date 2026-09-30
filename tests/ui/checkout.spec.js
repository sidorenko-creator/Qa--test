import { test } from '../../fixtures/index.js';
import { reportTestResult } from '../../utils/hooks.js';

test.describe('Checkout', { tag: ['@e2e', '@checkout'] }, () => {
  // The whole purchase flow is long → give tests in this block more time.
  test.describe.configure({ timeout: 60_000 });

  // Runs before every test: open the catalog as the logged-in user
  // (session comes from storageState created by the "setup" project).
  test.beforeEach(async ({ page, loginPage, session }) => {
    await test.step('Open the catalog as an authenticated user', async () => {
      await page.goto(session.catalogPath);
      await loginPage.ensureLoggedIn(session.user);
    });
  });

  // Runs after every test: prints the result, attaches the URL on failure.
  test.afterEach(reportTestResult);

  test(
    'user can add products to the cart and complete the checkout',
    { tag: '@smoke' },
    async ({ catalogPage, cartPage, checkoutPage, myAccountPage, card }) => {
      let products;

      await test.step('Add the coffee machine and the tablet to the cart', async (step) => {
        products = await catalogPage.addProductsToCart();
        await step.attach('selected-products', {
          body: JSON.stringify(products, null, 2),
          contentType: 'application/json',
        });
      });

      await test.step('Cart: verify product names and prices', async () => {
        await cartPage.verifyProducts(products);
      });

      await test.step('Cart: verify the total equals the sum of prices', async () => {
        await cartPage.verifyTotal();
      });

      await test.step('Go to the checkout page', async () => {
        await cartPage.proceedToCheckout();
      });

      await test.step(
        'Pay with a generated card',
        async (step) => {
          await checkoutPage.completePayment(card);
          // Only the last 4 digits go to the report
          await step.attach('card', { body: `**** **** **** ${card.cardNumber.slice(-4)}`, contentType: 'text/plain' });
        },
        { timeout: 15_000 }, // this step must finish within 15 s
      );

      await test.step('Verify the order was placed', async () => {
        await checkoutPage.verifySuccessfulOrder();
      });

      await test.step('Open "My account" page', async () => {
        await checkoutPage.goToMyAccount();
      });

      // Not enabled yet (was commented out in the original test):
      // await myAccountPage.verifyOrderItemCount(2);
    },
  );
});
