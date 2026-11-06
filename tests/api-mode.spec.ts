import { test, expect } from '@playwright/test';
import snapshot from '../src/fixtures/dashboard.json';
const post = { ...snapshot.feed.data.posts[0], id: 'api-story', title: 'A newly published API story', slug: 'a-new-api-only-story', contentUrl: null };
const feed = { ...snapshot.feed.data, posts: [post, ...snapshot.feed.data.posts.filter(item => item.categories.includes('impact-reports') || item.categories.includes('event-highlights'))] };

test.beforeEach(async ({ page }) => {
  await page.route('**/api/website/version', route => route.fulfill({ json: { success: true, data: { revision: '0' } } }));
});

test('API mode reuses one feed across navigation and resolves an API-only detail URL', async ({ page }) => {
  let reads = 0;
  await page.route('**/api/website/feed', route => { reads++; return route.fulfill({ json: { success: true, data: feed }, headers: { 'Cache-Control': 'public, max-age=3600' } }); });
  await page.route('**/api/website/posts/api-story', route => route.fulfill({ json: { success: true, data: { record: post, body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Body from the API record.' }] }] }, media: [], sponsors: [] } } }));
  await page.goto('/');
  await expect(page.locator('[data-story-id="api-story"]')).toHaveCount(1);
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'Blog & News', exact: true }).click();
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(1);
  expect(reads).toBe(1);
  await page.locator('.blog-grid .story-card').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
  await expect(page.locator('.rich-content')).toContainText('Body from the API record.');
  expect(reads).toBe(1);
  await page.goto('/blog/a-new-api-only-story');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
  await expect(page.locator('.rich-content')).toContainText('Body from the API record.');
});
test('API failure shows a retry state without substituting fixture cards', async ({ page }) => {
  let fail = true;
  const diagnostics: string[] = [];
  page.on('console', message => { if (message.type() === 'error') diagnostics.push(message.text()); });
  await page.route('**/api/website/feed', route => fail ? route.fulfill({ status: 503, json: { success: false, error: { code: 'OUTAGE', message: 'Unavailable' } } }) : route.fulfill({ json: { success: true, data: feed } }));
  await page.goto('/blog');
  await expect(page.locator('.data-status[role=alert]')).toContainText('Content is temporarily unavailable');
  await expect(page.locator('.story-card')).toHaveCount(0);
  expect(diagnostics.some(message => message.includes('Website data request failed') && message.includes('/api/website/feed') && message.includes('OUTAGE') && message.includes('503'))).toBe(true);
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.blog-grid .story-card')).toHaveCount(1);
});


test('no timer or focus polling; dashboard invalidation is picked up on navigation', async ({ page }) => {
  let revision = '0'; let reads = 0; let checks = 0;
  await page.clock.install();
  await page.route('**/api/website/version', route => { checks++; return route.fulfill({ json: { success: true, data: { revision } } }); });
  await page.route('**/api/website/feed', route => { reads++; return route.fulfill({ json: { success: true, data: { ...feed, posts: [{ ...post, title: revision === '0' ? post.title : 'Updated title from dashboard' }] } } }); });
  await page.goto('/');
  await expect(page.locator('[data-story-id="api-story"]')).toHaveCount(1);
  expect(reads).toBe(1); expect(checks).toBe(1);
  await page.clock.fastForward(2 * 60 * 60 * 1000);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await page.clock.runFor(100);
  expect(reads).toBe(1); expect(checks).toBe(1);
  revision = '1';
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'Blog & News', exact: true }).click();
  await expect(page.locator('.blog-grid h3')).toHaveText('Updated title from dashboard');
  expect(reads).toBe(2); expect(checks).toBe(2);
  await page.getByRole('navigation', { name: 'Footer navigation', exact: true }).getByRole('link', { name: 'About AMSUL', exact: true }).click();
  await expect(page).toHaveURL(/about/);
  expect(reads).toBe(2);
});

test('long editorial copy keeps shared card slots fixed and the favicon matches the header logo', async ({ page }) => {
  const long = { ...post, id: 'long-story', title: 'An unusually long dashboard title '.repeat(40), excerpt: 'Long editorial summary '.repeat(100), author: { name: 'A very long author name '.repeat(15) } };
  await page.route('**/api/website/feed', route => route.fulfill({ json: { success: true, data: { ...feed, posts: [long, { ...post, id: 'short-story' }] } } }));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog');
    const cards = page.locator('.blog-grid .story-card'); await expect(cards).toHaveCount(2);
    const sizes = await cards.evaluateAll(nodes => nodes.map(card => {
      const h = card.querySelector('h3')!; const p = card.querySelector('.card-body>p')!;
      const image = card.querySelector('.story-image')!; const meta = card.querySelector('.story-meta')!;
      return { height: card.getBoundingClientRect().height, title: h.getBoundingClientRect().height, excerpt: p.getBoundingClientRect().height, clamp: getComputedStyle(h).webkitLineClamp, image: image.getBoundingClientRect().height, metaBottom: meta.getBoundingClientRect().bottom, bottom: card.getBoundingClientRect().bottom };
    }));
    expect(sizes[0].image).toBe(sizes[1].image); expect(sizes[0].height).toBe(sizes[1].height); expect(sizes[0].title).toBe(48); expect(sizes[0].excerpt).toBe(72); expect(sizes[0].clamp).toBe('2');
    expect(sizes[0].image).toBeGreaterThan(150); expect(sizes[0].metaBottom).toBeLessThanOrEqual(sizes[0].bottom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/card-copy-${width}.png`, fullPage: true });
  }
  const logo = await page.locator('.brand img').first().getAttribute('src');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', logo!);
});


test('shared skeletons replace loading copy on listings and details, including reduced motion', async ({ page }) => {
  let releaseFeed!: () => void; const feedGate = new Promise<void>(resolve => { releaseFeed = resolve; });
  await page.route('**/api/website/feed', async route => { await feedGate; await route.fulfill({ json: { success: true, data: feed } }); });
  await page.goto('/programs-events');
  const listing = page.locator('.content-skeleton.skeleton-events');
  await expect(listing).toBeVisible();
  await expect(listing).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status', { name: 'Loading content', exact: true })).toBeVisible();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/skeleton-events-${width}.png`, fullPage: true });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await listing.locator('.skeleton-block').first().evaluate(node => getComputedStyle(node).animationName)).toBe('none');
  releaseFeed(); await expect(listing).toHaveCount(0);
  let releaseBody!: () => void; const bodyGate = new Promise<void>(resolve => { releaseBody = resolve; });
  await page.route('**/api/website/posts/api-story', async route => { await bodyGate; await route.fulfill({ json: { success: true, data: { record: post, body: { type: 'doc', content: [] }, media: [], sponsors: [] } } }); });
  await page.goto('/blog/a-new-api-only-story');
  await expect(page.locator('.skeleton-detail')).toBeVisible();
  releaseBody(); await expect(page.locator('.skeleton-detail')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
});


