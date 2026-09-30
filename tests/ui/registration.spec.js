import { test } from '../../fixtures/index.js';
import { createUser } from '../../data/testdata.js';
import { reportTestResult } from '../../utils/hooks.js';

// Этот файл проверяет саму авторизацию, поэтому должен стартовать БЕЗ входа.
// Перезаписываем storageState, который проект выдаёт по умолчанию, пустым состоянием.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Registration and authentication', { tag: ['@auth'] }, () => {
  // Выполняется ПЕРЕД каждым тестом этого блока
  test.beforeEach(async ({ registerPage }) => {
    await test.step('Открываем страницу логина', async () => {
      await registerPage.open();
    });
  });

  // Выполняется ПОСЛЕ каждого теста этого блока
  test.afterEach(reportTestResult);

  // Сценарий: регистрация → вход → выход. Это и есть «жизненный цикл» пользователя.
  test('new user can register, log in and log out', { tag: '@smoke' }, async ({ registerPage, loginPage, myAccountPage }) => {
    const user = createUser();

    await test.step('Регистрируем нового пользователя', async () => {
      await registerPage.register(user);
    });

    await test.step('Входим с новыми логином и паролем', async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step('Открываем личный кабинет', async () => {
      await myAccountPage.open();
    });

    await test.step('Выходим из аккаунта → попадаем на страницу логина', async () => {
      await myAccountPage.logout();
    });
  });
});
