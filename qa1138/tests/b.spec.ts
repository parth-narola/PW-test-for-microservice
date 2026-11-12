import { test, expect } from '@playwright/test';
test('test b works', async () => {
  if (process.env.QA_FAIL === 'b') expect(1).toBe(2);
  expect('b').toBe('b');
});
