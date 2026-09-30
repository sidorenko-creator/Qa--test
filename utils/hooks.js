/**
 * Общий хук afterEach: печатает в консоль итог каждого теста,
 * а при падении прикладывает к отчёту адрес страницы, на которой остановился браузер.
 *
 * Использование:  test.afterEach(reportTestResult);
 */
export async function reportTestResult({ page }, testInfo) {
  const failed = testInfo.status !== testInfo.expectedStatus;
  const icon = failed ? '✘' : '✔';
  console.log(`${icon} [${testInfo.project.name}] ${testInfo.title} — ${testInfo.status}, ${testInfo.duration} мс`);

  if (failed) {
    await testInfo.attach('url-при-падении', { body: page.url(), contentType: 'text/plain' });
  }
}
