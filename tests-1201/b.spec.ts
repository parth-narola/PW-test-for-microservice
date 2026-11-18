import { test, expect } from '@playwright/test';
test.describe('qa1201 b', () => {
  for (let i = 1; i <= 10; i++) {
    test(`b case ${String(i).padStart(2, '0')}`, async () => {
      await new Promise((r) => setTimeout(r, 2000));
      // Shard 2's last test fails only on the first workflow attempt, so "Re-run failed jobs" re-runs one shard.
      if ('b' === 'b' && i === 10) expect(process.env.GITHUB_RUN_ATTEMPT).not.toBe('1');
    });
  }
});
