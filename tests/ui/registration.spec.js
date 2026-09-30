import { test } from '../../fixtures/index.js';
import { createUser } from '../../data/testdata.js';
import { reportTestResult } from '../../utils/hooks.js';

// This spec tests authentication itself, so it must start LOGGED OUT
// (ignores the storageState provided by the project).
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Registration and authentication', { tag: ['@auth'] }, () => {
  // Runs before every test in this describe
  test.beforeEach(async ({ registerPage }) => {
    await test.step('Open the login page', async () => {
      await registerPage.open();
    });
  });

  // Runs after every test in this describe
  test.afterEach(reportTestResult);

  test('new user can register, log in and log out', { tag: '@smoke' }, async ({ registerPage, loginPage, myAccountPage }) => {
    const user = createUser();

    await test.step('Register a new user', async () => {
      await registerPage.register(user);
    });

    await test.step('Log in with the new credentials', async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step('Open "My account" page', async () => {
      await myAccountPage.open();
    });

    await test.step('Log out and get back to the login page', async () => {
      await myAccountPage.logout();
    });
  });
});
