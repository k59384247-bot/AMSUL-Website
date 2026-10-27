import { test, expect } from '@playwright/test';
import snapshot from '../src/fixtures/dashboard.json';
import { chooseOption } from './select-option';

test('local fixtures make no API/storage requests and Home reuses the listing records', async ({ page }) => {
  const remote: string[] = [];
  page.on('request', request => { if (request.url().includes('/api/website/') || /firebasestorage|storage\.googleapis/.test(request.url())) remote.push(request.url()); });
  await page.goto('/');
  const report = page.locator('.report-card').first();
  expect(await report.getAttribute('data-report-id')).toBe('report-1');
  const title = await report.locator('h3').innerText();
  await report.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(page.locator('.rich-content')).toContainText('fictional');
  await page.goto('/blog');
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(12);
  await page.locator('.blog-grid .story-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(snapshot.feed.data.posts[0].title);
  expect(remote).toEqual([]);
});
test('report pagination and category filters follow distinct fixture records', async ({ page }) => {
  await page.goto('/impact-reports');
  await expect(page.locator('.report-grid .report-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Page 2', exact: true }).click();
  await expect(page.locator('.report-grid .report-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Community Outreach', exact: true }).click();
  await expect(page.locator('.report-grid .report-card')).toHaveCount(7);
  await expect(page.getByRole('button', { name: 'Page 2', exact: true })).toHaveCount(0);
});
test('blog content type filters and search map dashboard taxonomy instead of tag positions', async ({ page }) => {
  await page.goto('/blog');
  await chooseOption(page, 'Content Type', 'Publication');
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(1);
  await expect(page.locator('.blog-grid .story-card h3')).toHaveText('Understanding Neonatal Health in Nigeria');
  await page.getByRole('searchbox', { name: 'Search articles' }).fill('nonexistent');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No articles found' })).toBeVisible();
});
test('highlight details bind the correct event, ordered gallery and sponsor records', async ({ page }) => {
  await page.goto('/event-highlights/mr-miss-amsul-2025');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mr & Miss AMSUL 2025');
  await expect(page.locator('.picture-card')).toHaveCount(5);
  await expect(page.locator('.event-sponsor')).toHaveCount(3);
  await expect(page.locator('.picture-card img').first()).toHaveAttribute('alt', 'Demonstration photo 1');
  await page.goto('/event-highlights/business-summit-2025');
  await expect(page.locator('.picture-card')).toHaveCount(2);
  await expect(page.locator('.event-sponsor')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'View All Pictures' })).toHaveCount(0);
});
test('programme and event links open their own records, and related cards exclude the current event', async ({ page }) => {
  await page.goto('/programs-events');
  await expect(page.locator('.event-listing-grid .event-card')).toHaveCount(4);
  await page.locator('.programme-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AMSUL HealthWeek 2026');
  await expect(page.locator('.event-related-grid .event-card')).toHaveCount(2);
  await page.goto('/programs-events/amsul-business-summit-2026');
  await expect(page.locator('.event-registration')).toHaveCount(1);
  await expect(page.locator('.event-related-grid [data-event-id="event-1"]')).toHaveCount(0);
});
test('leadership assignments drive groups and featured/expanded records', async ({ page }) => {
  await page.goto('/leadership');
  await expect(page.locator('.leadership-executive .leadership-featured-cards .profile-card')).toHaveCount(2);
  await page.locator('.leadership-executive').getByRole('button', { name: 'View All', exact: true }).click();
  await expect(page.locator('.leadership-executive .leadership-additional .profile-card:visible')).toHaveCount(2);
  await expect(page.locator('.leadership-committees .profile-card')).toHaveCount(3);
  await expect(page.locator('.leadership-committees').getByRole('button', { name: 'View All', exact: true })).toHaveCount(0);
});
test('all fixture-driven pages fit a 320px viewport without broken media', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  for (const route of ['/', '/about', '/blog', '/impact-reports', '/programs-events', '/event-highlights', '/leadership', '/blog/dear-future-doctor-it-is-okay-to-be-undecided', '/impact-reports/amsul-health-week-2025', '/programs-events/amsul-business-summit-2026', '/event-highlights/mr-miss-amsul-2025']) {
    await page.goto(route);
    await expect(page.locator('#main-content')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), route).toBe(true);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src))).toEqual([]);
  }
});
