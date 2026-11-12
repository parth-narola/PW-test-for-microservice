import { test, expect } from '@playwright/test';
test('test d works', async () => {
  if (process.env.QA_FAIL === 'd') expect(1).toBe(2);
  expect('d').toBe('d');
});
