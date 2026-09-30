import { test, expect } from '@playwright/test';
import { apiDataPatch, apiDataPost } from '../../data/testdata.js';

test.describe('Posts API', { tag: '@api' }, () => {
  // Публичный тестовый API бывает нестабилен → до 2 повторов упавшего теста, по 15 секунд на тест
  test.describe.configure({ retries: 2, timeout: 15_000 });

  /** @type {import('@playwright/test').APIRequestContext} */
  let api;

  // ОДИН раз на воркер, перед первым тестом файла: создаём общий HTTP-клиент
  test.beforeAll(async ({ playwright }, testInfo) => {
    api = await playwright.request.newContext({
      baseURL: testInfo.project.use.baseURL, // адрес берётся из проекта "api-tests" в конфиге
      extraHTTPHeaders: { Accept: 'application/json' },
    });
  });

  // ОДИН раз на воркер, после последнего теста: закрываем клиент
  test.afterAll(async () => {
    await api.dispose();
  });

  // После каждого теста: итог в консоль
  test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === testInfo.expectedStatus ? '✔' : '✘';
    console.log(`${icon} [${testInfo.project.name}] ${testInfo.title} — ${testInfo.status}`);
  });

  test('GET /posts/1 returns the post', async () => {
    const response = await test.step('Отправляем GET /posts/1', () => api.get('/posts/1'));

    await test.step('Статус 200 OK', async () => {
      expect(response).toBeOK();
      expect(response.status()).toBe(200);
    });

    await test.step('В теле id=1 и userId=1', async (step) => {
      const body = await response.json();
      await step.attach('тело-ответа', { body: JSON.stringify(body, null, 2), contentType: 'application/json' });
      expect(body).toMatchObject({ id: 1, userId: 1 });
    });
  });

  test('GET /posts/9999 returns 404 for a missing post', async () => {
    const response = await test.step('Отправляем GET /posts/9999', () => api.get('/posts/9999'));

    await test.step('Статус 404 Not Found', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('POST /posts creates a post', async () => {
    const response = await test.step('Отправляем POST /posts', () => api.post('/posts', { data: apiDataPost }));

    await test.step('Статус 201 Created', async () => {
      expect(response.status()).toBe(201);
    });

    await test.step('В ответе наши данные и новый id', async (step) => {
      const body = await response.json();
      await step.attach('тело-ответа', { body: JSON.stringify(body, null, 2), contentType: 'application/json' });
      expect(body).toMatchObject(apiDataPost);
      expect(body).toHaveProperty('id');
    });
  });

  test('PATCH /posts/1 updates the post title', async () => {
    const response = await test.step('Отправляем PATCH /posts/1', () => api.patch('/posts/1', { data: apiDataPatch }));

    await test.step('Статус 200 OK', async () => {
      expect(response.status()).toBe(200);
    });

    await test.step('Заголовок обновился', async () => {
      const body = await response.json();
      expect(body.title).toBe(apiDataPatch.title);
    });
  });

  test('DELETE /posts/1 removes the post', async () => {
    const response = await test.step('Отправляем DELETE /posts/1', () => api.delete('/posts/1'));

    await test.step('Статус 200 OK', async () => {
      expect(response.status()).toBe(200);
    });
  });
});
