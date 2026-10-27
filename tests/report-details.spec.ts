import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
const route = '/impact-reports/amsul-health-week-2025';
test('report detail remains responsive with its own body and downloadable fixture', async ({ page }) => { await responsivePage(page, route, 'Health Week Impact Report 2025', 'report-details'); });
test('the supplied report attachment downloads a real fictional PDF', async ({ page }) => {
  await page.goto(route); const download = page.waitForEvent('download'); await page.locator('.primary-download a').click(); const file = await download;
  expect(file.suggestedFilename()).toBe('Demonstration impact report 1.pdf'); expect(await file.failure()).toBeNull();
});
test('related reports exclude the current record and unknown reports return 404', async ({ page }) => {
  await page.goto(route); await expect(page.locator(`.related-report-grid a[href="${route}"]`)).toHaveCount(0);
  const card = page.locator('.related-report-grid .report-card').first(); const title = await card.locator('h3').innerText(); await card.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  expect((await page.goto('/impact-reports/unknown-report'))?.status()).toBe(404);
});
