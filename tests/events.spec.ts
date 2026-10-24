import { test, expect } from "@playwright/test";
import { chooseOption } from "./select-option";

test("event listing matches the desktop sections and fits desktop, tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/programs-events");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Experiences That Build Leaders.");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".event-listing-grid .event-card")).toHaveCount(4);
    await expect(page.locator(".event-highlight-card")).toHaveCount(3);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/events-${width}.png`, fullPage: true });
    if (width === 1440) expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 0, height: 560 }, { top: 560, height: 608 }, { top: 1168, height: 896 }, { top: 2064, height: 1252 }, { top: 3316, height: 728 }, { top: 4044, height: 440 },
    ]);
  }
  expect(errors).toEqual([]);
});

test("event type, search, pagination and sorting work together", async ({ page }) => {
  await page.goto("/programs-events");
  const cards = page.locator(".event-listing-grid .event-card");
  const pagination = page.getByRole("navigation", { name: "Event results pagination", exact: true });
  await page.getByRole("button", { name: "Programme Events", exact: true }).click();
  await expect(cards).toHaveCount(2);
  await page.getByRole("button", { name: "All Events", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).fill(" ENTREPRENEURSHIP ");
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).press("Enter");
  await expect(cards).toHaveCount(3);
  await page.getByRole("button", { name: "Programme Events", exact: true }).click();
  await expect(cards).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).fill("no matching event");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No events found", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(cards).toHaveCount(4);
  await expect(pagination.getByRole("button", { name: "Page 2", exact: true })).toHaveCount(0);
  await chooseOption(page, "Results per page", "2");
  await pagination.getByRole("button", { name: "Next", exact: true }).click();
  await expect(cards.first()).toHaveAttribute("data-event-id", "listing-event-3");
  await chooseOption(page, "Sort By", "oldest");
  await expect(cards.first()).toHaveAttribute("data-event-id", "listing-event-1");
  await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
});

test("event and programme carousels, detail links and highlight navigation work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/programs-events");
  for (const label of ["Featured events", "Upcoming programmes"]) {
    const carousel = page.getByRole("region", { name: label, exact: true });
    await carousel.getByRole("button", { name: `Next ${label.toLowerCase()}`, exact: true }).click();
    await expect(carousel.getByRole("button", { name: `Show ${label.toLowerCase()} slide 2`, exact: true })).toHaveAttribute("aria-pressed", "true");
    await carousel.getByRole("button", { name: `Show ${label.toLowerCase()} slide 4`, exact: true }).click();
    await expect(carousel.getByRole("button", { name: `Show ${label.toLowerCase()} slide 4`, exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("region", { name: "Featured events", exact: true }).getByRole("link", { name: "Event Details", exact: true }).last().click();
  await expect(page).toHaveURL(/\/programs-events\/amsul-business-summit-2026$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AMSUL BUSINESS SUMMIT 2026");
  await page.goto("/programs-events");
  await page.locator(".programme-card").first().click();
  await expect(page).toHaveURL(/\/programs-events\/amsul-healthweek-2026$/);
  await page.goto("/programs-events");
  await page.locator(".event-highlight-card").first().click();
  await expect(page).toHaveURL(/\/event-highlights\/mr-miss-amsul-2025$/);
  await page.goto("/programs-events");
  await page.getByRole("link", { name: "View All", exact: true }).click();
  await expect(page).toHaveURL(/\/event-highlights$/);
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Programs & Events", exact: true }).click();
  await expect(page).toHaveURL(/\/programs-events$/);
});
