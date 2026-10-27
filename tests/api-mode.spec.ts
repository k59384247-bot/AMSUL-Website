import { test, expect } from '@playwright/test';
import snapshot from '../src/fixtures/dashboard.json';
const post = { ...snapshot.feed.data.posts[0], id: 'api-story', title: 'A newly published API story', slug: 'a-new-api-only-story', contentUrl: null };
const feed = { ...snapshot.feed.data, posts: [post, ...snapshot.feed.data.posts.filter(item => item.categories.includes('impact-reports') || item.categories.includes('event-highlights'))] };

test('API mode reuses one feed across navigation and resolves an API-only detail URL', async ({ page }) => {
  let reads = 0;
  await page.route('**/api/website/feed', route => { reads++; return route.fulfill({ json: { success: true, data: feed }, headers: { 'Cache-Control': 'public, max-age=3600' } }); });
  await page.route('**/api/website/posts/api-story', route => route.fulfill({ json: { success: true, data: { record: post, body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Body from the API record.' }] }] }, media: [], sponsors: [] } } }));
  await page.goto('/');
  await expect(page.locator('[data-story-id="api-story"]')).toHaveCount(1);
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'Blog & News', exact: true }).click();
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(1);
  expect(reads).toBe(1);
  await page.locator('.blog-grid .story-card').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
  await expect(page.locator('.rich-content')).toContainText('Body from the API record.');
  expect(reads).toBe(1);
  await page.goto('/blog/a-new-api-only-story');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
  await expect(page.locator('.rich-content')).toContainText('Body from the API record.');
});
test('API failure shows a retry state without substituting fixture cards', async ({ page }) => {
  let fail = true;
  await page.route('**/api/website/feed', route => fail ? route.fulfill({ status: 503, json: { success: false, error: { code: 'OUTAGE', message: 'Unavailable' } } }) : route.fulfill({ json: { success: true, data: feed } }));
  await page.goto('/blog');
  await expect(page.locator('.data-status[role=alert]')).toContainText('Content is temporarily unavailable');
  await expect(page.locator('.story-card')).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(1);
});
