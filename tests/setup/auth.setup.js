import { test as setup } from '../../fixtures/index.js';
import { createUser } from '../../data/testdata.js';
import { AUTH_STATE_PATH } from '../../utils/paths.js';
import { saveSession } from '../../utils/session.js';

/**
 * SETUP project (runs once, before every UI project).
 * Registers a fresh user, logs in and saves the browser state
 * (cookies + localStorage) to playwright/.auth/state.json.
 * All UI projects reuse that file through `storageState`,
 * so the tests do not repeat registration and login.
 */
setup('register a new user and save the authenticated session', async ({ page, registerPage, loginPage }) => {
  const user = createUser();

  await setup.step('Register a new user', async (step) => {
    await registerPage.open();
    await registerPage.register(user);
    await step.attach('registered-email', { body: user.email, contentType: 'text/plain' });
  });

  await setup.step('Log in with the new user', async () => {
    await loginPage.login(user.email, user.password);
  });

  await setup.step('Save storageState and session info', async () => {
    await page.context().storageState({ path: AUTH_STATE_PATH });
    saveSession({ user, catalogPath: new URL(page.url()).pathname });
  });
});