test('long dashboard biographies scroll inside the profile modal on desktop and mobile', async ({ page }) => {
  const biography = 'A detailed record of service and leadership. '.repeat(400) + 'End of profile.';
  const executives = [{ ...snapshot.feed.data.executives[0], bio: biography, imageUrl: snapshot.feed.data.posts[0].coverImageUrl }];
  await page.route('**/api/website/feed', route => route.fulfill({json:{success:true,data:{...feed,executives}}}));
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:844});
    await page.goto('/leadership');
    const button=page.getByRole('button',{name:'Read Bio'}).first();
    await button.click();
    const modal=page.getByRole('dialog');
    await expect(modal).toBeVisible();
    const box=(await modal.boundingBox())!;
    expect(box.height).toBeLessThan(844);
    expect(box.width).toBeLessThan(width);
    const scroll=modal.locator('.profile-bio-scroll');
    expect(await scroll.evaluate(node=>node.scrollHeight>node.clientHeight)).toBe(true);
    const portrait=(await modal.locator('.profile-dialog-portrait').boundingBox())!;
    const content=(await modal.locator('.profile-dialog-content').boundingBox())!;
    if(width>700) expect(content.x).toBeGreaterThan(portrait.x+portrait.width);
    else expect(content.y).toBeGreaterThan(portrait.y+portrait.height);
    expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
    await scroll.evaluate(node=>node.scrollTop=node.scrollHeight);
    await expect(modal.locator('.profile-bio')).toContainText('End of profile.');
    await expect(modal.getByRole('button',{name:'Close profile'})).toBeInViewport();
    await page.screenshot({path:`test-results/profile-modal-${width}.png`});
    await modal.getByRole('button',{name:'Close profile'}).click();
    await expect(modal).toBeHidden();
    await expect(button).toBeFocused();
    expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
  }
});


