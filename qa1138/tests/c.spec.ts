import { test, expect } from '@playwright/test';
test('test c works', async () => {
  if (process.env.QA_FAIL === 'c') expect(1).toBe(2);
  expect('c').toBe('c');
});
