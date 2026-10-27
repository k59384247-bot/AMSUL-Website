import { expect, type Page } from '@playwright/test';
// Content length is variable now; retain viewport/media checks rather than fixed sample-copy section offsets.
export async function responsivePage(page: Page, route: string, title: string, name: string) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route); await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
    await expect(page.locator('.hero-thumbnails')).toHaveCount(0);
    await page.locator('footer').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${route} at ${width}px`).toBe(true);
    await expect.poll(() => page.evaluate(() => [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.src))).toEqual([]);
    if ([1440, 390].includes(width)) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `test-results/${name}-${width}.png`, fullPage: true }); }
  }
  expect(errors).toEqual([]);
}
