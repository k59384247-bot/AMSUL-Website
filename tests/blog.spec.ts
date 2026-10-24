import { test, expect } from "@playwright/test";
import { chooseOption } from "./select-option";

test("blog listing follows Figma's sections and fits desktop, tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/blog");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Stories AND NEWS That Inform, Inspire and Connect.");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".blog-grid .story-card")).toHaveCount(12);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/blog-${width}.png`, fullPage: true });
    if (width === 1440) expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 0, height: 560 }, { top: 560, height: 2868 }, { top: 3428, height: 440 },
    ]);
  }
  expect(errors).toEqual([]);
});

test("blog search, category and content type combine and clear an empty state", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/blog");
  const cards = page.locator(".blog-grid .story-card");
  await chooseOption(page, "Content Type", "Publication");
  await expect(cards).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await chooseOption(page, "Category", "Election");
  await expect(page.getByRole("heading", { name: "No articles found", exact: true })).toBeVisible();
  await chooseOption(page, "Content Type", "News");
  await expect(cards).toHaveCount(2);
  await chooseOption(page, "Category", "All categories");
  await chooseOption(page, "Content Type", "all");
  await page.getByRole("searchbox", { name: "Search articles", exact: true }).fill("  RESEARCH  ");
  await page.getByRole("searchbox", { name: "Search articles", exact: true }).press("Enter");
  await expect(cards).toHaveCount(2);
  await page.getByRole("searchbox", { name: "Search articles", exact: true }).fill("no matching story");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(cards).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(cards).toHaveCount(12);
  await expect(page.getByRole("status")).toHaveText("12 articles found");
});

test("blog pagination follows the twelve samples and resets when sorting or filtering", async ({ page }) => {
  await page.goto("/blog");
  const pagination = page.getByRole("navigation", { name: "Blog results pagination", exact: true });
  const cards = page.locator(".blog-grid .story-card");
  await expect(page.getByRole("combobox", { name: "Results per page" })).toHaveText("15");
  await expect(pagination.getByRole("button", { name: "Page 2", exact: true })).toHaveCount(0);
  await chooseOption(page, "Results per page", "6");
  await expect(cards).toHaveCount(6);
  await pagination.getByRole("button", { name: "Next", exact: true }).click();
  await expect(cards.first()).toHaveAttribute("data-story-id", "blog-post-7");
  await expect(pagination.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await chooseOption(page, "Sort By", "oldest");
  await expect(cards.first()).toHaveAttribute("data-story-id", "blog-post-1");
  await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "HealthWeek", exact: true }).click();
  await expect(cards).toHaveCount(1);
});

test("blog featured carousel, article destinations and navigation work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/blog");
  const carousel = page.getByRole("region", { name: "Featured articles", exact: true });
  await carousel.getByRole("button", { name: "Next featured articles", exact: true }).click();
  await expect(carousel.getByRole("button", { name: "Show featured articles slide 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await carousel.getByRole("button", { name: "Show featured articles slide 4", exact: true }).click();
  await expect(carousel.getByRole("button", { name: "Show featured articles slide 4", exact: true })).toHaveAttribute("aria-pressed", "true");
  await carousel.locator(".featured-story").last().getByRole("link", { name: "View More", exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/amsul-hosts-national-medical-conference$/);
  await expect(page.getByText("Page coming soon", { exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Blog & News", exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await page.locator(".blog-grid .story-card").first().click();
  await expect(page).toHaveURL(/\/blog\/dear-future-doctor-it-is-okay-to-be-undecided$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("DEAR FUTURE DOCTOR: IT IS OKAY TO BE UNDECIDED");
});
