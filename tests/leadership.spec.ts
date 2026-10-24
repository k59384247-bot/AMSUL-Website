import { test, expect } from "@playwright/test";

test("Leadership follows Figma and fits desktop, tablets and phones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/leadership");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leadership Rooted in Service and Excellence");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(dimensions.scroll, `Overflow at ${width}px`).toBeLessThanOrEqual(dimensions.width);
    expect(dimensions.broken).toEqual([]);
    await expect(page.locator(".profile-card:visible")).toHaveCount(11);
    if (width === 1440) {
      expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
        { top: 0, height: 560 }, { top: 560, height: 704 }, { top: 1264, height: 812 }, { top: 2076, height: 1152 }, { top: 3228, height: 440 },
      ]);
      expect(await page.locator(".leadership-featured-cards .profile-card").evaluateAll(nodes => nodes.map(node => { const b = node.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }))).toEqual([
        [520,624,400,480],[944,624,400,480],[80,1464,400,452],[520,1464,400,452],[960,1464,400,452],
        [96,2276,294,384],[414,2276,294,384],[732,2276,294,384],[1050,2276,294,384],[414,2684,294,384],[732,2684,294,384],
      ]);
    }
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/leadership-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("View All reveals the exact hidden Figma groups and collapses with the keyboard", async ({ page }) => {
  await page.goto("/leadership");
  for (const [selector, count] of [[".leadership-executive", 8], [".leadership-patrons", 10]] as const) {
    const section = page.locator(selector);
    const control = section.locator(".leadership-view-all");
    await expect(section.locator(".leadership-additional")).toBeHidden();
    await control.click();
    await expect(control).toHaveAttribute("aria-expanded", "true");
    await expect(section.locator(".leadership-additional .profile-card:visible")).toHaveCount(count);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await control.press("Enter");
    await expect(section.locator(".leadership-additional")).toBeHidden();
    await expect(control).toHaveAttribute("aria-expanded", "false");
  }
  const committee = page.locator(".leadership-committees");
  await committee.getByRole("button", { name: "View All", exact: true }).click();
  await expect(committee.getByRole("status")).toHaveText("All 6 available committee heads are shown.");
});

test("profile controls report the missing biographies without fabricating details", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/leadership");
  const card = page.locator(".leadership-executive .profile-card").first();
  const profile = card.getByRole("button", { name: "View Profile", exact: true });
  await profile.click();
  await expect(card.getByRole("status")).toHaveText("Full profile content has not been provided yet.");
  await profile.press("Space");
  await expect(card.getByRole("status")).toHaveCount(0);
  await page.locator(".leadership-executive .leadership-view-all").click();
  await expect(page.locator(".leadership-executive .profile-card:visible")).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await expect(page.locator(".leadership-patrons").getByRole("button", { name: "View Profile", exact: true })).toHaveCount(0);
});

test("existing header, footer and About Us links open the implemented Leadership page", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: "Meet Our Leadership", exact: true }).click();
  await expect(page).toHaveURL(/\/leadership$/);
  await expect(page.getByText("Page coming soon", { exact: true })).toHaveCount(0);
  await page.goto("/");
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Leadership", exact: true }).click();
  await expect(page).toHaveURL(/\/leadership$/);
  await page.goto("/about");
  await page.locator(".nav-group").first().locator("summary").click();
  await page.locator(".main-navigation").getByRole("link", { name: "Leadership", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leadership Rooted in Service and Excellence");
});
