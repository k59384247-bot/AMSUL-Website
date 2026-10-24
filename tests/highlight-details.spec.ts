import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

// Playwright rewrites imported JSX into test descriptors; render these server components with the app's React JSX transform.
function loadComponent<T>(path: string): T {
  const source = readFileSync(resolve(__dirname, path), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", compiled)(createRequire(__filename), module, module.exports);
  return module.exports as T;
}
const { PictureGallery } = loadComponent<typeof import("../src/components/picture-gallery")>("../src/components/picture-gallery.tsx");
const { Sponsors } = loadComponent<typeof import("../src/components/sponsors")>("../src/components/sponsors.tsx");

const url = "/event-highlights/mr-miss-amsul-2025";

test("highlight details follow the frame with the agreed shared header/footer and responsive layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("MR & MISS AMSUL 2025");
    await expect(page.locator(".hero-thumbnails")).toHaveCount(0);
    await expect(page.locator(".picture-card")).toHaveCount(5);
    await expect(page.locator(".event-sponsor")).toHaveCount(6);
    await expect(page.locator(".highlight-related-grid>.content-card")).toHaveCount(3);
    const geometry = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src) }));
    expect(geometry.scroll, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(geometry.width);
    expect(geometry.broken).toEqual([]);
    if (width === 1440) {
      expect(await page.locator("main>section,footer").evaluateAll(nodes => nodes.map(node => ({ top: (node as HTMLElement).offsetTop, height: (node as HTMLElement).offsetHeight })))).toEqual([
        { top: 112, height: 964 }, { top: 1076, height: 1456 }, { top: 2532, height: 636 }, { top: 3168, height: 440 },
      ]);
      expect(await page.locator(".picture-card").evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })))).toEqual([
        { width: 365, height: 240 }, { width: 365, height: 240 }, { width: 742, height: 320 }, { width: 365, height: 240 }, { width: 365, height: 240 },
      ]);
    }
    if (width === 1440 || width === 390) await page.screenshot({ path: `test-results/highlight-details-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("picture and sponsor lists resize for zero, single, odd and larger counts", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url);
  await page.evaluate(() => {
    for (const [id, width] of [["picture-fixture", 742], ["sponsor-fixture", 482]] as const) {
      const fixture = document.createElement("div"); fixture.id = id; fixture.style.width = `${width}px`; document.body.append(fixture);
    }
  });
  const image = "/assets/da6d1683-9802-4583-b0c9-76a2b3d46eef.png";
  for (const count of [0, 1, 2, 3, 4, 5, 8, 11]) {
    const pictures = Array.from({ length: count }, (_, i) => ({ id: `picture-${i}`, src: image, alt: `Event photograph ${i + 1}` }));
    const markup = renderToStaticMarkup(createElement(PictureGallery, { pictures }));
    await page.locator("#picture-fixture").evaluate((node, html) => { node.innerHTML = html; }, markup);
    await expect(page.locator("#picture-fixture .picture-card")).toHaveCount(count);
    await expect(page.locator("#picture-fixture img")).toHaveCount(count);
    await expect(page.locator("#picture-fixture h2")).toHaveCount(count ? 1 : 0);
    const layout = await page.locator("#picture-fixture").evaluate(node => ({ height: node.getBoundingClientRect().height, cards: [...node.querySelectorAll(".picture-card")].map(card => ({ top: card.getBoundingClientRect().top, bottom: card.getBoundingClientRect().bottom, width: card.getBoundingClientRect().width, height: card.getBoundingClientRect().height })) }));
    if (!count) expect(layout.height).toBe(0);
    else {
      expect(layout.height).toBe(layout.cards.at(-1)!.bottom - layout.cards[0].top + 36);
      if (count === 1) expect(layout.cards[0]).toMatchObject({ width: 742, height: 320 });
      if (count === 5) expect(layout.height).toBe(860);
      if (count === 8) expect(layout.height).toBe(1444);
    }
  }
  for (const count of [0, 1, 2, 4, 6, 9, 10]) {
    const sponsors = Array.from({ length: count }, (_, i) => ({ id: `sponsor-${i}`, name: `Sponsor ${i + 1}`, logo: image }));
    const markup = renderToStaticMarkup(createElement(Sponsors, { sponsors, id: "fixture-sponsors-title" }));
    await page.locator("#sponsor-fixture").evaluate((node, html) => { node.innerHTML = html; }, markup);
    await expect(page.locator("#sponsor-fixture .event-sponsor")).toHaveCount(count);
    await expect(page.locator("#sponsor-fixture h2")).toHaveCount(count ? 1 : 0);
    const expectedHeight = count ? 36 + Math.ceil(count / 3) * 120 + (Math.ceil(count / 3) - 1) * 4 : 0;
    expect(await page.locator("#sponsor-fixture").evaluate(node => node.getBoundingClientRect().height)).toBe(expectedHeight);
  }
});

test("highlight listing, back, album feedback and related links work", async ({ page }) => {
  await page.goto("/event-highlights");
  await page.locator(".highlights-grid .event-highlight-card").first().click();
  await expect(page).toHaveURL(new RegExp(`${url}$`));
  const map = page.getByRole("link", { name: /Find Old Great Hall, LUTH/ });
  await expect(map).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=Old%20Great%20Hall%2C%20LUTH");
  await expect(map).toHaveAttribute("target", "_blank");
  await page.getByRole("button", { name: "View All Pictures", exact: true }).click();
  await expect(page.locator(".event-pictures-action").getByRole("status")).toHaveText("The event photo album link has not been provided yet. Please check back later.");
  await expect(page).toHaveURL(new RegExp(`${url}$`));
  await page.getByRole("link", { name: "Back to Event Highlights", exact: true }).click();
  await expect(page).toHaveURL(/\/event-highlights$/);
  await page.goto(url);
  await page.locator(".highlight-related-grid .past-event-card").nth(1).click();
  await expect(page).toHaveURL(/\/event-highlights\/business-summit-2025$/);
  await expect(page.getByText("Page coming soon", { exact: true })).toBeVisible();
  await page.goto(url);
  await page.locator(".highlight-related-grid .report-card").click();
  await expect(page).toHaveURL(/\/impact-reports\/amsul-health-week-2025$/);
  expect((await page.goto("/event-highlights/unknown-highlight"))?.status()).toBe(404);
});
