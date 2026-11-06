import { test, expect } from '@playwright/test';
import { responsivePage } from './responsive-page';
test('About remains responsive with programme-fed initiatives', async ({ page }) => { await responsivePage(page, '/about', 'Six Decades', 'about'); });
test('About programme and leadership links open their actual destinations', async ({ page }) => {
  await page.goto('/about'); await page.locator('.about-initiatives .content-card').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Health Week');
  await page.goto('/about'); await page.getByRole('link', { name: 'Meet Our Leadership', exact: true }).click(); await expect(page).toHaveURL(/\/leadership$/);
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


test('About content, class carousel and Figma initiatives use local records', async ({page})=>{
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900}); await page.goto('/about');
    await expect(page.locator('.about-introduction')).toContainText('second medical student association in Nigeria');
    const stats=page.locator('.about-stat');
    await expect(stats.nth(0)).toContainText('2'); await expect(stats.nth(0)).toContainText('in Nigeria');
    await expect(stats.nth(1)).toContainText('5,000+'); await expect(stats.nth(2)).toContainText('10');
    const gallery=page.getByRole('region',{name:'AMSUL class photos',exact:true});
    const track=gallery.locator('.carousel-track');
    const slides=gallery.locator('.about-class-slide');
    await expect(slides).toHaveCount(5);
    await expect.poll(()=>track.evaluate(node=>node.scrollLeft)).toBeGreaterThan(0);
    expect(await slides.locator('img').count()).toBe(3);
    await expect(slides.filter({hasText:'Elixir'}).locator('img')).toHaveAttribute('src','/assets/about-2026/elixir.jpg');
    for(const label of ['Ad Astra','Nexus']) await expect(slides.filter({hasText:label}).locator('img')).toHaveCount(0);
    await gallery.getByRole('button',{name:'Next amsul class photos'}).click();
    await expect.poll(()=>track.evaluate(node=>node.scrollLeft)).toBeGreaterThan((await track.evaluate(node=>node.clientWidth))*1.5);
    await expect(page.locator('.activity-card')).toHaveCount(5);
    await expect(page.locator('.about-initiatives .content-card')).toHaveCount(5);
    await expect(page.getByRole('navigation',{name:'Footer navigation'}).getByRole('link',{name:'Alumni Network'})).toHaveCount(0);
  }
  for(const [title,description] of [['Health Week',"AMSUL's flagship annual programme"],['Freshers’ Week','An annual welcome and orientation programme'],["International Women's Day (IWD)",'An annual celebration'],['AMSUL Games','An annual inter-class sporting competition'],['Creative Vortex','A Medico-Creative initiative']] as const) {
    await page.goto('/about');
    const card=page.locator('.about-initiatives .content-card').filter({hasText:title}).first();
    await expect(card).toContainText(description);
    const href=await card.getAttribute('href');
    await card.click(); await expect(page).toHaveURL(new RegExp(href!+'$'));
    await expect(page.getByRole('heading',{level:1})).toHaveText(title);
    await expect(page.locator('.event-description')).toContainText(description);
    if(title!=='Health Week') await expect(page.getByRole('link',{name:/Find .* on Google Maps/})).toHaveCount(0);
  }
});

test('class carousel advances every five seconds, skips missing photos and respects reduced motion', async ({ page }) => {
  await page.clock.install();
  await page.goto('/about');
  const gallery = page.getByRole('region', { name: 'AMSUL class photos', exact: true });
  const track = gallery.locator('.carousel-track');
  const position = () => track.evaluate(node => Math.round(node.scrollLeft / (node.firstElementChild!.getBoundingClientRect().width + 24)));
  await expect.poll(position).toBe(1);
  for (const expected of [2, 4, 1]) {
    await page.clock.fastForward(5000);
    await page.clock.runFor(800);
    await expect.poll(position).toBe(expected);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.fastForward(6000);
  expect(await position()).toBe(1);
  await gallery.getByRole('button', { name: 'Next amsul class photos' }).click();
  await expect.poll(position).toBe(2);
});

test('fresh About page hydrates and rotates class photos with real timers', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/about');
  const track = page.locator('.about-class-carousel .carousel-track');
  const position = () => track.evaluate(node => Math.round(node.scrollLeft / (node.firstElementChild!.getBoundingClientRect().width + 24)));
  await expect.poll(position).toBe(1);
  await expect.poll(position, { timeout: 8000 }).toBe(2);
  await expect.poll(position, { timeout: 8000 }).toBe(4);
  await expect(page.locator('.about-class-elixir img')).toBeAttached();
  expect(errors).toEqual([]);
});
