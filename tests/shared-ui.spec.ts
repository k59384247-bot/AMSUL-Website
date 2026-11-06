import { test, expect } from '@playwright/test';

test('glass navigation stays at the viewport top on listing and detail routes', async ({ page }) => {
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for (const route of ['/', '/blog', '/programs-events', '/about', '/leadership', '/partnerships']) {
      await page.goto(route);
      await page.evaluate(() => window.scrollTo({top:1100,behavior:'instant'}));
      const header = page.locator('.site-header');
      await expect(header).toHaveClass(/is-scrolled/);
      expect((await header.boundingBox())!.y).toBe(0);
      const style = await header.evaluate(node => ({position:getComputedStyle(node).position,blur:getComputedStyle(node).backdropFilter,background:getComputedStyle(node).backgroundColor}));
      expect(style.position).toBe('fixed');
      expect(style.blur).toContain('blur');
      expect(style.background).toContain('0.28');
    }
    await page.goto('/blog');
    await page.locator('.blog-grid .story-card').first().click();
    await expect(page.locator('.article-details-page')).toBeVisible();
    await expect(page.locator('.site-header')).toBeVisible();
    await page.evaluate(() => window.scrollTo({top:700,behavior:'instant'}));
    await expect.poll(async () => (await page.locator('.site-header').boundingBox())?.y).toBe(0);
    if(width === 390) {
      await page.getByRole('button',{name:'Open navigation'}).click();
      await expect(page.getByRole('navigation',{name:'Main navigation',exact:true})).toBeVisible();
      await page.keyboard.press('Escape');
    }
  }
});

test('About statistic lines slide from 10k to hovered and focused statistics', async ({ page }) => {
  await page.goto('/about');
  const stats=page.locator('.about-stat');
  const indicator=page.locator('.about-stat-indicator');
  await stats.last().scrollIntoViewIfNeeded();
  const left = async () => (await indicator.boundingBox())!.x;
  const initial = await left();
  await stats.first().hover();
  await expect.poll(left).toBeCloseTo((await stats.first().boundingBox())!.x,0);
  expect(await left()).toBeLessThan(initial);
  await stats.nth(1).hover();
  await expect.poll(left).toBeCloseTo((await stats.nth(1).boundingBox())!.x,0);
  await stats.last().focus();
  await expect.poll(left).toBeCloseTo(initial,0);
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await indicator.evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s');
});

test('mobile image, card padding and metadata open the shared content and event destinations', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-25T12:00:00Z'));
  await page.setViewportSize({width:390,height:844});
  for (const [route,selector] of [['/blog','.featured-story'],['/impact-reports','.featured-report'],['/programs-events','.featured-listing-event'],['/blog','.blog-grid .story-card'],['/programs-events','.event-card']] as const) {
    for(const area of ['image','padding']) {
      await page.goto(route);
      const card=page.locator(selector).first();
      await expect(card).toHaveAttribute('href',/^\//);
      const href=await card.getAttribute('href');
      await expect(card.locator('a')).toHaveCount(0);
      if(area === 'image') await card.locator('.card-image,.featured-content-image').first().click({position:{x:30,y:30}});
      else { const box=(await card.boundingBox())!; await card.click({position:{x:box.width/2,y:box.height-12}}); }
      await expect(page).toHaveURL(new RegExp(href!+'$'));
      await expect(page.getByRole('heading',{level:1})).toBeVisible();
    }
  }
});

test('featured post tags stay inside the bottom of the image at desktop and mobile sizes',async({page})=>{
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['/blog','/impact-reports']) {
      await page.goto(route);
      const card=page.locator('.featured-content-card').first();
      const image=(await card.locator('.featured-content-image').boundingBox())!;
      const tags=(await card.locator('.featured-content-tags').boundingBox())!;
      expect(tags.y).toBeGreaterThan(image.y+image.height/2);
      expect(tags.y+tags.height).toBeLessThanOrEqual(image.y+image.height);
      expect(tags.x).toBeGreaterThanOrEqual(image.x);
      expect(tags.x+tags.width).toBeLessThanOrEqual(image.x+image.width);
    }
  }
});
