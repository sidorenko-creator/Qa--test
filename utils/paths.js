import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Папка, где хранится сессия залогиненного пользователя (в .gitignore). */
export const AUTH_DIR = path.join(projectRoot, 'playwright', '.auth');

/** storageState Playwright: cookies + localStorage залогиненного пользователя. */
export const AUTH_STATE_PATH = path.join(AUTH_DIR, 'state.json');

/** Дополнительная информация о сессии: данные тестового пользователя и путь каталога. */
export const SESSION_PATH = path.join(AUTH_DIR, 'session.json');
