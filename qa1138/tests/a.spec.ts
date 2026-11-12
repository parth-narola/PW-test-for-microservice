import { test, expect } from '@playwright/test';
test('test a works', async () => {
  if (process.env.QA_FAIL === 'a') expect(1).toBe(2);
  expect('a').toBe('a');
});
