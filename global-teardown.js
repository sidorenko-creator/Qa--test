import fs from 'node:fs';
import { AUTH_DIR } from './utils/paths.js';

/**
 * Runs once after ALL projects have finished.
 * Removes the saved authenticated session (storageState + credentials).
 * Set KEEP_AUTH=true to keep it, e.g. to re-run a single test with --no-deps.
 */
export default async function globalTeardown() {
  if (process.env.KEEP_AUTH === 'true') {
    console.log('\n[teardown] KEEP_AUTH=true → saved session kept in playwright/.auth');
    return;
  }

  fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  console.log('\n[teardown] Saved auth session removed (playwright/.auth)');
}
