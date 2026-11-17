import { test, expect } from '@playwright/test';

// TDV2-1084 lab regression pass: another never-seen spec.
test('qa new3 - subtracts', async () => {
  expect(9 - 4).toBe(5);
});

test('qa new3 - compares', async () => {
  expect(7 > 3).toBe(true);
});
