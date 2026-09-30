import fs from 'node:fs';
import { AUTH_DIR, SESSION_PATH } from './paths.js';

/**
 * Сохраняет тестового пользователя (создан в проекте "setup"), чтобы тесты могли
 * взять его логин/пароль и путь к странице каталога.
 * @param {{ user: import('../data/testdata.js').User, catalogPath: string }} session
 */
export function saveSession(session) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(SESSION_PATH, JSON.stringify(session, null, 2));
}

/**
 * @returns {{ user: import('../data/testdata.js').User, catalogPath: string }}
 */
export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) {
    throw new Error(
      `Файл сессии не найден: ${SESSION_PATH}\n` +
        'Сначала должен отработать проект "setup". Он запускается автоматически перед UI-проектами, ' +
        'если не указан флаг --no-deps. Для повторных запусков с --no-deps поставьте KEEP_AUTH=true.',
    );
  }
  return JSON.parse(fs.readFileSync(SESSION_PATH, 'utf-8'));
}
