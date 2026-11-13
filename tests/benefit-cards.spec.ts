import { test, expect } from '@playwright/test';

test('benefit titles wrap beside the top-right numbers on both pages', async ({ page }) => {
  for (const path of ['/', '/partnerships']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const headings = await page.locator('.benefit-heading').evaluateAll(nodes => nodes.map(node => {
        const title = node.querySelector('h3')!;
        const number = node.querySelector('.benefit-number')!.getBoundingClientRect();
        const box = title.getBoundingClientRect();
        const line = document.createRange();
        line.selectNodeContents(title);
        const firstLine = line.getClientRects()[0];
        return { titleLeft: box.left, titleRight: box.right, numberLeft: number.left, titleTop: firstLine.top, numberTop: number.top };
      }));
      expect(headings.length).toBeGreaterThan(0);
      for (const heading of headings) {
        expect(heading.titleLeft, `${path} at ${width}px`).toBeLessThan(heading.numberLeft);
        expect(heading.titleRight, `${path} at ${width}px`).toBeLessThan(heading.numberLeft);
        expect(Math.abs(heading.titleTop - heading.numberTop), `${path} at ${width}px`).toBeLessThan(6);
      }
    }
  }
});
