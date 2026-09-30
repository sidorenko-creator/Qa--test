import fs from 'node:fs';
import { AUTH_DIR } from './utils/paths.js';

/**
 * Выполняется один раз ПОСЛЕ всех проектов.
 * Удаляет сохранённую сессию (storageState + данные пользователя),
 * чтобы в репозитории и на диске не оставались логины и пароли.
 *
 * KEEP_AUTH=true — не удалять (удобно, чтобы перезапускать один тест с --no-deps).
 */
export default async function globalTeardown() {
  if (process.env.KEEP_AUTH === 'true') {
    console.log('\n[teardown] KEEP_AUTH=true → сессия оставлена в playwright/.auth');
    return;
  }

  fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  console.log('\n[teardown] Сохранённая сессия удалена (playwright/.auth)');
}
