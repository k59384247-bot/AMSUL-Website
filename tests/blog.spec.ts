import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
import { chooseOption } from './select-option';
test('blog retains the existing responsive layout with fixture content', async ({ page }) => { await responsivePage(page, '/blog', 'Stories AND NEWS', 'blog'); });
test('featured stories navigate to their own detail and exclude the current story from related cards', async ({ page }) => {
  await page.goto('/blog');
  const carousel = page.getByRole('region', { name: 'Featured articles', exact: true });
  await carousel.getByRole('button', { name: 'Show featured articles slide 4' }).click();
  await expect(carousel.getByRole('button', { name: 'Show featured articles slide 4' })).toHaveAttribute('aria-pressed', 'true');
  const card = carousel.locator('.featured-story').nth(3); const title = await card.locator('h2').innerText(); const href = await card.locator('.featured-content-link').getAttribute('href');
  await card.locator('.featured-content-link').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(page.locator(`.related-article-grid a[href="${href}"]`)).toHaveCount(0);
});
test('blog pagination uses real records and resets for sorting and filtering', async ({ page }) => {
  await page.goto('/blog'); const cards = page.locator('.blog-grid .story-card');
  await chooseOption(page, 'Results per page', '6');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(cards.first()).toHaveAttribute('data-story-id', 'post-7');
  await chooseOption(page, 'Sort By', 'oldest');
  await expect(cards.first()).toHaveAttribute('data-story-id', 'post-12');
  await page.getByRole('button', { name: 'Academic', exact: true }).click();
  await expect(cards).toHaveCount(2);
});
