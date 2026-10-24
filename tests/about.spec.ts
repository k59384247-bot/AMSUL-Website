import { test, expect } from "@playwright/test";

test("About matches the supplied desktop section positions and remains responsive", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Six Decades");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    const state = await page.evaluate(() => ({
      width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
    }));
    expect(state.scrollWidth, `Page overflow at ${width}px`).toBeLessThanOrEqual(state.width);
    expect(state.brokenImages).toEqual([]);
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/about-${width}.png`, fullPage: true });
    if (width === 1440) {
      const sections = await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })));
      expect(sections).toEqual([
        { top: 0, height: 560 }, { top: 560, height: 564 }, { top: 1124, height: 396 },
        { top: 1520, height: 600 }, { top: 2120, height: 848 }, { top: 2968, height: 1143 },
        { top: 4111, height: 780 }, { top: 4891, height: 1372 }, { top: 6263, height: 544 }, { top: 6807, height: 440 },
      ]);
    }
  }
  expect(errors).toEqual([]);
});

test("About carousel and calls to action work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  const carousel = page.getByRole("region", { name: "Flagship initiatives", exact: true });
  await carousel.getByRole("button", { name: "Next flagship initiatives" }).click();
  await expect.poll(() => carousel.locator(".carousel-track").evaluate(node => node.scrollLeft)).toBeGreaterThan(100);
  await page.getByRole("link", { name: "Meet Our Leadership", exact: true }).click();
  await expect(page).toHaveURL(/\/leadership$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leadership Rooted in Service and Excellence");
  await page.goto("/about");
  await page.locator(".partnership-callout").getByRole("link", { name: "Partner With AMSUL", exact: true }).click();
  await expect(page).toHaveURL(/\/partnerships\/become-a-partner$/);
});

test("About timeline scrolls with the keyboard and all its internal routes resolve", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const timeline = page.getByRole("region", { name: "AMSUL history timeline. Scroll horizontally for more milestones.", exact: true });
  await timeline.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => timeline.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
});
