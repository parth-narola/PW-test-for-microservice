import { test as setup, expect } from '@playwright/test';
setup('sign in once', async ({}, info) => {
  if (process.env.QA_SETUP_FAIL === '1') expect(1).toBe(2);
  if (process.env.QA_SETUP_FLAKY === '1' && info.retry === 0) expect('flaky-first-try').toBe('ok');
  expect(true).toBe(true);
});
