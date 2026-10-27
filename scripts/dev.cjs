process.env.NODE_ENV = 'development';
const http = require('node:http');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const port = Number(process.env.PORT || 3001);
const next = require('next')({ dev: true, hostname: '127.0.0.1', port });
const retained = new Map();
global.caches = { default: { match: async request => retained.get(request.url)?.clone(), put: async (request, response) => { retained.set(request.url, response.clone()); } } };
async function main() {
  await next.prepare();
  execFileSync(process.execPath, ['scripts/build-worker.cjs', '--dev'], { stdio: 'inherit', env: process.env });
  const worker = (await import(pathToFileURL(path.resolve('.cloudflare/worker.mjs')).href)).default;
  const handler = next.getRequestHandler();
  http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://127.0.0.1:${port}`);
      if (url.pathname.startsWith('/api/website/')) {
        const request = new Request(url, { method: req.method });
        const response = await worker.fetch(request, { ...process.env }, { waitUntil: promise => promise.catch(console.error) });
        res.writeHead(response.status, Object.fromEntries(response.headers));
        if (response.body) { for await (const chunk of response.body) res.write(chunk); }
        res.end(); return;
      }
      const detail = url.pathname.match(/^\/(blog|impact-reports|programs-events|event-highlights)\/([a-zA-Z0-9_-]+)\/?$/);
      if (process.env.NEXT_PUBLIC_WEBSITE_DATA_SOURCE === 'api' && detail) {
        await next.render(req, res, `/${detail[1]}/__detail`); return;
      }
      if (detail) {
        const feed = JSON.parse(require('node:fs').readFileSync('src/fixtures/dashboard.json', 'utf8')).feed.data;
        const records = detail[1] === 'programs-events' ? [...feed.events, ...feed.programs] : feed.posts.filter(post => detail[1] === 'impact-reports' ? post.categories.includes('impact-reports') : detail[1] === 'event-highlights' ? post.categories.includes('event-highlights') : !post.categories.some(category => ['impact-reports', 'event-highlights'].includes(category)));
        if (!records.some(record => (record.slug || record.id) === detail[2])) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
          res.end('<!doctype html><html lang="en"><title>Content not found | AMSUL</title><style>body{background:#090909;color:#eee;font:1rem system-ui;padding:4rem}a{color:#f5cf64}</style><main id="main-content"><h1>Content not found</h1><a href="/">Return to Home</a></main></html>'); return;
        }
      }
      await handler(req, res);
    } catch { res.writeHead(500); res.end('Content unavailable'); }
  }).listen(port, '127.0.0.1', () => console.log(`Website ready at http://127.0.0.1:${port}`));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
