import { test, expect } from "@playwright/test";

const reportPath = "/impact-reports/amsul-health-week-2025";

test("report details follow the desktop design and remain responsive", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(reportPath);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Health Week Impact Report 2025");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".related-report-grid .report-card")).toHaveCount(3);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/report-details-${width}.png`, fullPage: true });
    if (width === 1440) {
      expect(await page.locator(".report-details-page>header,.report-details-page main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).getBoundingClientRect().top + window.scrollY, height: (node as HTMLElement).offsetHeight })))).toEqual([
        { top: 0, height: 112 }, { top: 112, height: 1136 }, { top: 1248, height: 1188 }, { top: 2436, height: 592 }, { top: 3028, height: 544 }, { top: 3572, height: 440 },
      ]);
      await page.evaluate(() => window.scrollTo(0, 800));
      await expect(page.locator(".report-details-header")).toHaveCSS("position", "sticky");
      expect((await page.locator(".report-details-header").boundingBox())?.y).toBe(0);
    }
  }
  expect(errors).toEqual([]);
});

test("all missing report downloads give honest file-specific feedback", async ({ page }) => {
  await page.goto(reportPath);
  const downloads: string[] = [];
  page.on("download", download => downloads.push(download.suggestedFilename()));
  const buttons = page.locator(".attachment-download button");
  await expect(buttons).toHaveCount(3);
  for (const button of await buttons.all()) {
    await button.click();
    await expect(button.locator("xpath=../..").getByRole("status")).toContainText("is not available yet");
  }
  expect(downloads).toEqual([]);
});

test("hub, report details, related cards and calls to action navigate correctly", async ({ page }) => {
  await page.goto("/impact-reports");
  await page.locator(".report-grid .report-card").first().click();
  await expect(page).toHaveURL(reportPath);
  await page.getByRole("link", { name: "Back to Reports", exact: true }).click();
  await expect(page).toHaveURL("/impact-reports");
  await page.goto(reportPath);
  await page.locator(".related-report-grid .report-card").last().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Health Week Impact Report 2025");
  await page.locator(".partnership-callout").getByRole("link", { name: "Become a Partner", exact: true }).click();
  await expect(page).toHaveURL("/partnerships/become-a-partner");
  await page.goto(reportPath);
  await page.locator(".partnership-callout").getByRole("link", { name: "Contact Us", exact: true }).click();
  await expect(page).toHaveURL("/contact");
  expect((await page.goto("/impact-reports/unknown-report"))?.status()).toBe(404);
});
