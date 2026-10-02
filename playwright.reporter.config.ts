import base from './playwright.config';

// Reporter-only setup (the README's primary one): plain `npx playwright test`
// with the TestDino reporter in config and no tdpw wrapper, so system.launcher
// is reported as "playwright" and a re-run cannot be narrowed (D37).
export default {
  ...base,
  reporter: [
    ['list'] as const,
    ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }] as const,
  ],
};
