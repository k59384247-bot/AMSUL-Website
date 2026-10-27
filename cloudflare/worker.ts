// Pages Functions advanced mode. The build replaces the source sentinel in this file.
import type { Feed, Envelope, Detail, RichNode, Post, Event, Program } from '../src/lib/website/contracts';
type Env = { ASSETS: { fetch(request: Request): Promise<Response> }; AMSUL_API_BASE_URL?: string; AMSUL_TENANT_ID?: string; AMSUL_MEDIA_SIGNING_SECRET?: string; AMSUL_MEDIA_ORIGINS?: string; WEBSITE_REVISION?: string };
type Context = { waitUntil(promise: Promise<unknown>): void };
type EdgeCache = { match(request: Request): Promise<Response | undefined>; put(request: Request, response: Response): Promise<void> };
const SOURCE: string = '__WEBSITE_SOURCE__';
const FRESH = 3600;
const RETAIN = 86400;
const inFlight = new Map<string, Promise<Response>>();
class GatewayError extends Error { constructor(public status: number, public code: string, message: string) { super(message); } }
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const success = (data: unknown) => json({ success: true, data });
function config(env: Env) {
  if (!env.AMSUL_API_BASE_URL || !env.AMSUL_TENANT_ID || !env.AMSUL_MEDIA_SIGNING_SECRET || env.AMSUL_MEDIA_SIGNING_SECRET.length < 32) throw new GatewayError(503, 'CONFIGURATION_REQUIRED', 'Website API mode requires the API URL, tenant ID and a media-signing secret of at least 32 characters.');
  const base = new URL(env.AMSUL_API_BASE_URL);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(env.AMSUL_TENANT_ID)) throw new GatewayError(503, 'INVALID_CONFIGURATION', 'Invalid website API configuration.');
  return { base: base.href.replace(/\/$/, ''), tenant: env.AMSUL_TENANT_ID };
}
function cacheFor(): EdgeCache | undefined { return (globalThis as typeof globalThis & { caches?: { default?: EdgeCache } }).caches?.default; }
// Cache API retention is separate from freshness; stale entries refresh in the background.
export async function cached(request: Request, ctx: Context, load: () => Promise<Response>, now = Date.now(), freshFor = FRESH, allowStale = true): Promise<Response> {
  const cache = cacheFor();
  const key = new Request(request.url, { method: 'GET' });
  const hit = await cache?.match(key);
  const age = hit ? Math.max(0, Math.floor((now - Number(hit.headers.get('X-Website-Stored-At') || 0)) / 1000)) : 0;
  const expose = (response: Response, status: string, responseAge = 0) => {
    const headers = new Headers(response.headers);
    headers.delete('X-Website-Stored-At');
    headers.set('Cache-Control', `public, max-age=${status === 'STALE' ? 0 : freshFor}`);
    headers.set('X-Website-Cache', status);
    headers.set('Age', String(responseAge));
    return new Response(response.body, { status: response.status, headers });
  };
  const refresh = () => {
    if (!inFlight.has(key.url)) {
      const pending = load().then(async response => {
        if (!response.ok) throw new GatewayError(response.status, 'UPSTREAM_ERROR', 'Content could not be refreshed.');
        const headers = new Headers(response.headers);
        headers.set('Cache-Control', `public, max-age=${RETAIN}`);
        headers.set('X-Website-Stored-At', String(now));
        headers.delete('Set-Cookie');
        const stored = new Response(response.body, { status: response.status, headers });
        if (cache) await cache.put(key, stored.clone());
        return stored;
      }).finally(() => inFlight.delete(key.url));
      inFlight.set(key.url, pending);
    }
    return inFlight.get(key.url)!.then(response => response.clone());
  };
  if (hit && age >= freshFor && !allowStale) return expose(await refresh(), 'MISS');
  if (hit) {
    if (age >= freshFor) ctx.waitUntil(refresh().then(() => {}).catch(() => console.error('Website cache refresh failed; retained last successful response.')));
    return expose(hit, age < freshFor ? 'HIT' : 'STALE', age);
  }
  return expose(await refresh(), 'MISS');
}
async function upstream<T>(path: string, env: Env, extra: Record<string, string> = {}): Promise<Envelope<T>> {
  const { base, tenant } = config(env);
  const url = new URL(`${base}/v1/${path}`);
  url.searchParams.set('tenantId', tenant);
  for (const [key, value] of Object.entries(extra)) url.searchParams.set(key, value);
  // workerd supports manual/follow only; reject redirects explicitly before reading the body.
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000), redirect: 'manual' });
  if (response.status >= 300 && response.status < 400) throw new GatewayError(502, 'UPSTREAM_REDIRECT', 'Dashboard API redirects are not allowed. Check the configured API URL.');
  let body: Envelope<T> & { error?: { code?: string; message?: string } };
  try { body = await response.json() as typeof body; } catch { throw new GatewayError(502, 'INVALID_RESPONSE', 'Dashboard returned an invalid response.'); }
  if (!response.ok || !body.success || !('data' in body)) throw new GatewayError(response.ok ? 502 : response.status, body.error?.code || 'UPSTREAM_ERROR', body.error?.message || 'Dashboard content is unavailable.');
  return body;
}
async function all<T>(path: string, env: Env): Promise<T[]> {
  const records: T[] = [];
  let cursor = ''; const seen = new Set<string>();
  for (let page = 1; page <= 100; page++) {
    const response = await upstream<T[]>(path, env, { limit: '50', ...(cursor ? { cursor } : { page: String(page) }) });
    if (!Array.isArray(response.data)) throw new GatewayError(502, 'INVALID_RESPONSE', 'Expected a dashboard collection.');
    records.push(...response.data);
    const more = response.meta?.hasMore ?? (response.meta?.total !== undefined && records.length < response.meta.total);
    if (!more) return records;
    if (!response.data.length) throw new GatewayError(502, 'INVALID_PAGINATION', 'Dashboard pagination did not advance.');
    cursor = response.meta?.nextCursor ?? '';
    if (cursor && seen.has(cursor)) throw new GatewayError(502, 'INVALID_PAGINATION', 'Dashboard pagination repeated a cursor.');
    if (cursor) seen.add(cursor);
  }
  throw new GatewayError(502, 'FEED_TOO_LARGE', 'Dashboard feed exceeded its configured pagination limit.');
}
// A short, shared revision check replaces purging individual caches in every edge location.
async function websiteVersion(request: Request, env: Env, ctx: Context): Promise<string> {
  const { base, tenant } = config(env);
  const scope = hex(await crypto.subtle.digest('SHA-256', bytes(`${base}\n${tenant}`)));
  const response = await cached(new Request(new URL(`/__website_cache/v2/${scope}/version`, request.url)), ctx, async () => {
    const value = (await upstream<{ revision: string }>('website/version', env)).data;
    if (!/^\d{1,32}$/.test(value.revision)) throw new GatewayError(502, 'INVALID_REVISION', 'Invalid dashboard content version.');
    return success(value);
  }, Date.now(), 15, false);
  return ((await response.json()) as Envelope<{ revision: string }>).data.revision;
}
function withRevision(response: Response, revision: string) {
  const headers = new Headers(response.headers); headers.set('X-Website-Revision', revision);
  return new Response(response.body, { status: response.status, headers });
}
function mediaURL(value: string, env: Env): URL {
  const url = new URL(value);
  const allowed = (env.AMSUL_MEDIA_ORIGINS || 'https://firebasestorage.googleapis.com,https://storage.googleapis.com').split(',').map(origin => origin.trim());
  if (url.protocol !== 'https:' || url.username || url.password || !allowed.includes(url.origin)) throw new GatewayError(502, 'UNAPPROVED_MEDIA_ORIGIN', 'A dashboard asset uses an unconfigured storage origin.');
  return url;
}
const bytes = (value: string) => new TextEncoder().encode(value);
async function signingKey(env: Env) { return crypto.subtle.importKey('raw', bytes(env.AMSUL_MEDIA_SIGNING_SECRET!), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
const hex = (value: ArrayBuffer) => Array.from(new Uint8Array(value), byte => byte.toString(16).padStart(2, '0')).join('');
async function asset(value: string | null | undefined, env: Env): Promise<string | null> {
  if (!value) return null;
  mediaURL(value, env);
  const message = `${env.AMSUL_TENANT_ID}\n${env.WEBSITE_REVISION ?? '0'}\n${value}`;
  const signature = hex(await crypto.subtle.sign('HMAC', await signingKey(env), bytes(message)));
  return `/api/website/asset?${new URLSearchParams({ u: value, s: signature, v: env.WEBSITE_REVISION ?? '0' })}`;
}
const mediaKeys = new Set(['coverImageUrl', 'featuredImageUrl', 'bannerImageUrl', 'posterImageUrl', 'imageUrl', 'logoUrl', 'avatarUrl', 'contentUrl', 'descriptionUrl']);
async function mapMedia(value: unknown, env: Env, parent = ''): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(item => mapMedia(item, env, parent)));
  if (!value || typeof value !== 'object') return value;
  const object = value as Record<string, unknown>;
  return Object.fromEntries(await Promise.all(Object.entries(object).map(async ([key, entry]) => {
    if ((mediaKeys.has(key) || (key === 'url' && ['attachments', 'media'].includes(parent)) || (key === 'src' && parent === 'attrs')) && typeof entry === 'string') return [key, await asset(entry, env)];
    if (key === 'href' && typeof entry === 'string') {
      let origin = ''; try { origin = new URL(entry).origin; } catch { /* Non-URL text links are ignored by the renderer. */ }
      const origins = ['https://firebasestorage.googleapis.com', 'https://storage.googleapis.com', ...(env.AMSUL_MEDIA_ORIGINS ?? '').split(',').map(value => value.trim())];
      if (origin && origins.includes(origin)) return [key, await asset(entry, env)];
    }
    return [key, await mapMedia(entry, env, key)];
  })));
}
async function fetchAsset(url: URL, env: Env): Promise<Response> {
  let current = mediaURL(url.href, env);
  for (let redirects = 0; redirects < 4; redirects++) {
    const response = await fetch(current, { signal: AbortSignal.timeout(20000), redirect: 'manual' });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('Location');
      if (!location) throw new GatewayError(502, 'INVALID_MEDIA_REDIRECT', 'Invalid asset redirect.');
      current = mediaURL(new URL(location, current).href, env); continue;
    }
    if (!response.ok) throw new GatewayError(response.status === 404 ? 404 : 502, 'ASSET_UNAVAILABLE', 'This asset is unavailable.');
    const mime = response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() ?? '';
    if (!/^(image\/(jpeg|png|gif|webp|avif|svg\+xml)|application\/(json|pdf|octet-stream|msword|vnd\.[a-z0-9.+-]+))$/.test(mime)) throw new GatewayError(502, 'UNSUPPORTED_ASSET', 'Unsupported dashboard asset format.');
    if (Number(response.headers.get('Content-Length') || 0) > 50 * 1024 * 1024) throw new GatewayError(502, 'ASSET_TOO_LARGE', 'This asset exceeds the website cache limit.');
    return new Response(response.body, { headers: { 'Content-Type': response.headers.get('Content-Type')!, 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Referrer-Policy': 'no-referrer' } });
  }
  throw new GatewayError(502, 'MEDIA_REDIRECT_LIMIT', 'Too many asset redirects.');
}
async function rawBody(url: string | null | undefined, env: Env, origin: string, ctx: Context): Promise<RichNode | null> {
  if (!url) return null;
  const proxy = await asset(url, env);
  const signature = new URL(proxy!, origin).searchParams.get('s')!;
  const key = new Request(new URL(`/__website_cache/v1/asset/${env.AMSUL_TENANT_ID}/${signature}`, origin));
  const response = await cached(key, ctx, () => fetchAsset(mediaURL(url, env), env));
  try { const body = await response.json() as RichNode; if (body.type !== 'doc' || !Array.isArray(body.content)) throw new Error(); return body; }
  catch { throw new GatewayError(502, 'INVALID_BODY', 'The editorial document is not valid rich text.'); }
}
async function feed(request: Request, env: Env, ctx: Context) {
  const { base, tenant } = config(env);
  const revision = await websiteVersion(request, env, ctx);
  env = { ...env, WEBSITE_REVISION: revision };
  const scope = await crypto.subtle.digest('SHA-256', bytes(`${base}\n${tenant}\n${env.AMSUL_MEDIA_SIGNING_SECRET}`));
  const key = new Request(new URL(`/__website_cache/v1/${hex(scope)}/${revision}/feed`, request.url));
  return withRevision(await cached(key, ctx, async () => {
    const [posts, categories, events, programs, executives] = await Promise.all([all<Post>('blog/posts', env), all<Feed['categories'][number]>('blog/categories', env), all<Event>('events', env), all<Program>('programs', env), all<Feed['executives'][number]>('executives', env)]);
    return success(await mapMedia({ posts, categories, events, programs, executives }, env));
  }), revision);
}
async function detail(kind: string, id: string, request: Request, env: Env, ctx: Context) {
  const { base, tenant } = config(env);
  const revision = await websiteVersion(request, env, ctx);
  env = { ...env, WEBSITE_REVISION: revision };
  const scope = hex(await crypto.subtle.digest('SHA-256', bytes(`${base}\n${tenant}\n${env.AMSUL_MEDIA_SIGNING_SECRET}`)));
  return cached(new Request(new URL(`/__website_cache/v1/${scope}/${revision}/${kind}/${id}`, request.url)), ctx, async () => {
    const record = (await upstream<Post | Event | Program>(`${kind === 'posts' ? 'blog/posts' : kind}/${encodeURIComponent(id)}`, env)).data;
    let media: unknown[] = [], sponsors: unknown[] = [];
    if (kind !== 'posts') [media, sponsors] = await Promise.all([all(`${kind}/${encodeURIComponent(id)}/media`, env), all(`${kind}/${encodeURIComponent(id)}/sponsors`, env)]);
    const body = kind === 'programs' ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: (record as Program).description ?? '' }] }] } : await rawBody(kind === 'posts' ? (record as Post).contentUrl : (record as Event).descriptionUrl, env, new URL(request.url).origin, ctx);
    return success(await mapMedia({ record, body, media, sponsors }, env));
  });
}
const slug = (record: { id: string; slug?: string }) => record.slug && /^[a-zA-Z0-9_-]+$/.test(record.slug) ? record.slug : record.id;
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
export default {
  async fetch(request: Request, env: Env, ctx: Context): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/website/')) {
        if (request.method !== 'GET') return json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'This website gateway only supports reads.' } }, 405);
        if (SOURCE !== 'api') return json({ success: false, error: { code: 'LOCAL_MODE', message: 'Local fixtures are active. No dashboard request was made.' } }, 409);
        config(env);
        if (url.pathname === '/api/website/version') return success({ revision: await websiteVersion(request, env, ctx) });
        if (url.pathname === '/api/website/feed') return await feed(request, env, ctx);
        if (url.pathname === '/api/website/asset') {
          const revision = url.searchParams.get('v') ?? '0';
          if (!/^\d{1,32}$/.test(revision)) throw new GatewayError(403, 'INVALID_ASSET_SIGNATURE', 'Invalid website asset version.');
          const value = url.searchParams.get('u') ?? ''; const signature = url.searchParams.get('s') ?? '';
          if (!/^[a-f0-9]{64}$/.test(signature) || !await crypto.subtle.verify('HMAC', await signingKey(env), Uint8Array.from(signature.match(/../g)!, byte => parseInt(byte, 16)), bytes(`${env.AMSUL_TENANT_ID}\n${revision}\n${value}`))) throw new GatewayError(403, 'INVALID_ASSET_SIGNATURE', 'Invalid website asset URL.');
          const media = mediaURL(value, env);
          return await cached(new Request(new URL(`/__website_cache/v1/asset/${env.AMSUL_TENANT_ID}/${signature}`, url)), ctx, () => fetchAsset(media, env));
        }
        const registration = url.pathname.match(/^\/api\/website\/events\/([a-zA-Z0-9_-]+)\/register$/);
        if (registration) {
          // Registration state is always re-read, never served from the editorial cache.
          const event = (await upstream<Event>(`events/${registration[1]}`, env)).data;
          if (!event.registrationRequired || !event.useExternalRegistration || !event.externalRegistrationUrl || (event.registrationDeadline && Date.parse(event.registrationDeadline) < Date.now()) || (event.endDate ?? event.startDate) && Date.parse(event.endDate ?? event.startDate!) < Date.now()) throw new GatewayError(409, 'REGISTRATION_UNAVAILABLE', 'Registration is not available for this event.');
          const target = new URL(event.externalRegistrationUrl);
          if (target.protocol !== 'https:' || target.username || target.password) throw new GatewayError(502, 'INVALID_REGISTRATION_URL', 'The external registration URL is invalid.');
          return new Response(null, { status: 302, headers: { Location: target.href, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
        }
        const match = url.pathname.match(/^\/api\/website\/(posts|events|programs)\/([a-zA-Z0-9_-]+)$/);
        if (match) return await detail(match[1], match[2], request, env, ctx);
        throw new GatewayError(404, 'NOT_FOUND', 'Unknown website data endpoint.');
      }
      const route = url.pathname.match(/^\/(blog|impact-reports|programs-events|event-highlights)\/([a-zA-Z0-9_-]+)\/?$/);
      if (SOURCE === 'api' && route && request.method === 'GET') {
        const snapshot = await (await feed(request, env, ctx)).json() as Envelope<Feed>;
        const records = route[1] === 'programs-events' ? [...snapshot.data.events, ...snapshot.data.programs] : snapshot.data.posts.filter(post => route[1] === 'impact-reports' ? post.categories.includes('impact-reports') : route[1] === 'event-highlights' ? post.categories.includes('event-highlights') && snapshot.data.events.some(event => event.id === post.eventId) : !post.categories.some(category => ['impact-reports', 'event-highlights'].includes(category)) && (!post.hub || post.hub === 'blog'));
        const record = records.find(item => slug(item) === route[2]);
        const shell = await env.ASSETS.fetch(new Request(new URL(`/${route[1]}/__detail`, url)));
        const title = record ? `${record.title} | AMSUL` : 'Content not found | AMSUL';
        let html = (await shell.text()).replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
        if (record) html = html.replace(/<meta name="robots"[^>]*>/g, '');
        return new Response(html, { status: record ? 200 : 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...(!record ? { 'X-Robots-Tag': 'noindex' } : {}) } });
      }
      return await env.ASSETS.fetch(request);
    } catch (error) {
      const known = error instanceof GatewayError;
      const detailRoute = url.pathname.match(/^\/(blog|impact-reports|programs-events|event-highlights)\/[^/]+\/?$/);
      if (!url.pathname.startsWith('/api/website/') && detailRoute) {
        const shell = await env.ASSETS.fetch(new Request(new URL(`/${detailRoute[1]}/__detail`, url)));
        return new Response(shell.body, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
      }
      return json({ success: false, error: { code: known ? error.code : 'CONTENT_UNAVAILABLE', message: known ? error.message : 'Website content is temporarily unavailable.' } }, known ? error.status : 502);
    }
  },
};