test('leadership cards open profiles and modal portraits keep their natural ratio',async({page})=>{
  const imageUrl='/assets/profile-square-check.svg';
  await page.route('**/assets/profile-square-check.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#900000"/></svg>'}));
  const executives=feed.executives.map(member=>({...member,imageUrl}));
  await page.route('**/api/website/feed',route=>route.fulfill({json:{success:true,data:{...feed,executives}}}));
  for(const width of [1440,1024,390,320]) {
    await page.setViewportSize({width,height:844}); await page.goto('/leadership');
    for(const card of [page.locator('.leadership-executive .profile-card').first(),page.locator('.leadership-committees .profile-card').first()]) {
      const trigger=card.locator('.profile-card-trigger, .profile-action:not(:disabled)').first();
      await trigger.click();
      const modal=page.getByRole('dialog'); const image=modal.locator('.profile-dialog-portrait img');
      await expect(image).toBeVisible(); await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0)).toBe(true);
      const portrait=(await image.boundingBox())!; expect(portrait.width/portrait.height).toBeCloseTo(1,2);
      await modal.getByRole('button',{name:'Close profile'}).click(); await expect(trigger).toBeFocused();
    }
  }
});


test('profile modal and uncropped portrait grow together with the biography',async({page})=>{
  const imageUrl='/assets/profile-size-check.svg';
  await page.route('**/assets/profile-size-check.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#900000"/></svg>'}));
  let bio='A short biography.';
  let revision=1;
  await page.route('**/api/website/version',route=>route.fulfill({json:{success:true,data:{revision:String(revision)}}}));
  await page.route('**/api/website/feed',route=>route.fulfill({json:{success:true,data:{...feed,executives:[{...feed.executives[0],imageUrl,bio}]}}}));
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:844});
    const sizes=[];
    for(const text of ['A short biography.','A record of service and leadership. '.repeat(400)]) {
      bio=text;revision++;
      await page.goto('/leadership');
      await page.getByRole('button',{name:'Read Bio'}).first().click();
      const modal=page.getByRole('dialog');
      const image=modal.locator('.profile-dialog-portrait img');
      await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0)).toBe(true);
      await expect.poll(async()=>{const box=(await modal.boundingBox())!;const picture=(await image.boundingBox())!;return width>700?Math.abs(box.height-picture.height-58):0;}).toBeLessThan(2);
      const box=(await modal.boundingBox())!;
      const picture=(await image.boundingBox())!;
      sizes.push({height:box.height,imageWidth:picture.width});
      if(width<=700) expect(picture.width).toBeCloseTo(box.width-42,0);
      expect(picture.width/picture.height).toBeCloseTo(1,2);
      expect(box.height).toBeLessThanOrEqual(844-32);
      const scroll=modal.locator('.profile-bio-scroll');
      if(text.length<100) expect(await scroll.evaluate(node=>node.scrollHeight-node.clientHeight)).toBeLessThanOrEqual(1);
      else expect(await scroll.evaluate(node=>node.scrollHeight-node.clientHeight)).toBeGreaterThan(0);
      await page.screenshot({path:`test-results/profile-sized-${width}-${text.length<100?'short':'long'}.png`});
      if(width===390 && text.length>100) {
        await page.setViewportSize({width,height:500});
        await expect.poll(async()=> (await modal.boundingBox())!.height).toBeLessThanOrEqual(468);
        await expect(modal.getByRole('button',{name:'Close profile'})).toBeInViewport();
        const resized=(await image.boundingBox())!;
        expect(resized.width/resized.height).toBeCloseTo(1,2);
        expect(resized.width).toBeCloseTo((await modal.boundingBox())!.width-42,0);
        await page.setViewportSize({width,height:844});
      }
      await modal.getByRole('button',{name:'Close profile'}).click();
    }
    expect(sizes[1].height).toBeGreaterThan(sizes[0].height);
    if(width>700) expect(sizes[1].imageWidth).toBeGreaterThan(sizes[0].imageWidth);
    else expect(sizes[1].imageWidth).toBeCloseTo(sizes[0].imageWidth,0);
  }
});


