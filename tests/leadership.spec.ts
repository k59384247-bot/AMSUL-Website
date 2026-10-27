import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('leadership keeps its responsive layout with assigned fixture members', async ({ page }) => { await responsivePage(page, '/leadership', 'Leadership Rooted in Service and Excellence', 'leadership'); });
test('featured groups expand/collapse their additional records with mouse and keyboard', async ({ page }) => {
  await page.goto('/leadership');
  for (const [selector, count] of [['.leadership-executive', 2], ['.leadership-patrons', 1]] as const) {
    const section = page.locator(selector); const control = section.locator('.leadership-view-all');
    await expect(section.locator('.leadership-additional')).toBeHidden(); await control.click();
    await expect(section.locator('.leadership-additional .profile-card:visible')).toHaveCount(count);
    await control.press('Enter'); await expect(section.locator('.leadership-additional')).toBeHidden();
  }
  await expect(page.locator('.leadership-committees .leadership-view-all')).toHaveCount(0);
});
test('profiles show the selected member biography and collapse with the keyboard', async ({ page }) => {
  await page.goto('/leadership'); const card = page.locator('.leadership-executive .profile-card').first(); const button = card.getByRole('button', { name: 'View Profile' });
  await button.click(); await expect(card.getByRole('status')).toContainText('Fictional president profile');
  await button.press('Space'); await expect(card.getByRole('status')).toHaveCount(0);
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
