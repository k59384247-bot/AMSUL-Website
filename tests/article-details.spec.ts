import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
const route = '/blog/dear-future-doctor-it-is-okay-to-be-undecided';
test('article detail retains its responsive design with real rich-text nodes', async ({ page }) => { await responsivePage(page, route, 'Dear Future Doctor: It Is Okay to Be Undecided', 'article-details'); });
test('article navigation follows the selected related record and shared calls to action', async ({ page }) => {
  await page.goto(route); const related = page.locator('.related-article-grid .story-card').first(); const title = await related.locator('h3').innerText(); await related.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await page.getByRole('link', { name: 'Back to Stories & Insights' }).click(); await expect(page).toHaveURL('/blog');
  await page.goto(route); await page.locator('.partnership-callout').getByRole('link', { name: 'Contact Us' }).click(); await expect(page).toHaveURL('/contact');
  expect((await page.goto('/blog/unknown-article'))?.status()).toBe(404);
});
test('articles with no supplied attachment do not invent download buttons', async ({ page }) => { await page.goto(route); await expect(page.locator('.attachment-download')).toHaveCount(0); });
