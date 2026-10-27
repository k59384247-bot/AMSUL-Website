import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import ts from 'typescript';
import snapshot from '../src/fixtures/dashboard.json';

type Worker = { default: { fetch(request: Request, env: any, ctx: any): Promise<Response> }; cached(request: Request, ctx: any, load: () => Promise<Response>, now?: number): Promise<Response> };
const originalFetch = globalThis.fetch;
let store: Map<string, Response>;
let pending: Promise<unknown>[];
let calls: string[];
let fail = false;
let mediaRedirect = false;
let registrationOpen = true;
let firstPageOnly = false;
let fixture: any;
let revision = '0';
let lastEvent = '';
const ctx = { waitUntil: (promise: Promise<unknown>) => pending.push(promise) };
const env = { AMSUL_CACHE_WEBHOOK_SECRET: 'test-webhook-secret-with-at-least-32-characters', AMSUL_CACHE_DB: { prepare: (sql: string) => ({ bind: (...values: any[]) => ({ first: async () => { if (sql.startsWith('INSERT')) { if (lastEvent !== values[1]) revision = String(Number(revision) + 1); lastEvent = values[1]; } return { revision: Number(revision) }; } }) }) }, AMSUL_API_BASE_URL: 'https://dashboard.test/api', AMSUL_TENANT_ID: 'amsul', AMSUL_MEDIA_SIGNING_SECRET: 'website-integration-test-secret-at-least-32-characters', AMSUL_MEDIA_ORIGINS: 'https://storage.test', ASSETS: { fetch: async () => new Response('<html><head><title>Detail</title><meta name="robots" content="noindex, nofollow"></head><body>App shell</body></html>', { headers: { 'Content-Type': 'text/html' } }) } };
const response = (data: unknown, meta?: unknown) => Response.json({ success: true, data, ...(meta ? { meta } : {}) });
async function worker(source = 'api'): Promise<Worker> {
  const input = readFileSync('cloudflare/worker.ts', 'utf8').replace("'__WEBSITE_SOURCE__'", JSON.stringify(source));
  const code = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code + `\n//${Math.random()}`).toString('base64')}`);
}
async function request(worker: Worker, path: string, method = 'GET') { return worker.default.fetch(new Request(`https://website.test${path}`, { method }), env, ctx); }
async function webhook(app: Worker, payload: unknown, timestamp = new Date().toISOString(), valid = true) {
  const body = JSON.stringify(payload);
  const signature = createHmac('sha256', env.AMSUL_CACHE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest('base64');
  return app.default.fetch(new Request('https://website.test/api/website/invalidate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-AMSUL-Webhook-Timestamp': timestamp, 'X-AMSUL-Webhook-Signature': `v1=${valid ? signature : 'A'.repeat(43) + '='}` }, body }), env, ctx);
}
function remote(value: any): any {
  if (Array.isArray(value)) return value.map(remote);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, typeof entry === 'string' && entry.startsWith('/assets/') ? `https://storage.test${entry}` : key === 'url' && typeof entry === 'string' && entry.startsWith('/fixtures/') ? `https://storage.test${entry}` : remote(entry)]));
}
test.beforeEach(() => {
  store = new Map(); pending = []; calls = []; fail = false; mediaRedirect = false; registrationOpen = true; firstPageOnly = false;
  revision = '0'; lastEvent = ''; fixture = remote(structuredClone(snapshot));
  (globalThis as any).caches = { default: { match: async (key: Request) => store.get(key.url)?.clone(), put: async (key: Request, value: Response) => { store.set(key.url, value.clone()); } } };
  globalThis.fetch = async (input: any, init?: RequestInit) => {
    // Match workerd: Node accepts this mode, but Cloudflare rejects it before I/O.
    if (init?.redirect === 'error') throw new TypeError('Invalid redirect value, must be follow or manual');
    const url = new URL(input instanceof Request ? input.url : String(input)); calls.push(url.href);
    if (url.hostname === 'storage.test') {
      if (mediaRedirect) return new Response(null, { status: 302, headers: { Location: 'https://unapproved.test/file.png' } });
      if (url.pathname.endsWith('.json')) return Response.json({ type: 'doc', content: [{ type: 'image', attrs: { src: 'https://storage.test/photo.png', alt: 'Inline image' } }, { type: 'paragraph', content: [{ type: 'text', text: 'Document', marks: [{ type: 'link', attrs: { href: 'https://storage.test/report.pdf' } }] }] }] });
      return new Response('image bytes', { headers: { 'Content-Type': 'image/png' } });
    }
    if (fail) return Response.json({ success: false, error: { code: 'TEST_OUTAGE', message: 'Dashboard unavailable' } }, { status: 503 });
    const path = url.pathname.replace('/api/v1/', '');
    if (path === 'blog/posts') {
      if (firstPageOnly) return response(url.searchParams.get('cursor') ? fixture.feed.data.posts.slice(1) : fixture.feed.data.posts.slice(0, 1), { hasMore: !url.searchParams.get('cursor'), nextCursor: url.searchParams.get('cursor') ? null : 'cursor-2' });
      return response(fixture.feed.data.posts, { hasMore: false });
    }
    if (path === 'blog/categories') return response(fixture.feed.data.categories);
    if (path === 'events') return response(fixture.feed.data.events, { hasMore: false });
    if (path === 'programs') return response(fixture.feed.data.programs, { hasMore: false });
    if (path === 'executives') return response(fixture.feed.data.executives);
    if (path.startsWith('blog/posts/')) return response(fixture.feed.data.posts.find((post: any) => post.id === path.split('/').at(-1)));
    const match = path.match(/^(events|programs)\/([^/]+)(?:\/(media|sponsors))?$/);
    if (match) {
      if (match[3]) return fixture[match[3]][match[2]] ? Response.json(fixture[match[3]][match[2]]) : response([]);
      const record = fixture[match[1]][match[2]]?.data;
      if (record && match[1] === 'events') Object.assign(record, { registrationRequired: registrationOpen, useExternalRegistration: true, externalRegistrationUrl: 'https://forms.example.test/register', registrationDeadline: null, startDate: '2099-11-01T10:00:00Z', endDate: null });
      return response(record);
    }
    throw new Error(`Unexpected fixture request ${url}`);
  };
});
test.afterEach(async () => { await Promise.allSettled(pending); globalThis.fetch = originalFetch; delete (globalThis as any).caches; });

