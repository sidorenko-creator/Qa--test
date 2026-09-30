/**
 * Shared afterEach helper: prints a one-line result for every test and,
 * when the test failed, attaches the URL the browser was on.
 * Usage:  test.afterEach(reportTestResult);
 */
export async function reportTestResult({ page }, testInfo) {
  const failed = testInfo.status !== testInfo.expectedStatus;
  const icon = failed ? '✘' : '✔';
  console.log(`${icon} [${testInfo.project.name}] ${testInfo.title} — ${testInfo.status} in ${testInfo.duration} ms`);

  if (failed) {
    await testInfo.attach('url-on-failure', { body: page.url(), contentType: 'text/plain' });
  }
}
