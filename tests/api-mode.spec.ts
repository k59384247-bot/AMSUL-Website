import { test, expect } from '@playwright/test';
import snapshot from '../src/fixtures/dashboard.json';
const post = { ...snapshot.feed.data.posts[0], id: 'api-story', title: 'A newly published API story', slug: 'a-new-api-only-story', contentUrl: null };
const feed = { ...snapshot.feed.data, posts: [post, ...snapshot.feed.data.posts.filter(item => item.categories.includes('impact-reports') || item.categories.includes('event-highlights'))] };

test.beforeEach(async ({ page }) => {
  await page.route('**/api/website/version', route => route.fulfill({ json: { success: true, data: { revision: '0' } } }));
});

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


test('no timer or focus polling; dashboard invalidation is picked up on navigation', async ({ page }) => {
  let revision = '0'; let reads = 0; let checks = 0;
  await page.clock.install();
  await page.route('**/api/website/version', route => { checks++; return route.fulfill({ json: { success: true, data: { revision } } }); });
  await page.route('**/api/website/feed', route => { reads++; return route.fulfill({ json: { success: true, data: { ...feed, posts: [{ ...post, title: revision === '0' ? post.title : 'Updated title from dashboard' }] } } }); });
  await page.goto('/');
  await expect(page.locator('[data-story-id="api-story"]')).toHaveCount(1);
  expect(reads).toBe(1); expect(checks).toBe(1);
  await page.clock.fastForward(2 * 60 * 60 * 1000);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await page.clock.runFor(100);
  expect(reads).toBe(1); expect(checks).toBe(1);
  revision = '1';
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'Blog & News', exact: true }).click();
  await expect(page.locator('.blog-grid h3')).toHaveText('Updated title from dashboard');
  expect(reads).toBe(2); expect(checks).toBe(2);
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'About AMSUL', exact: true }).click();
  await expect(page).toHaveURL(/about/);
  expect(reads).toBe(2);
});

test('long editorial copy keeps shared card slots fixed and the favicon matches the header logo', async ({ page }) => {
  const long = { ...post, id: 'long-story', title: 'An unusually long dashboard title '.repeat(40), excerpt: 'Long editorial summary '.repeat(100), author: { name: 'A very long author name '.repeat(15) } };
  await page.route('**/api/website/feed', route => route.fulfill({ json: { success: true, data: { ...feed, posts: [long, { ...post, id: 'short-story' }] } } }));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog');
    const cards = page.locator('.blog-grid .story-card'); await expect(cards).toHaveCount(2);
    const sizes = await cards.evaluateAll(nodes => nodes.map(card => {
      const h = card.querySelector('h3')!; const p = card.querySelector('.card-body>p')!;
      const image = card.querySelector('.story-image')!; const meta = card.querySelector('.story-meta')!;
      return { height: card.getBoundingClientRect().height, title: h.getBoundingClientRect().height, excerpt: p.getBoundingClientRect().height, clamp: getComputedStyle(h).webkitLineClamp, image: image.getBoundingClientRect().height, metaBottom: meta.getBoundingClientRect().bottom, bottom: card.getBoundingClientRect().bottom };
    }));
    expect(sizes[0].image).toBe(sizes[1].image); expect(sizes[0].height).toBe(sizes[1].height); expect(sizes[0].title).toBe(48); expect(sizes[0].excerpt).toBe(72); expect(sizes[0].clamp).toBe('2');
    expect(sizes[0].image).toBeGreaterThan(150); expect(sizes[0].metaBottom).toBeLessThanOrEqual(sizes[0].bottom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/card-copy-${width}.png`, fullPage: true });
  }
  const logo = await page.locator('.brand img').first().getAttribute('src');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', logo!);
});


test('shared skeletons replace loading copy on listings and details, including reduced motion', async ({ page }) => {
  let releaseFeed!: () => void; const feedGate = new Promise<void>(resolve => { releaseFeed = resolve; });
  await page.route('**/api/website/feed', async route => { await feedGate; await route.fulfill({ json: { success: true, data: feed } }); });
  await page.goto('/programs-events');
  const listing = page.locator('.content-skeleton.skeleton-events');
  await expect(listing).toBeVisible();
  await expect(listing).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status', { name: 'Loading content', exact: true })).toBeVisible();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/skeleton-events-${width}.png`, fullPage: true });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await listing.locator('.skeleton-block').first().evaluate(node => getComputedStyle(node).animationName)).toBe('none');
  releaseFeed(); await expect(listing).toHaveCount(0);
  let releaseBody!: () => void; const bodyGate = new Promise<void>(resolve => { releaseBody = resolve; });
  await page.route('**/api/website/posts/api-story', async route => { await bodyGate; await route.fulfill({ json: { success: true, data: { record: post, body: { type: 'doc', content: [] }, media: [], sponsors: [] } } }); });
  await page.goto('/blog/a-new-api-only-story');
  await expect(page.locator('.skeleton-detail')).toBeVisible();
  releaseBody(); await expect(page.locator('.skeleton-detail')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
});
