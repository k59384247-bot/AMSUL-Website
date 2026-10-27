import { test, expect } from "@playwright/test";

import { responsivePage } from './responsive-page';
test('landing page fits desktop, tablet and narrow phones with feed media', async ({ page }) => { await responsivePage(page, '/', 'Shaping Medical Leaders', 'landing'); });

test("mobile menu opens the About page and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#main-navigation summary").filter({ hasText: "About Us" }).click();
  await page.locator("#main-navigation").getByRole("link", { name: "About AMSUL", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Six Decades");
  await expect(page.getByText("Page coming soon", { exact: true })).toHaveCount(0);
  await page.locator(".site-header").getByRole("link", { name: "AMSUL home", exact: true }).click();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
});

test("carousel controls move events and the impact button reaches its section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Explore Our Impact", exact: true }).click();
  await expect(page).toHaveURL(/#impact$/);
  const carousel = page.getByRole("region", { name: "Upcoming events", exact: true });
  const track = carousel.locator(".carousel-track");
  await carousel.getByRole("button", { name: "Next upcoming events" }).click();
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(100);
  await carousel.getByRole("button", { name: "Previous upcoming events" }).click();
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeLessThan(2);
});

test("newsletter validates email and reports its unavailable service honestly", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Email address" });
  await input.fill("invalid");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  expect(await input.evaluate(node => (node as HTMLInputElement).validity.valid)).toBe(false);
  await input.fill("hello@example.com");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Your email has not been submitted.");
});

test("every internal link resolves and unknown pages return 404", async ({ page, request }) => {
  await page.goto("/");
  const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
});
