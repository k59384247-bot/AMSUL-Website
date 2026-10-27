import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
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
const ctx = { waitUntil: (promise: Promise<unknown>) => pending.push(promise) };
const env = { AMSUL_API_BASE_URL: 'https://dashboard.test/api', AMSUL_TENANT_ID: 'amsul', AMSUL_MEDIA_SIGNING_SECRET: 'website-integration-test-secret-at-least-32-characters', AMSUL_MEDIA_ORIGINS: 'https://storage.test', ASSETS: { fetch: async () => new Response('<html><head><title>Detail</title><meta name="robots" content="noindex, nofollow"></head><body>App shell</body></html>', { headers: { 'Content-Type': 'text/html' } }) } };
const response = (data: unknown, meta?: unknown) => Response.json({ success: true, data, ...(meta ? { meta } : {}) });
async function worker(source = 'api'): Promise<Worker> {
  const input = readFileSync('cloudflare/worker.ts', 'utf8').replace("'__WEBSITE_SOURCE__'", JSON.stringify(source));
  const code = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code + `\n//${Math.random()}`).toString('base64')}`);
}
async function request(worker: Worker, path: string, method = 'GET') { return worker.default.fetch(new Request(`https://website.test${path}`, { method }), env, ctx); }
function remote(value: any): any {
  if (Array.isArray(value)) return value.map(remote);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, typeof entry === 'string' && entry.startsWith('/assets/') ? `https://storage.test${entry}` : key === 'url' && typeof entry === 'string' && entry.startsWith('/fixtures/') ? `https://storage.test${entry}` : remote(entry)]));
}
test.beforeEach(() => {
  store = new Map(); pending = []; calls = []; fail = false; mediaRedirect = false; registrationOpen = true; firstPageOnly = false;
  fixture = remote(structuredClone(snapshot));
  (globalThis as any).caches = { default: { match: async (key: Request) => store.get(key.url)?.clone(), put: async (key: Request, value: Response) => { store.set(key.url, value.clone()); } } };
  globalThis.fetch = async (input: any) => {
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
test('feed follows dashboard cursor pagination and is reused from the one-hour cache', async () => {
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
test('cache freshness lasts one hour, then returns stale content while refreshing', async () => {
  const app = await worker(); let loads = 0;
  const load = async () => response({ version: ++loads }); const req = new Request('https://website.test/cache-fixture');
  await app.cached(req, ctx, load, 1_000_000);
  expect((await app.cached(req, ctx, load, 1_000_000 + 3599_000)).headers.get('X-Website-Cache')).toBe('HIT');
  const stale = await app.cached(req, ctx, load, 1_000_000 + 3601_000);
  expect(stale.headers.get('X-Website-Cache')).toBe('STALE'); expect((await stale.json()).data.version).toBe(1);
  await Promise.all(pending); expect(loads).toBe(2);
});
test('retains the last successful cache response when a stale refresh fails', async () => {
  const app = await worker(); const req = new Request('https://website.test/stale-outage');
  await app.cached(req, ctx, async () => response({ version: 1 }), 1_000_000);
  const stale = await app.cached(req, ctx, async () => { throw new Error('outage'); }, 5_000_000);
  expect(stale.status).toBe(200); await Promise.all(pending);
  expect((await (await app.cached(req, ctx, async () => response({ version: 2 }), 5_000_000)).json()).data.version).toBe(1);
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
