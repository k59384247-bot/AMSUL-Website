import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('report hub retains the responsive design with data-driven section heights', async ({ page }) => { await responsivePage(page, '/impact-reports', 'Measuring Progress.', 'impact-reports'); });
test('report totals and category counts follow the actual fixture taxonomy', async ({ page }) => {
  await page.goto('/impact-reports');
  await expect(page.locator('.report-result-count')).toHaveText('Showing 14 published reports across 2 initiatives');
  await page.getByRole('button', { name: 'HealthWeek', exact: true }).click();
  await expect(page.locator('.report-result-count')).toHaveText('Showing 7 published reports across 1 initiative');
  await expect(page.locator('.report-grid .report-card')).toHaveCount(7);
  await page.getByRole('searchbox', { name: 'Search Report' }).fill('no report matches');
  await page.getByRole('searchbox', { name: 'Search Report' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'No reports found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.report-grid .report-card')).toHaveCount(12);
});
test('featured report carousel opens the selected record', async ({ page }) => {
  await page.goto('/impact-reports'); const carousel = page.getByRole('region', { name: 'Featured reports', exact: true });
  await carousel.getByRole('button', { name: 'Show featured reports slide 3' }).click();
  await expect(carousel.getByRole('button', { name: 'Show featured reports slide 3' })).toHaveAttribute('aria-pressed', 'true');
  await carousel.locator('.featured-report').nth(2).getByRole('link', { name: 'View Report', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Community Impact Report 3');
});
