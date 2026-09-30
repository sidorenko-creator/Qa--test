import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Folder where the authenticated session is stored (git-ignored). */
export const AUTH_DIR = path.join(projectRoot, 'playwright', '.auth');

/** Playwright storageState: cookies + localStorage of the logged-in user. */
export const AUTH_STATE_PATH = path.join(AUTH_DIR, 'state.json');

/** Extra info about the session: test user credentials and the catalog path. */
export const SESSION_PATH = path.join(AUTH_DIR, 'session.json');
