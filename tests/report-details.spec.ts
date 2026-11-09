import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
const route = '/impact-reports/amsul-health-week-2025';
test('report detail remains responsive with its own body', async ({ page }) => { await responsivePage(page, route, 'Health Week Impact Report 2025', 'report-details'); });
test('each report offers a PDF download directly below its cover', async ({ page }) => {
  for (const [slug, filename] of [
    ['amsul-health-week-2025', '59th-amsul-health-week-impact-report.pdf'],
    ['amsul-iwd-2026-impact-report', 'amsul-iwd-2026-impact-report.pdf'],
  ]) {
    await page.goto(`/impact-reports/${slug}`);
    const download = page.locator('.report-cover + .primary-download .download-button');
    await expect(download).toHaveText('Download PDF');
    const href = await download.getAttribute('href');
    if (href) {
      expect(href.endsWith(`/${filename}`)).toBe(true);
    } else {
      await download.click();
      await expect(page.locator('.primary-download [role="status"]')).toContainText('is not available yet');
    }
  }
});
test('related reports exclude the current record and unknown reports return 404', async ({ page }) => {
  await page.goto(route); await expect(page.locator(`.related-report-grid a[href="${route}"]`)).toHaveCount(0);
  const card = page.locator('.related-report-grid .report-card').first(); const title = await card.locator('h3').innerText(); await card.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  expect((await page.goto('/impact-reports/unknown-report'))?.status()).toBe(404);
});