test('local mode never contacts the dashboard', async () => {
  const app = await worker('local'); const result = await request(app, '/api/website/feed');
  expect(result.status).toBe(409); expect(calls).toEqual([]);
});
test('feed follows dashboard cursor pagination and is reused from the revision cache', async () => {
  firstPageOnly = true; const app = await worker();
  const first = await request(app, '/api/website/feed'); const body = await first.json();
  expect(body.success).toBe(true); expect(body.data.posts).toHaveLength(snapshot.feed.data.posts.length);
  expect(calls.some(url => url.includes('cursor=cursor-2'))).toBe(true);
  const count = calls.length; const second = await request(app, '/api/website/feed');
  expect(second.headers.get('X-Website-Cache')).toBe('HIT'); expect(calls.length).toBe(count);
});
test('API errors preserve the error envelope, are not cached and never return local samples', async () => {
  const app = await worker(); fail = true;
  const failed = await request(app, '/api/website/feed');
  expect(failed.status).toBe(503); expect(await failed.json()).toMatchObject({ success: false, error: { code: 'TEST_OUTAGE' } });
  expect(store.size).toBe(0); fail = false;
  expect((await request(app, '/api/website/feed')).status).toBe(200);
});
test('elapsed hours never refresh unchanged cached content', async () => {
  const app = await worker(); let loads = 0;
  const req = new Request('https://website.test/immutable-fixture');
  const load = async () => response({ version: ++loads });
  await app.cached(req, ctx, load, 1_000_000);
  const afterHours = await app.cached(req, ctx, load, 1_000_000 + 7200_000);
  expect(afterHours.headers.get('X-Website-Cache')).toBe('HIT');
  expect((await afterHours.json()).data.version).toBe(1); expect(loads).toBe(1); expect(pending).toHaveLength(0);
});
test('cache hits do not contact Firebase, even when the dashboard is unavailable', async () => {
  const app = await worker(); await request(app, '/api/website/feed');
  const count = calls.length; fail = true;
  for (const entry of store.values()) entry.headers.set('X-Website-Stored-At', '1');
  expect((await request(app, '/api/website/feed')).status).toBe(200);
  expect(calls).toHaveLength(count); expect(pending).toHaveLength(0);
  expect(calls.some(url => url.includes('website/version'))).toBe(false);
});
test('all media fields become signed website URLs and repeated media reads use the cache', async () => {
  const app = await worker(); const feed = await (await request(app, '/api/website/feed')).json();
  const image = feed.data.posts.find((post: any) => post.coverImageUrl)?.coverImageUrl;
  expect(image).toMatch(/^\/api\/website\/asset\?/);
  const first = await request(app, image); expect(first.status).toBe(200); await first.text();
  const count = calls.filter(url => url.startsWith('https://storage.test')).length;
  expect((await request(app, image)).headers.get('X-Website-Cache')).toBe('HIT');
  expect(calls.filter(url => url.startsWith('https://storage.test'))).toHaveLength(count);
  expect((await request(app, image.replace(/s=[a-f0-9]+/, `s=${'0'.repeat(64)}`))).status).toBe(403);
});
test('rejects redirects to storage hosts outside the allowlist', async () => {
  const app = await worker(); const feed = await (await request(app, '/api/website/feed')).json();
  mediaRedirect = true;
  const result = await request(app, feed.data.posts.find((post: any) => post.coverImageUrl).coverImageUrl);
  expect(result.status).toBe(502); expect(calls.some(url => url.startsWith('https://unapproved.test'))).toBe(false);
});
test('detail bodies and inline media are mapped from their own record, using the shared asset cache', async () => {
  const app = await worker(); fixture.feed.data.posts[0].contentUrl = 'https://storage.test/body.json';
  const result = await request(app, '/api/website/posts/post-1'); const detail = await result.json();
  expect(detail.data.body.content[1].content[0].marks[0].attrs.href).toMatch(/^\/api\/website\/asset\?/);
  expect(detail.data.record.id).toBe('post-1'); expect(detail.data.body.content[0].attrs.src).toMatch(/^\/api\/website\/asset\?/);
  await request(app, detail.data.record.contentUrl);
  expect(calls.filter(url => url === 'https://storage.test/body.json')).toHaveLength(1);
});
test('new API-only slugs get their detail shell and unknown slugs return a real 404', async () => {
  fixture.feed.data.posts[0].slug = 'new-api-only-story'; fixture.feed.data.posts[0].title = 'API-only story';
  const app = await worker(); const detail = await request(app, '/blog/new-api-only-story');
  expect(detail.status).toBe(200); expect(await detail.text()).toContain('<title>API-only story | AMSUL</title>');
  expect((await request(app, '/blog/unknown-slug')).status).toBe(404);
});
test('external registration checks fresh event state on every click and read gateway rejects writes', async () => {
  const app = await worker(); const first = await request(app, '/api/website/events/event-1/register');
  expect(first.status).toBe(302); expect(first.headers.get('Cache-Control')).toBe('no-store');
  registrationOpen = false; expect((await request(app, '/api/website/events/event-1/register')).status).toBe(409);
  expect(calls.filter(url => url.includes('/events/event-1?'))).toHaveLength(2);
  expect((await request(app, '/api/website/feed', 'POST')).status).toBe(405);
});

