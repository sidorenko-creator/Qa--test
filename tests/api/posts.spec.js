import { test, expect } from '@playwright/test';
import { apiDataPatch, apiDataPost } from '../../data/testdata.js';

test.describe('Posts API', { tag: '@api' }, () => {
  // Public test API can be flaky → retry failed tests twice, 15 s per test
  test.describe.configure({ retries: 2, timeout: 15_000 });

  /** @type {import('@playwright/test').APIRequestContext} */
  let api;

  // Runs once per worker: one shared HTTP client for all tests in this file
  test.beforeAll(async ({ playwright }, testInfo) => {
    api = await playwright.request.newContext({
      baseURL: testInfo.project.use.baseURL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
  });

  // Runs once per worker after the last test: close the client
  test.afterAll(async () => {
    await api.dispose();
  });

  // Runs after each test: log the result
  test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === testInfo.expectedStatus ? '✔' : '✘';
    console.log(`${icon} [${testInfo.project.name}] ${testInfo.title} — ${testInfo.status}`);
  });

  test('GET /posts/1 returns the post', async () => {
    const response = await test.step('Send GET /posts/1', () => api.get('/posts/1'));

    await test.step('Status is 200 OK', async () => {
      expect(response).toBeOK();
      expect(response.status()).toBe(200);
    });

    await test.step('Body contains id=1 and userId=1', async (step) => {
      const body = await response.json();
      await step.attach('response-body', { body: JSON.stringify(body, null, 2), contentType: 'application/json' });
      expect(body).toMatchObject({ id: 1, userId: 1 });
    });
  });

  test('GET /posts/9999 returns 404 for a missing post', async () => {
    const response = await test.step('Send GET /posts/9999', () => api.get('/posts/9999'));

    await test.step('Status is 404 Not Found', async () => {
      expect(response.status()).toBe(404);
    });
  });

  test('POST /posts creates a post', async () => {
    const response = await test.step('Send POST /posts', () => api.post('/posts', { data: apiDataPost }));

    await test.step('Status is 201 Created', async () => {
      expect(response.status()).toBe(201);
    });

    await test.step('Body echoes the data and has a new id', async (step) => {
      const body = await response.json();
      await step.attach('response-body', { body: JSON.stringify(body, null, 2), contentType: 'application/json' });
      expect(body).toMatchObject(apiDataPost);
      expect(body).toHaveProperty('id');
    });
  });

  test('PATCH /posts/1 updates the post title', async () => {
    const response = await test.step('Send PATCH /posts/1', () => api.patch('/posts/1', { data: apiDataPatch }));

    await test.step('Status is 200 OK', async () => {
      expect(response.status()).toBe(200);
    });

    await test.step('Title is updated', async () => {
      const body = await response.json();
      expect(body.title).toBe(apiDataPatch.title);
    });
  });

  test('DELETE /posts/1 removes the post', async () => {
    const response = await test.step('Send DELETE /posts/1', () => api.delete('/posts/1'));

    await test.step('Status is 200 OK', async () => {
      expect(response.status()).toBe(200);
    });
  });
});
