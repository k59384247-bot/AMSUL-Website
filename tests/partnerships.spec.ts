import { test, expect } from "@playwright/test";

test("Partnership matches Figma and fits desktop, tablets and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/partnerships");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Building Partnerships That Create Lasting Impact.");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    await expect(page.locator(".impact-stat")).toHaveCount(6);
    await expect(page.locator(".benefit")).toHaveCount(5);
    await expect(page.locator(".partner-cell")).toHaveCount(12);
    await expect(page.locator(".testimonial-card")).toHaveCount(4);
    if (width === 1440) {
      expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
        { top: 0, height: 640 }, { top: 640, height: 1296 }, { top: 1936, height: 588 }, { top: 2524, height: 536 }, { top: 3060, height: 988 }, { top: 4048, height: 544 }, { top: 4592, height: 440 },
      ]);
      const cards = await page.locator(".testimonial-card").evaluateAll(nodes => nodes.map(node => { const b = node.getBoundingClientRect(); return [b.x,b.y,b.width,b.height]; }));
      expect(cards).toEqual([[80,3248,749,360],[829,3248,531,360],[80,3608,531,360],[611,3608,749,360]]);
    }
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/partnership-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("testimonial dots select supplied content with independent keyboard-operable panels", async ({ page }) => {
  await page.goto("/partnerships");
  const labels = ["Finding Story X", "Public Speaking", "Jali Advanced", "Founder X"];
  const panels = page.locator(".testimonial-card");
  for (let panelIndex = 0; panelIndex < 4; panelIndex++) {
    const panel = panels.nth(panelIndex);
    await expect(panel.locator(".testimonial-tag")).toHaveText(labels[panelIndex]);
    const buttons = panel.getByRole("button");
    for (let slide = 1; slide < 4; slide++) {
      await buttons.nth(slide).focus();
      await buttons.nth(slide).press("Enter");
      await expect(buttons.nth(slide)).toHaveAttribute("aria-pressed", "true");
      await expect(panel.locator("button[aria-pressed=true]")).toHaveCount(1);
      await expect(panel.locator(".testimonial-tag")).toHaveText(labels[(panelIndex + slide) % 4]);
      await expect(panel.locator("blockquote")).toContainText("Before Jali Africa");
    }
    await buttons.first().click();
    await expect(panel.locator(".testimonial-tag")).toHaveText(labels[panelIndex]);
  }
  await page.setViewportSize({width:320,height:900});
  await panels.first().getByRole("button").nth(2).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("brochure gives honest missing-file feedback and partnership routes resolve", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View More Details", exact: true }).click();
  await expect(page).toHaveURL(/\/partnerships$/);
  const download = page.getByRole("button", { name: "Download Partnership Brochure", exact: true });
  await download.click();
  await expect(page.locator(".brochure-download").getByRole("status")).toHaveText("The partnership brochure file has not been provided yet.");
  await page.locator(".hero-introduction").getByRole("link", { name: "Become a Partner", exact: true }).click();
  await expect(page).toHaveURL(/\/partnerships\/become-a-partner$/);
  await expect(page.getByText("Page coming soon", {exact:true})).toBeVisible();
  await page.goto("/partnerships");
  await page.locator(".partnership-benefits").getByRole("link", {name:"Become A Partner",exact:true}).click();
  await expect(page).toHaveURL(/\/partnerships\/become-a-partner$/);
  await page.goto("/partnerships");
  await page.locator(".partnership-callout").getByRole("link", {name:"Become A Partner",exact:true}).click();
  await expect(page).toHaveURL(/\/partnerships\/become-a-partner$/);
  await page.getByRole("navigation", {name:"Footer navigation",exact:true}).getByRole("link", {name:"Partnerships",exact:true}).click();
  await expect(page).toHaveURL(/\/partnerships$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText("Building Partnerships That Create Lasting Impact.");
});
