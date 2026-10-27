import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
const url = '/programs-events/amsul-business-summit-2026';
test('event detail keeps its responsive layout and shows one registration method', async ({ page }) => { await responsivePage(page, url, 'AMSUL Business Summit 2026', 'event-details'); });
test('local event registration validates inputs and does not send or claim a registration', async ({ page }) => {
  const writes: string[] = []; page.on('request', request => { if (request.method() === 'POST') writes.push(request.url()); });
  await page.goto(url); const form = page.locator('.event-registration form');
  await form.getByRole('button', { name: 'Register', exact: true }).click();
  await expect(form.getByRole('status')).toHaveCount(0);
  await form.getByLabel('Name', { exact: true }).fill('Demo visitor');
  await form.getByLabel('Email Address').fill('demo@example.com');
  await form.getByLabel('Phone Number').fill('+2348000000000');
  await form.getByRole('button', { name: 'Register', exact: true }).click();
  await expect(form.getByRole('status')).toContainText('Your details have not been sent or saved'); expect(writes).toEqual([]);
});
test('event map and related records use the same event metadata as the listing', async ({ page }) => {
  await page.goto(url); await expect(page.getByRole('link', { name: /Find Old Great Hall, LUTH/ })).toHaveAttribute('target', '_blank');
  const card = page.locator('.event-related-grid .event-card').first(); const title = await card.locator('h3').innerText(); await card.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
});
