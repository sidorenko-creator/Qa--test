import { test } from '../../fixtures/index.js';
import { PRODUCT_IDS } from '../../data/products.js';
import { reportTestResult } from '../../utils/hooks.js';

test.describe('Checkout', { tag: ['@e2e', '@checkout'] }, () => {
  // Сценарий покупки длинный → даём тестам этого блока 60 секунд вместо 30
  test.describe.configure({ timeout: 60_000 });

  // ПЕРЕД каждым тестом: открываем каталог как залогиненный пользователь.
  // Сессия уже есть благодаря storageState, созданному проектом "setup".
  test.beforeEach(async ({ page, loginPage, session }) => {
    await test.step('Открываем каталог залогиненным пользователем', async () => {
      await page.goto(session.catalogPath);
      await loginPage.ensureLoggedIn(session.user); // страховка, если сессия не подхватилась
    });
  });

  // ПОСЛЕ каждого теста: итог в консоль + адрес страницы в отчёт при падении
  test.afterEach(reportTestResult);

  test(
    'user can add products to the cart and complete the checkout',
    { tag: '@smoke' },
    async ({ catalogPage, cartPage, checkoutPage, card }) => {
      /** @type {import('../../data/products.js').Product[]} */
      let products;

      await test.step('Добавляем в корзину кофемашину и планшет', async (step) => {
        products = await catalogPage.addProductsToCart([PRODUCT_IDS.coffeeMachine, PRODUCT_IDS.tablet]);
        // Прикладываем выбранные товары к шагу — видно в HTML-отчёте
        await step.attach('выбранные-товары', {
          body: JSON.stringify(products, null, 2),
          contentType: 'application/json',
        });
      });

      await test.step('Корзина: названия и цены совпадают с каталогом', async () => {
        await cartPage.verifyProducts(products);
      });

      await test.step('Корзина: «Итого» равно сумме цен', async () => {
        await cartPage.verifyTotal(products);
      });

      await test.step('Переходим к оформлению заказа', async () => {
        await cartPage.proceedToCheckout();
      });

      await test.step(
        'Оплачиваем сгенерированной картой',
        async (step) => {
          await checkoutPage.completePayment(card);
          // В отчёт попадают только последние 4 цифры карты
          await step.attach('карта', { body: `**** **** **** ${card.cardNumber.slice(-4)}`, contentType: 'text/plain' });
        },
        { timeout: 15_000 }, // этот шаг должен уложиться в 15 секунд
      );

      await test.step('Проверяем, что заказ оформлен', async () => {
        await checkoutPage.verifySuccessfulOrder();
      });

      await test.step('Открываем личный кабинет', async () => {
        await checkoutPage.goToMyAccount();
      });

      // Пока выключено (было закомментировано в исходном тесте):
      // await myAccountPage.verifyOrderItemCount(2);
    },
  );
});
