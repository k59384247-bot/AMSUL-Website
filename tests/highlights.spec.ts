import { test, expect } from "@playwright/test";
import { chooseOption } from "./select-option";

test("highlights match Figma's desktop sections and fit tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/event-highlights");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("EVENT HIGHLIGHTS");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".highlights-grid .event-highlight-card")).toHaveCount(6);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440) {
      expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
        { top: 0, height: 560 }, { top: 560, height: 1356 }, { top: 1916, height: 440 },
      ]);
      expect(await page.locator(".highlights-grid .event-highlight-card").first().evaluate(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))).toEqual({ width: 400, height: 424 });
    }
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/highlights-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("highlight search and type combine with categories and empty-state reset", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/event-highlights");
  const cards = page.locator(".highlights-grid .event-highlight-card");
  await chooseOption(page, "Content Type", "Event");
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).fill("  LUTH  ");
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).press("Enter");
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole("status")).toHaveText("6 highlights found");
  await chooseOption(page, "Category", "HealthWeek");
  await expect(cards).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No highlights found", exact: true })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Category", exact: true })).toHaveText("HealthWeek");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole("combobox", { name: "Content Type", exact: true })).toHaveText("All Types");
  await expect(page.getByRole("searchbox", { name: "Search Event", exact: true })).toHaveValue("");
  for (const index of [0, 1]) {
    await page.getByRole("combobox", { name: "Category", exact: true }).click();
    await page.getByRole("option", { name: "AMSUL Games", exact: true }).nth(index).click();
    await expect(page.getByRole("combobox", { name: "Category", exact: true })).toHaveText("AMSUL Games");
    await expect(cards).toHaveCount(0);
  }
  await chooseOption(page, "Category", "All categories");
  await page.getByRole("searchbox", { name: "Search Event", exact: true }).fill("not an event");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("0 highlights found");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(cards).toHaveCount(6);
});

test("highlight pagination uses the six samples and resets for sort and filters", async ({ page }) => {
  await page.goto("/event-highlights");
  const pagination = page.getByRole("navigation", { name: "Highlight results pagination", exact: true });
  const cards = page.locator(".highlights-grid .event-highlight-card");
  await expect(page.getByRole("combobox", { name: "Results per page", exact: true })).toHaveText("15");
  await expect(pagination.getByRole("button", { name: "Page 2", exact: true })).toHaveCount(0);
  await chooseOption(page, "Results per page", "3");
  await pagination.getByRole("button", { name: "Next", exact: true }).click();
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toHaveAttribute("data-story-id", "event-highlight-4");
  await expect(page.getByRole("region", { name: "Event highlights", exact: true })).toBeFocused();
  await expect(pagination.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await chooseOption(page, "Sort By", "oldest");
  await expect(cards.first()).toHaveAttribute("data-story-id", "event-highlight-1");
  await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  await pagination.getByRole("button", { name: "Page 2", exact: true }).click();
  await page.getByRole("button", { name: "Election", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No highlights found", exact: true })).toBeVisible();
  await expect(pagination.getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
});

test("event listing, highlight cards and footer navigation reach their pages", async ({ page }) => {
  await page.goto("/programs-events");
  await page.getByRole("link", { name: "View All", exact: true }).click();
  await expect(page).toHaveURL(/\/event-highlights$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("EVENT HIGHLIGHTS");
  await page.locator(".highlights-grid .event-highlight-card").first().click();
  await expect(page).toHaveURL(/\/event-highlights\/mr-miss-amsul-2025$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MR & MISS AMSUL 2025");
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Event Highlights", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("EVENT HIGHLIGHTS");
  expect((await page.goto("/event-highlights/unknown-highlight"))?.status()).toBe(404);
});
