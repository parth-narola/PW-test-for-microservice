import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests-1201', fullyParallel: false, retries: 0, workers: 1, timeout: 30000, reporter: [['list']] });
