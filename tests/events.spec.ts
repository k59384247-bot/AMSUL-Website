import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('events keep the existing responsive layout with unique events and programme content', async ({ page }) => { await responsivePage(page, '/programs-events', 'Experiences That Build Leaders.', 'events'); });
test('event search and programme filter combine without invented results', async ({ page }) => {
  await page.goto('/programs-events');
  await page.getByRole('button', { name: 'Programme Events', exact: true }).click(); await expect(page.locator('.event-listing-grid .event-card')).toHaveCount(2);
  await page.getByRole('searchbox', { name: 'Search Event' }).fill('Clinical'); await page.getByRole('searchbox', { name: 'Search Event' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'No events found' })).toBeVisible();
  await page.getByRole('button', { name: 'All Events', exact: true }).click(); await expect(page.locator('.event-listing-grid .event-card')).toHaveCount(1);
});