test('shared navbar is clear at the top and glass only after scrolling on desktop and mobile',async({page})=>{
  await page.route('**/api/website/feed',route=>route.fulfill({json:{success:true,data:feed}}));
  await page.route('**/api/website/posts/api-story',route=>route.fulfill({json:{success:true,data:{record:post,body:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Story body.'}]}]},media:[],sponsors:[]}}}));
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/blog','/programs-events','/about','/leadership','/partnerships','/blog/a-new-api-only-story']) {
      await page.goto(route);
      const header=page.locator('.site-header');
      await expect(header).toBeVisible();
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await expect(header).not.toHaveClass(/is-scrolled/);
      const clear=await header.evaluate(node=>{const s=getComputedStyle(node);return {background:s.backgroundColor,blur:s.backdropFilter,shadow:s.boxShadow,border:s.borderBottomColor};});
      expect(clear).toEqual({background:'rgba(0, 0, 0, 0)',blur:'none',shadow:'none',border:'rgba(0, 0, 0, 0)'});
      if(route==='/programs-events') await page.screenshot({path:`test-results/navbar-clear-${width}.png`});
      await page.evaluate(()=>window.scrollTo({top:400,behavior:'instant'}));
      await expect(header).toHaveClass(/is-scrolled/);
      expect(await header.evaluate(node=>getComputedStyle(node).backdropFilter)).toContain('blur');
      expect((await header.boundingBox())!.y).toBe(0);
      if(route==='/programs-events') await page.screenshot({path:`test-results/navbar-glass-${width}.png`});
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await expect(header).not.toHaveClass(/is-scrolled/);
    }
  }
});

test('About initiatives come from the dashboard feed in API mode', async ({ page }) => {
  const program = { ...snapshot.feed.data.programs[0], id: 'dashboard-only', slug: 'dashboard-only', title: 'Dashboard-only programme' };
  await page.route('**/api/website/feed', route => route.fulfill({ json: { success: true, data: { ...feed, programs: [program] } } }));
  await page.goto('/about');
  const cards = page.locator('.about-initiatives .content-card');
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText('Dashboard-only programme');
  await expect(cards.filter({ hasText: 'Creative Vortex' })).toHaveCount(0);
});

test('leadership page renders live dashboard assignments rather than local Figma records', async ({ page }) => {
  const president = { ...feed.executives[0], id: 'api-president', name: 'Dashboard President', group: 'executive', featured: true, imageUrl: null };
  const secretary = { ...president, id: 'api-secretary', name: 'Dashboard Secretary', featured: false };
  const committee = { ...president, id: 'api-committee', name: 'Dashboard Committee Head', group: 'committee' };
  const patron = { ...president, id: 'api-patron', name: 'Dashboard Patron', group: 'patron' };
  await page.route('**/api/website/feed', route => route.fulfill({ json: { success: true, data: { ...feed, executives: [president, secretary, committee, patron] } } }));
  await page.goto('/leadership');
  await expect(page.locator('.leadership-executive .leadership-featured-cards')).toContainText('Dashboard President');
  await expect(page.locator('.leadership-committees')).toContainText('Dashboard Committee Head');
  await expect(page.getByText('Adeleke Adedeji')).toHaveCount(0);
  await expect(page.getByText('Dashboard Patron')).toHaveCount(0);
  await page.locator('.leadership-executive').getByRole('button', { name: 'View All' }).click();
  await expect(page.locator('.leadership-executive .leadership-additional')).toContainText('Dashboard Secretary');
});
