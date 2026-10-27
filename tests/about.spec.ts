import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('About remains responsive with programme-fed initiatives', async ({ page }) => { await responsivePage(page, '/about', 'Six Decades', 'about'); });
test('About programme and leadership links open their actual destinations', async ({ page }) => {
  await page.goto('/about'); await page.locator('.about-initiatives .content-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AMSUL HealthWeek 2026');
  await page.goto('/about'); await page.getByRole('link', { name: 'Meet Our Leadership', exact: true }).click(); await expect(page).toHaveURL(/\/leadership$/);
});
test("About timeline scrolls with the keyboard and all its internal routes resolve", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const timeline = page.getByRole("region", { name: "AMSUL history timeline. Scroll horizontally for more milestones.", exact: true });
  await timeline.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => timeline.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
});
