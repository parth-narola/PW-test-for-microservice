import { test, expect } from '@playwright/test';

// Scratch spec for local re-run checks: 2 fail, 2 flaky (fail first attempt), 2 pass.
test('matrix pass one', () => expect(1).toBe(1));
test('matrix pass two', () => expect(2).toBe(2));
test('matrix fail one', async () => {
  await new Promise((r) => setTimeout(r, 20_000));
  expect(1).toBe(0);
});
test('matrix fail two', async () => {
  await new Promise((r) => setTimeout(r, 20_000));
  expect(2).toBe(0);
});
test('matrix flaky one', () => expect(test.info().retry).toBeGreaterThan(0));
test('matrix flaky two', () => expect(test.info().retry).toBeGreaterThan(0));
// head moved past run #52
