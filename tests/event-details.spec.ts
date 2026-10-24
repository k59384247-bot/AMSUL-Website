import { test, expect } from "@playwright/test";
const url = "/programs-events/amsul-business-summit-2026";

test("Event Details matches the frame and fits desktop, tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AMSUL BUSINESS SUMMIT 2026");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".event-sponsor")).toHaveCount(6);
    await expect(page.locator(".event-registration")).toHaveCount(2);
    await expect(page.locator(".event-related .event-card")).toHaveCount(2);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440) expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 112, height: 964 }, { top: 1076, height: 1156 }, { top: 2232, height: 592 }, { top: 2824, height: 440 },
    ]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/event-details-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("registration validates locally and never claims or sends a registration", async ({ page }) => {
  await page.goto(url);
  const requests: string[] = [];
  page.on("request", request => { if (request.method() === "POST") requests.push(request.url()); });
  const form = page.locator('[data-registration="form"]');
  const button = form.getByRole("button", { name: "Register", exact: true });
  await button.click();
  await expect(form.getByRole("status")).toHaveCount(0);
  await form.getByLabel("Name", { exact: true }).fill("   ");
  await form.getByLabel("Email Address", { exact: true }).fill("invalid");
  await form.getByLabel("Phone Number", { exact: true }).fill("abcdefg");
  expect(await form.locator("form").evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(false);
  await form.getByLabel("Name", { exact: true }).fill("John Doe");
  await form.getByLabel("Email Address", { exact: true }).fill("john@example.com");
  await form.getByLabel("Phone Number", { exact: true }).fill("+2348000000000");
  expect(await form.locator("form").evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(true);
  await form.getByLabel("Name", { exact: true }).fill("   ");
  expect(await form.locator("form").evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(false);
  await form.getByLabel("Name", { exact: true }).fill("John Doe");
  await form.getByLabel("Phone Number", { exact: true }).fill("abcdefg");
  expect(await form.locator("form").evaluate((node: HTMLFormElement) => node.checkValidity())).toBe(false);
  await form.getByLabel("Phone Number", { exact: true }).fill("+2348000000000");
  await button.click();
  await expect(form.getByRole("status")).toHaveText("Registration is not connected yet. Your details have not been sent or saved.");
  await form.getByLabel("Name", { exact: true }).fill("Jane Doe");
  await expect(form.getByRole("status")).toHaveCount(0);
  const external = page.locator('[data-registration="external"]');
  await external.getByRole("button", { name: "Register", exact: true }).click();
  await expect(external.getByRole("status")).toContainText("external registration link has not been provided");
  await expect(page).toHaveURL(new RegExp(`${url}$`));
  expect(requests).toEqual([]);
});

test("listing, back, location and related event links resolve correctly", async ({ page }) => {
  await page.goto("/programs-events");
  await page.locator(".event-listing-grid .event-card").first().click();
  await expect(page).toHaveURL(new RegExp(`${url}$`));
  const map = page.getByRole("link", { name: /Find Old Great Hall, LUTH/ });
  await expect(map).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=Old%20Great%20Hall%2C%20LUTH");
  await expect(map).toHaveAttribute("target", "_blank");
  await page.getByRole("link", { name: "Back to Programs & Events", exact: true }).click();
  await expect(page).toHaveURL(/\/programs-events$/);
  await page.goto(url);
  await page.locator(".event-related .event-card").first().click();
  await expect(page).toHaveURL(/\/programs-events\/mr-miss-amsul-2026$/);
  await expect(page.getByText("Page coming soon", { exact: true })).toBeVisible();
  await page.goto("/programs-events/amsul-healthweek-2026");
  await expect(page.getByText("Page coming soon", { exact: true })).toBeVisible();
  expect((await page.goto("/programs-events/unknown-event"))?.status()).toBe(404);
});
