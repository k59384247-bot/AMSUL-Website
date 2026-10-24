import { test, expect } from "@playwright/test";
import { chooseOption } from "./select-option";

test("Impact hub matches Figma's desktop sections and fits tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/impact-reports");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Measuring Progress.");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".report-grid .report-card")).toHaveCount(12);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/impact-reports-${width}.png`, fullPage: true });
    if (width === 1440) expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 0, height: 560 }, { top: 560, height: 2612 }, { top: 3172, height: 544 }, { top: 3716, height: 440 },
    ]);
  }
  expect(errors).toEqual([]);
});

test("categories and search update report results, including the empty state", async ({ page }) => {
  await page.goto("/impact-reports");
  const count = page.locator(".report-result-count");
  await expect(count).toHaveText("Showing 24 published reports across 12 initiatives");
  await page.getByRole("button", { name: "HealthWeek", exact: true }).click();
  await expect(count).toHaveText("Showing 2 published reports across 1 initiative");
  await expect(page.locator(".report-grid .report-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All categories (24)", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search Report" }).fill("  QUIZ CLUB  ");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(count).toHaveText("Showing 2 published reports across 1 initiative");
  await page.getByRole("searchbox", { name: "Search Report" }).fill("no matching report");
  await page.getByRole("searchbox", { name: "Search Report" }).press("Enter");
  await expect(page.getByRole("heading", { name: "No reports found", exact: true })).toBeVisible();
  await expect(page.locator(".report-grid .report-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(count).toHaveText("Showing 24 published reports across 12 initiatives");
  await expect(page.locator(".report-grid .report-card")).toHaveCount(12);
});

test("pagination follows the sample records and resets after filtering", async ({ page }) => {
  await page.goto("/impact-reports");
  const pagination = page.getByRole("navigation", { name: "Report results pagination" });
  await expect(pagination.getByRole("button", { name: "Page 3", exact: true })).toHaveCount(0);
  await pagination.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".report-grid .report-card").first()).toHaveAttribute("data-report-id", "impact-report-13");
  await expect(pagination.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await chooseOption(page, "Results per page", "6");
  await expect(page.locator(".report-grid .report-card")).toHaveCount(6);
  await pagination.getByRole("button", { name: "Page 4", exact: true }).click();
  await expect(page.locator(".report-grid .report-card").first()).toHaveAttribute("data-report-id", "impact-report-19");
  await page.getByRole("button", { name: "HealthWeek", exact: true }).click();
  await expect(pagination.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(pagination.getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
});

test("featured carousel, report links and hub navigation work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/impact-reports");
  const carousel = page.getByRole("region", { name: "Featured reports", exact: true });
  await carousel.getByRole("button", { name: "Next featured reports", exact: true }).click();
  await expect.poll(() => carousel.locator(".carousel-track").evaluate(node => node.scrollLeft)).toBeGreaterThan(100);
  await expect(carousel.getByRole("button", { name: "Show featured reports slide 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await carousel.getByRole("button", { name: "Show featured reports slide 4", exact: true }).click();
  await expect(carousel.getByRole("button", { name: "Show featured reports slide 4", exact: true })).toHaveAttribute("aria-pressed", "true");
  await carousel.locator(".featured-report").nth(3).getByRole("link", { name: "View Report", exact: true }).click();
  await expect(page).toHaveURL(/\/impact-reports\/amsul-health-week-2025$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Health Week Impact Report 2025");
  await page.getByRole("navigation", { name: "Footer navigation" }).getByRole("link", { name: "Impact Reports", exact: true }).click();
  await expect(page).toHaveURL(/\/impact-reports$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Measuring Progress.");
});
