import { test, expect } from "@playwright/test";

const articlePath = "/blog/dear-future-doctor-it-is-okay-to-be-undecided";
const title = "DEAR FUTURE DOCTOR: IT IS OKAY TO BE UNDECIDED";

test("article details match Figma's sections and fit desktop, tablet and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articlePath);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".related-article-grid .story-card")).toHaveCount(3);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/article-details-${width}.png`, fullPage: true });
    if (width === 1440) expect(await page.locator(".article-details-page>header,.article-details-page main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).getBoundingClientRect().top + window.scrollY, height: (node as HTMLElement).offsetHeight })))).toEqual([
      { top: 0, height: 112 }, { top: 112, height: 1064 }, { top: 1176, height: 1496 }, { top: 2672, height: 656 }, { top: 3328, height: 544 }, { top: 3872, height: 440 },
    ]);
  }
  expect(errors).toEqual([]);
});

test("article sample links, back navigation, related cards and partnerships work", async ({ page }) => {
  await page.goto("/");
  await page.locator(".stories-section .story-card").first().click();
  await expect(page).toHaveURL(articlePath);
  await page.getByRole("link", { name: "Back to Stories & Insights", exact: true }).click();
  await expect(page).toHaveURL("/blog");
  await page.locator(".blog-grid .story-card").first().click();
  await expect(page).toHaveURL(articlePath);
  await page.getByRole("link", { name: "Back to Stories & Insights", exact: true }).click();
  await expect(page).toHaveURL("/blog");
  await page.goto(articlePath);
  await page.locator(".related-article-grid .story-card").last().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await page.goto(articlePath);
  await page.locator(".partnership-callout").getByRole("link", { name: "Become a Partner", exact: true }).click();
  await expect(page).toHaveURL("/partnerships/become-a-partner");
  await page.goto(articlePath);
  await page.locator(".partnership-callout").getByRole("link", { name: "Contact Us", exact: true }).click();
  await expect(page).toHaveURL("/contact");
  await page.goto("/blog/amsul-hosts-national-medical-conference");
  await expect(page.getByText("Page coming soon", { exact: true })).toBeVisible();
  expect((await page.goto("/blog/unknown-article"))?.status()).toBe(404);
});

test("article attachment buttons give honest missing-file feedback", async ({ page }) => {
  await page.goto(articlePath);
  const downloads: string[] = [];
  page.on("download", download => downloads.push(download.suggestedFilename()));
  const attachments = page.locator(".attachment-download");
  await expect(attachments).toHaveCount(2);
  for (const attachment of await attachments.all()) {
    await attachment.getByRole("button").click();
    await expect(attachment.getByRole("status")).toContainText("is not available yet");
  }
  expect(downloads).toEqual([]);
});
