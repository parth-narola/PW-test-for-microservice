import { test, expect } from '@playwright/test';

// TDV2-1084 lab QA: a spec TestDino has never seen, for "New on GitHub".
test('qa new - adds numbers', async () => {
  expect(2 + 3).toBe(5);
});

test('qa new - joins strings', async () => {
  expect(['a', 'b'].join('-')).toBe('a-b');
});