test('a detail-page outage keeps an HTML app shell and a 503 response for the client retry state', async () => {
  fail = true; const app = await worker(); const result = await request(app, '/blog/new-api-only-story');
  expect(result.status).toBe(503); expect(result.headers.get('Content-Type')).toContain('text/html'); expect(await result.text()).toContain('App shell');
});


test('dashboard redirects are rejected without following the destination', async () => {
  const app = await worker(); const modes: unknown[] = [];
  globalThis.fetch = async (_input: any, init?: RequestInit) => {
    modes.push(init?.redirect);
    return new Response(null, { status: 302, headers: { Location: 'https://unapproved.test/dashboard' } });
  };
  const result = await request(app, '/api/website/feed');
  expect(result.status).toBe(502);
  expect(await result.json()).toMatchObject({ success: false, error: { code: 'UPSTREAM_REDIRECT' } });
  expect(modes).toEqual(Array(5).fill('manual'));
  expect(store.size).toBe(0);
});


test('a dashboard revision invalidates feed, details and unchanged media URLs across edge locations', async () => {
  const app = await worker();
  const first = await request(app, '/api/website/feed'); const before = await first.json();
  const image = before.data.posts.find((post: any) => post.coverImageUrl).coverImageUrl;
  await request(app, image);
  fixture.feed.data.posts[0].contentUrl = 'https://storage.test/body.json';
  await request(app, '/api/website/posts/post-1');
  fixture.feed.data.posts[0].title = 'Updated from the dashboard';
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'change-1' })).status).toBe(200);
  const next = await request(app, '/api/website/feed'); const after = await next.json();
  expect(next.headers.get('X-Website-Revision')).toBe('1');
  expect(after.data.posts[0].title).toBe('Updated from the dashboard');
  const nextImage = after.data.posts.find((post: any) => post.coverImageUrl).coverImageUrl;
  expect(nextImage).not.toBe(image);
  const count = calls.filter(url => url.startsWith('https://storage.test')).length;
  await request(app, nextImage); expect(calls.filter(url => url.startsWith('https://storage.test'))).toHaveLength(count + 1);
  const detail = await (await request(app, '/api/website/posts/post-1')).json();
  expect(detail.data.record.title).toBe('Updated from the dashboard');
});


test('notifications require a valid signature, tenant and recent timestamp', async () => {
  const app = await worker();
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'change-1' }, undefined, false)).status).toBe(401);
  expect((await webhook(app, { tenantId: 'other', eventId: 'change-1' })).status).toBe(400);
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'change-1' }, new Date(Date.now() - 600_000).toISOString())).status).toBe(401);
  expect(revision).toBe('0');
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'change-1' })).status).toBe(200);
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'change-1' })).status).toBe(200);
  expect(revision).toBe('1'); expect(calls).toHaveLength(0);
});


test('oversized notifications and missing cache configuration cannot fall back to Firebase checks', async () => {
  const app = await worker();
  expect((await webhook(app, { tenantId: 'amsul', eventId: 'x'.repeat(9000) })).status).toBe(413);
  const result = await app.default.fetch(new Request('https://website.test/api/website/feed'), { ...env, AMSUL_CACHE_DB: undefined }, ctx);
  expect(result.status).toBe(503); expect(calls).toHaveLength(0);
});
