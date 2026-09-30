import { test as setup } from '../../fixtures/index.js';
import { createUser } from '../../data/testdata.js';
import { AUTH_STATE_PATH } from '../../utils/paths.js';
import { saveSession } from '../../utils/session.js';

/**
 * SETUP-проект: выполняется ОДИН раз перед всеми UI-проектами.
 *
 * Регистрирует нового пользователя, входит в аккаунт и сохраняет состояние браузера
 * (cookies + localStorage) в playwright/.auth/state.json.
 * Дальше каждый UI-тест получает этот файл через `storageState` в конфиге
 * и стартует уже залогиненным — без повторной регистрации и логина.
 */
setup('register a new user and save the authenticated session', async ({ page, registerPage, loginPage }) => {
  const user = createUser();

  await setup.step('Регистрируем нового пользователя', async (step) => {
    await registerPage.open();
    await registerPage.register(user);
    await step.attach('email-пользователя', { body: user.email, contentType: 'text/plain' });
  });

  await setup.step('Входим в аккаунт', async () => {
    await loginPage.login(user.email, user.password);
  });

  await setup.step('Сохраняем storageState и данные сессии', async () => {
    await page.context().storageState({ path: AUTH_STATE_PATH });
    // Запоминаем, по какому пути открывается каталог после логина
    saveSession({ user, catalogPath: new URL(page.url()).pathname });
  });
});
