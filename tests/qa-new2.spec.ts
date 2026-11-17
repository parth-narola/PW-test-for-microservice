import { test, expect } from '@playwright/test';

// TDV2-1084 lab QA: a second never-seen spec for the QA-fix pass.
test('qa new2 - multiplies', async () => {
  expect(3 * 4).toBe(12);
});
