import { test, expect } from '@playwright/test';

// Fails on the first attempt and passes on the retry, so the run records these
// as flaky — the state the re-run sheet's flaky scope needs to be testable.
test.describe('flaky behaviour', () => {
  test('flaky - recovers on retry', async ({}, testInfo) => {
    expect(testInfo.retry).toBeGreaterThan(0);
  });

  test('flaky - also recovers on retry', async ({}, testInfo) => {
    expect(testInfo.retry).toBeGreaterThan(0);
  });
});
