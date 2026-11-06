import { test, expect } from "@playwright/test";

import { responsivePage } from './responsive-page';
test('landing page fits desktop, tablet and narrow phones with feed media', async ({ page }) => { await responsivePage(page, '/', 'Shaping Medical Leaders', 'landing'); });

test("mobile menu opens the About page and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#main-navigation summary").filter({ hasText: "About Us" }).click();
  await page.locator("#main-navigation").getByRole("link", { name: "About AMSUL", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Six Decades");
  await expect(page.getByText("Page coming soon", { exact: true })).toHaveCount(0);
  await page.locator(".site-header").getByRole("link", { name: "AMSUL home", exact: true }).click();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
});

test("carousel controls move events and the impact button reaches its section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await page.clock.setFixedTime(new Date("2026-11-01T00:00:00Z"));
  await page.locator('.site-header').getByRole('link', { name: 'AMSUL home', exact: true }).click();
  await page.getByRole("link", { name: "Explore Our Impact", exact: true }).click();
  await expect(page).toHaveURL(/\/impact-reports$/);
  const carousel = page.getByRole("region", { name: "Upcoming events", exact: true });
  const track = carousel.locator(".carousel-track");
  await carousel.getByRole("button", { name: "Next upcoming events" }).click();
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeGreaterThan(100);
  await carousel.getByRole("button", { name: "Previous upcoming events" }).click();
  await expect.poll(() => track.evaluate(node => node.scrollLeft)).toBeLessThan(2);
});

test("footer newsletter is hidden on all shared pages", async ({ page }) => {
  for (const route of ['/', '/about', '/blog', '/leadership', '/partnerships']) {
    await page.goto(route);
    await expect(page.locator('.newsletter')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Subscribe', exact: true })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Footer navigation', exact: true })).toBeVisible();
  }
});

test("every internal link resolves and unknown pages return 404", async ({ page, request }) => {
  await page.goto("/");
  const links = await page.locator('a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
});


test('hero photos rotate every five seconds and remain manually accessible', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const chooser=page.getByRole('group',{name:'Choose a hero image'});
  const buttons=chooser.getByRole('button',{name:/Show image/});
  await expect(buttons).toHaveCount(4);
  await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','true');
  await expect(chooser).toHaveAttribute('data-autoplay','true');
  await page.clock.fastForward(5100);
  await expect(buttons.nth(1)).toHaveAttribute('aria-pressed','true');
  await buttons.nth(3).focus(); await page.keyboard.press('Enter');
  await expect(buttons.nth(3)).toHaveAttribute('aria-pressed','true');
  const slides=page.locator('.hero-slideshow-image>img');
  await expect(slides.nth(1)).toHaveClass(/is-previous/);
  await expect(slides.nth(3)).toHaveCSS('transition-duration','0.6s');
  await page.clock.fastForward(5100);
  await expect(buttons.nth(0)).toHaveAttribute('aria-pressed','true');
  await expect(chooser.getByRole('button')).toHaveCount(4);
  await expect(slides.nth(0)).toHaveClass(/is-active/);
});

test('hero respects reduced motion and mobile image controls fit the viewport', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:320,height:844});
  await page.clock.install(); await page.goto('/');
  const chooser=page.getByRole('group',{name:'Choose a hero image'});
  await expect(chooser.getByRole('button')).toHaveCount(4);
  await expect(chooser).toHaveAttribute('data-autoplay','false');
  await expect.poll(() => page.locator('.hero-slideshow-image>img').first().evaluate((node:HTMLImageElement) => node.currentSrc)).toContain('-mobile.webp');
  await expect(chooser.locator('img').first()).toHaveAttribute('src',/\-thumb\.webp$/);
  await page.clock.fastForward(11000);
  await expect(chooser.getByRole('button',{name:'Show image 1'})).toHaveAttribute('aria-pressed','true');
  await chooser.getByRole('button',{name:'Show image 3'}).click();
  await expect(chooser.getByRole('button',{name:'Show image 3'})).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('shared page hero uses a smaller losslessly encoded image on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');
  const hero = page.locator('.hero-image > img');
  await expect(hero).toHaveAttribute('srcset', /site-hero-mobile\.webp 1200w/);
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toContain('site-hero-mobile.webp');
  await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});
