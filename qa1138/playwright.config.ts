import { defineConfig } from '@playwright/test';
const teardown = process.env.QA_TEARDOWN === '1';
export default defineConfig({
  testDir: 'tests', workers: 1, fullyParallel: true,
  retries: Number(process.env.QA_RETRIES ?? 0),
  reporter: [['list'], ['@testdino/playwright', {}]],
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, ...(teardown ? { teardown: 'cleanup' } : {}) },
    ...(teardown ? [{ name: 'cleanup', testMatch: /cleanup\.teardown\.ts/ }] : []),
    { name: 'app', testMatch: /.*\.spec\.ts/, dependencies: ['setup'] },
  ],
});
