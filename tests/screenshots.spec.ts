import { test, expect } from '@playwright/test';

// Offline screenshot tests — no server needed. Each test renders inline HTML and
// takes a screenshot, so with screenshot/video/trace = 'on' every test produces
// image + video + trace attachments. This mirrors a client run that generates
// artifacts, so the shard -> merge -> upload flow has attachments to resolve.
for (const n of [1, 2, 3, 4, 5, 6]) {
  test(`screenshot artifact ${n}`, async ({ page }) => {
    const shade = `#${n}${n}${n}${n}${n}${n}`;
    await page.setContent(
      `<html><body style="margin:0;background:${shade};color:#fff;font-family:sans-serif">
         <h1 style="padding:48px">Artifact test ${n}</h1>
       </body></html>`
    );
    await page.screenshot({ fullPage: true });
    await expect(page.locator('h1')).toHaveText(`Artifact test ${n}`);
  });
}
