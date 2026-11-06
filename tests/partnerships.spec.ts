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
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/partnership-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("testimonials stay hidden but retain horizontal mobile scrolling when restored", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/partnerships');
  const section = page.locator('.partnership-testimonials');
  await expect(section).toBeHidden();
  await expect(page.getByRole('region', { name: 'Testimonials', exact: true })).toHaveCount(0);
  // Reveal only inside this test to exercise the layout prepared for later publication.
  await section.evaluate(node => node.removeAttribute('hidden'));
  const track = section.locator('.testimonial-grid');
  const cards = track.locator('.testimonial-card');
  await expect(cards).toHaveCount(4);
  const boxes = await cards.evaluateAll(nodes => nodes.map(node => { const b = node.getBoundingClientRect(); return {top:b.top,left:b.left}; }));
  expect(boxes.every(box => box.top === boxes[0].top)).toBe(true);
  expect(boxes[1].left).toBeGreaterThan(boxes[0].left);
  await track.evaluate(node => node.scrollLeft = 350);
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("brochure gives honest missing-file feedback and partner CTAs open the supplied form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View More Details", exact: true }).click();
  await expect(page).toHaveURL(/\/partnerships$/);
  const download = page.getByRole("button", { name: "Download Partnership Brochure", exact: true });
  await download.click();
  await expect(page.locator(".brochure-download").getByRole("status")).toHaveText("The partnership brochure file has not been provided yet.");
  const formUrl = "https://forms.gle/xVmA78Q5Hwos5DoJA";
  await expect(page.locator(".hero-introduction").getByRole("link", { name: "Become a Partner", exact: true })).toHaveAttribute("href", formUrl);
  await expect(page.locator(".partnership-benefits").getByRole("link", {name:"Become A Partner",exact:true})).toHaveAttribute("href", formUrl);
  await expect(page.locator(".partnership-callout").getByRole("link", {name:"Become A Partner",exact:true})).toHaveAttribute("href", formUrl);
  await expect(page.getByRole("link", {name:"Partner With AMSUL",exact:true}).first()).toHaveAttribute("href", formUrl);
  await page.getByRole("navigation", {name:"Footer navigation",exact:true}).getByRole("link", {name:"Partnerships",exact:true}).click();
  await expect(page).toHaveURL(/\/partnerships$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText("Building Partnerships That Create Lasting Impact.");
});
