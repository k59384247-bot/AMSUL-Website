import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
import { chooseOption } from './select-option';
test('highlight listing remains responsive with the shared record feed', async ({ page }) => { await responsivePage(page, '/event-highlights', 'EVENT HIGHLIGHTS', 'highlights'); });
test('highlight filters and empty-state reset use event metadata and content types', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 }); await page.goto('/event-highlights');
  await chooseOption(page, 'Content Type', 'Event Report'); await chooseOption(page, 'Category', 'Social');
  await page.getByRole('searchbox', { name: 'Search Event' }).fill('LUTH'); await page.getByRole('searchbox', { name: 'Search Event' }).press('Enter');
  await expect(page.locator('.event-highlight-card')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Search Event' }).fill('not an event'); await page.getByRole('searchbox', { name: 'Search Event' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'No highlights found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click(); await expect(page.locator('.event-highlight-card')).toHaveCount(6);
});
test('highlight pagination changes records and resets when sorted', async ({ page }) => {
  await page.goto('/event-highlights'); await chooseOption(page, 'Results per page', '3');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.event-highlight-card').first()).toHaveAttribute('data-story-id', 'highlight-4');
  await chooseOption(page, 'Sort By', 'oldest');
  await expect(page.locator('.event-highlight-card').first()).toHaveAttribute('data-story-id', 'highlight-6');
});
