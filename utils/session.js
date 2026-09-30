import fs from 'node:fs';
import { AUTH_DIR, SESSION_PATH } from './paths.js';

/**
 * Saves the test user (created in the setup project) so that the tests
 * can reuse the credentials and the path of the catalog page.
 * @param {{ user: object, catalogPath: string }} session
 */
export function saveSession(session) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(SESSION_PATH, JSON.stringify(session, null, 2));
}

/**
 * @returns {{ user: object, catalogPath: string }}
 */
export function loadSession() {
  if (!fs.existsSync(SESSION_PATH)) {
    throw new Error(
      `Session file not found: ${SESSION_PATH}\n` +
        'Run the "setup" project first (it runs automatically before UI projects, ' +
        'unless you pass --no-deps).',
    );
  }
  return JSON.parse(fs.readFileSync(SESSION_PATH, 'utf-8'));
}
