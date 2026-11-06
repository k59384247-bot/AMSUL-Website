import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('leadership keeps its responsive layout with assigned fixture members', async ({ page }) => { await responsivePage(page, '/leadership', 'Leadership Rooted in Service and Excellence', 'leadership'); });
test('executive council expands and collapses the remaining eight leaders', async ({ page }) => {
  await page.goto('/leadership');
  const section = page.locator('.leadership-executive');
  const control = section.locator('.leadership-view-all');
  await expect(section.locator('.leadership-featured-cards .profile-card')).toHaveCount(2);
  await expect(section.locator('.leadership-additional')).toBeHidden();
  await control.click();
  await expect(section.locator('.leadership-additional .profile-card:visible')).toHaveCount(8);
  await expect(section.getByRole('button', { name: 'Read Bio' })).toHaveCount(10);
  await expect(section.locator('.profile-card-trigger')).toHaveCount(0);
  await expect(control).toHaveText('View Less');
  await expect(page.locator('.leadership-patrons')).toHaveCount(0);
  await expect(page.locator('.leadership-committees .profile-card')).toHaveCount(4);
  await control.press('Enter');
  await expect(section.locator('.leadership-additional')).toBeHidden();
});
test('executive buttons follow the design and Read Bio opens the profile', async ({ page }) => {
  await page.goto('/leadership');
  const card = page.locator('.leadership-executive .profile-card').first();
  const button = card.getByRole('button', { name: 'Read Bio' });
  const before = await card.boundingBox();
  await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
  await card.locator('.profile-portrait').click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(card.getByRole('link', { name: 'Adeleke Adedeji Fathy on LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/adeleke-adedeji-604077130');
  await button.click();
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Full profile content has not been provided yet.');
  expect(await modal.evaluate(node => node.matches(':modal'))).toBe(true);
  expect((await card.boundingBox())!.height).toBe(before!.height);
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(button).toBeFocused();
  await button.click();
  await modal.getByRole('button', { name: 'Close profile' }).click();
  await expect(modal).toBeHidden();
  await expect(button).toBeFocused();
});
test("existing header, footer and About Us links open the implemented Leadership page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: "Meet Our Leadership", exact: true }).click();
  await expect(page).toHaveURL(/\/leadership$/);
  await expect(page.getByText("Page coming soon", { exact: true })).toHaveCount(0);
  await page.goto("/");
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Leadership", exact: true }).click();
  await expect(page).toHaveURL(/\/leadership$/);
  await page.goto("/about");
  await page.locator(".nav-group").first().locator("summary").click();
  await page.locator(".main-navigation").getByRole("link", { name: "Leadership", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leadership Rooted in Service and Excellence");
});


test('committee cards have matching dimensions and open profiles across screen sizes', async ({ page }) => {
  for (const width of [1440, 1024, 700, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/leadership');
    const cards = page.locator('.leadership-committees .profile-card');
    await expect(cards).toHaveCount(4);
    const dimensions = await cards.evaluateAll(nodes => nodes.map(node => { const box = node.getBoundingClientRect(); return { width: box.width, height: box.height }; }));
    for (const size of dimensions) { expect(size.width).toBeCloseTo(dimensions[0].width, 1); expect(size.height).toBeCloseTo(dimensions[0].height, 1); }
    await expect(page.getByRole('button', { name: 'View Profile', exact: true })).toHaveCount(0);
    const trigger = cards.first().locator('.profile-card-trigger');
    await trigger.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
    await trigger.click({ position: { x: 30, y: 30 } });
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close profile' }).click();
  }
});
