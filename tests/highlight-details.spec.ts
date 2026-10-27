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

import { responsivePage } from './responsive-page';
const url = "/event-highlights/mr-miss-amsul-2025";

test('highlight details retain their responsive gallery and shared header/footer', async ({ page }) => { await responsivePage(page, url, 'Mr & Miss AMSUL 2025', 'highlight-details'); });
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

test('album links are supplied URLs and related highlights open distinct records', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByRole('link', { name: 'View All Pictures', exact: true })).toHaveAttribute('href', 'https://example.org/amsul-demo-album');
  const card = page.locator('.highlight-related-grid .past-event-card').first(); const title = await card.locator('h3').innerText(); await card.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  expect((await page.goto('/event-highlights/unknown-highlight'))?.status()).toBe(404);
});
