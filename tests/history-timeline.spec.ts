import { test, expect } from '@playwright/test';

for (const [route, width] of [['/about', 1440], ['/', 390]] as const) {
  test(`history advances on ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.clock.install();
    await page.goto(route);
    if (width === 390) {
      const timeline = page.getByRole('region', { name: 'AMSUL history timeline', exact: true });
      await timeline.scrollIntoViewIfNeeded();
      const year = timeline.locator('.is-current .milestone-year');
      const firstYear = await year.innerText();
      await page.clock.runFor(6000);
      await expect(year).not.toHaveText(firstYear);
      await expect(timeline.locator('.is-current')).toHaveCount(1);
      return;
    }
    const timeline = page.getByRole('region', { name: 'AMSUL history timeline. Scroll horizontally for more milestones.', exact: true });
    await timeline.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.clock.runFor(6000);
    const first = await timeline.evaluate(node => node.scrollLeft);
    expect(first).toBeGreaterThan(100);
    await page.clock.runFor(6000);
    expect(await timeline.evaluate(node => node.scrollLeft)).toBeGreaterThan(first + 100);
  });
}

test('history repeats without a visible jump at the loop boundary', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install();
  await page.goto('/about');
  const timeline = page.locator('.timeline-window');
  await timeline.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(1000);
  const tracks = timeline.locator('.timeline-track');
  const width = await tracks.first().evaluate(node => (node as HTMLElement).offsetWidth);
  await timeline.evaluate((node, width) => { node.scrollLeft = width - 12; }, width);
  const before = (await tracks.nth(1).locator('.milestone').first().boundingBox())!;
  await page.clock.runFor(1500);
  const after = (await tracks.first().locator('.milestone').first().boundingBox())!;
  expect(await timeline.evaluate(node => node.scrollLeft)).toBeLessThan(100);
  expect(before.x - after.x).toBeGreaterThan(25);
  expect(before.x - after.x).toBeLessThan(45);
  expect(before.y).toBe(after.y);
  await timeline.screenshot({ path: '/private/tmp/amsul-history-loop-desktop.png' });
});

test('desktop history pauses for reading and reduced motion while retaining keyboard scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install();
  await page.goto('/about');
  const timeline = page.locator('.timeline-window');
  const position = () => timeline.evaluate(node => node.scrollLeft);
  await timeline.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(3000);
  await timeline.hover();
  const hovered = await position();
  await page.clock.runFor(3000);
  expect(await position()).toBe(hovered);
  await page.mouse.move(0, 0);
  await page.clock.runFor(2000);
  expect(await position()).toBeGreaterThan(hovered + 40);
  await timeline.focus();
  const focused = await position();
  await page.clock.runFor(3000);
  expect(await position()).toBe(focused);
  await page.keyboard.press('ArrowRight');
  await expect.poll(position).toBeGreaterThan(focused);
  await timeline.evaluate(node => (node as HTMLElement).blur());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await position();
  await page.clock.runFor(5000);
  expect(await position()).toBe(reduced);
  await expect(timeline.locator('[aria-hidden="true"].timeline-track')).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(2000);
  expect(await position()).toBeGreaterThan(reduced + 40);
  await timeline.screenshot({ path: '/private/tmp/amsul-history-keyboard-desktop.png' });
});
