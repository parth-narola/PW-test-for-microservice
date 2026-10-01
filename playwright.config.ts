import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Isolated retries (Playwright 1.62): failed tests retry after the suite finishes,
  // one-by-one in a single worker — separates resource flakiness from real bugs.
  retries: 2,
  retryStrategy: 'isolated',
  workers: process.env.CI ? 10 : 10,
  // HTML only in playwright-report/ (CLI finds it via playwright-report/index.html). JSON/report.json at root so HTML reporter clearing the folder doesn't delete it.
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['blob', { outputDir: 'blob-report' }],
    ['json', { outputFile: 'report.json' }],
    // Streaming reporter disabled — the shard -> merge -> `tdpw upload` flow uses the upload CLI, not streaming.
    // ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    // 'on' so every test (including passing ones) emits image + video + trace
    // attachments — the artifacts the shard -> merge -> upload flow must resolve.
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  // The browser specs drive a remote demo app; 1s/3s failed them on latency
  // rather than on behaviour, which buried the real failures.
  expect: {
    timeout: 5000,
  },
  timeout: 20000,

  projects: [
    // { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: true } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], headless: true } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'], headless: true } },
  ],

});

