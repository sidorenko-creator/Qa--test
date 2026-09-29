import { test, expect } from '@playwright/test';
import { apiDataPatch, apiDataPost } from '../../data/testdata.js';

test.describe('Posts API', () => {
  test('GET /posts/1 returns post', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response).toBeOK();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      userId: 1,
    });
  });

  test('POST /posts creates a post', async ({ request }) => {
    const response = await request.post('/posts', { data: apiDataPost });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject(apiDataPost);
    expect(body).toHaveProperty('id');
  });

  test('PATCH /posts/1 updates a post title', async ({ request }) => {
    const response = await request.patch('/posts/1', {
      data: apiDataPatch,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe(apiDataPatch.title);
  });
});
