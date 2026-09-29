import { test, expect } from '@playwright/test';
import { apiDataPost, apiDataPatch } from '../data/testdata.js';

test.describe('Api project', () => {
  test('Get post', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);
  });

  test('Post posts', async ({ request }) => {
    const response = await request.post('/posts', {
      data: apiDataPost,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    console.log(body);
  });

  test('Patch posts', async ({ request }) => {
   
    const response = await request.patch('/posts/1', {
      data: apiDataPatch,
      
    });

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.title).toBe('Hello AQA');
    console.log(body);
  });
});