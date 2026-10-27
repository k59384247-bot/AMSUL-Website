# Website data integration

Local fixtures are the default. Dashboard API format remains authoritative; website adapters map those fields into the existing components. This implementation does not change the dashboard API.

## Choose the source

The active local configuration is `.env.local`:

```dotenv
NEXT_PUBLIC_WEBSITE_DATA_SOURCE=local
```

Use `api` instead of `local` to read the dashboard through the website gateway. Restart the development server after changing it. Cloudflare Pages needs a new build/deployment because `NEXT_PUBLIC_` settings are compiled into the browser bundle. Changing only a runtime variable does not replace an already-built bundle.

`.env.example` lists all settings. `.env.local` is ignored by Git. On Cloudflare Pages, set `NEXT_PUBLIC_WEBSITE_DATA_SOURCE=local` in the build environment for now. Local is also the fallback when the variable is absent. An invalid value fails the build; it never silently selects API mode.

API mode additionally needs these **server-side** Pages variables:

```dotenv
AMSUL_API_BASE_URL=https://us-central1-mt-cms-dashboard-staging.cloudfunctions.net/api
AMSUL_TENANT_ID=amsul
AMSUL_MEDIA_SIGNING_SECRET=<stable-random-secret-at-least-32-characters>
AMSUL_MEDIA_ORIGINS=https://firebasestorage.googleapis.com,https://storage.googleapis.com
```

Use the verified dashboard environment's base URL. Add an exact HTTPS storage origin if the dashboard uses another storage provider. Keep the signing secret stable between deployments; do not prefix it with `NEXT_PUBLIC_`, commit it, or put Firebase admin credentials in the website. API mode reports a configuration error if required settings are missing.

The new dashboard Content/Executive fields from Step 1 still need deployment before live data can populate every new relationship. Older events can use their IDs when no slug is supplied. Missing leadership group assignments are not inferred from people's names or positions.

## Edit the local data

`src/fixtures/dashboard.json` is the one fixture snapshot. It contains:

- `feed`: the standard `{ success: true, data }` envelope with raw public post, category, event, programme and executive DTOs.
- `bodies`: Tiptap rich-text documents keyed by the corresponding post/event ID.
- `events` and `programs`: their standard detail-response envelopes.
- `media` and `sponsors`: standard event-child response envelopes keyed by **event ID**.

All fixture people and editorial content are fictional. Fixtures are not copied into the dashboard database. Local mode performs no dashboard or storage requests. Local image paths reuse existing supplied assets; a clearly fictional downloadable PDF lives at `public/fixtures/demo-report.pdf`.

The demo includes 12 blog posts, 14 reports, six highlights, six events (four upcoming at the implementation date), one programme and ten leadership records. Dates deliberately drive upcoming/past selection, so upcoming results will naturally change as those dates pass.

For a highlight, use `categories: ["event-highlights", ...initiativeSlugs]`, set `eventId` to an event's actual ID, and optionally set an HTTPS `albumUrl`. Its body belongs to the **post**, while date/venue/gallery/sponsors come from the **linked event**. Multiple highlights referencing one event reuse the event detail cache. Galleries/sponsors grow and shrink from their actual arrays.

Impact Reports use `categories: ["impact-reports", ...initiativeSlugs]`. These are Content records; no separate Finance report feed is used. Every card links to its own record rather than a repeated sample detail.

Leadership uses explicit `group` values (`executive`, `patron`, `committee`), `featured`, and `order`. Groups with only additional members show those members immediately. Empty groups and meaningless View All controls are omitted. Real leadership placement remains an editorial choice; the earlier decision to defer Michael Ajala's staging assignment is preserved.

## Shared feed and UI mapping

`WebsiteDataProvider` owns the feed once for the app. Home, About initiatives, Blog, Reports, Events, Highlights and Leadership all select from it. A page never fetches its own independent list. Concurrent requests share one promise. API-mode public feed data is also reused within the browser session across full-page navigation.

| Dashboard fields | Website destination |
| --- | --- |
| Post `id`, `slug`, `title`, `excerpt`, `subtitle` | Home/listing/related cards and the matching detail heading/intro |
| Post `categories[]` | Reports/highlights classification, initiative/category filters and counts |
| Post `contentType.name`, `contentUnit.name`, `tags[]` | Content-type dropdown, labels and search |
| Post `author.name`, `author.avatarUrl`, `publishedAt`, `readTime` | Story and article byline/date/reading time |
| Post covers / featured cover | Existing shared card/detail image slots |
| Post `contentUrl` → cached JSON | Safely rendered Tiptap body; no raw HTML injection |
| Post `attachments[]` | Named attachment/download controls; absent files create no fake downloads |
| Post `eventId`, `albumUrl` | Highlight event join and optional full-album link |
| Event `id`, `slug`, `title`, `category`, `programId`, `eventType` | Event/detail links, programme/category labels and type filter |
| Event `startDate`, `endDate`, `startTime`, `endTime`, `timezone`, `location` | Upcoming/past selection and consistent event/highlight metadata |
| Event covers / `descriptionUrl` | Cached cover and event rich-text body |
| Event media `url`, `caption`, `type`, `order` | Ordered photo gallery; non-photo media is excluded |
| Event sponsors `name`, `logoUrl`, `websiteUrl` | Sponsor name/logo and optional website link |
| Programme `id`, `slug`, `title`, `description`, dates, `eventCount` | Events carousel, About initiatives and programme detail with child events |
| Executive `name`, `position`, `imageUrl`, `bio`, `group`, `featured`, `order` | Existing leadership groups, cards, biographies and View All subsets |

Home shows the latest four reports and five stories. Home/Events use future events; featured event sections respect `featured`. Listing featured carousels use actual featured records. Related lists exclude the current record; related report placement on highlights requires an actual shared initiative/category. Filters and pagination use the records currently present, with no artificial page numbers.

## Pages Functions and caching

`cloudflare/worker.ts` is compiled into `out/_worker.js` using Cloudflare Pages Functions **advanced mode**. `out/_routes.json` limits function invocation to data endpoints and detail routes. Keep the Pages build command `npm run build` and output directory `out`. No Next.js server is needed in production.

The gateway reads dashboard `/v1` endpoints, follows the dashboard's cursor pagination, preserves its success/error envelope conventions and aggregates page-independent collections. It does not reshape dashboard endpoints to match a Figma page. API errors do not fall back to fixture content.

Successful editorial feeds, details, body documents and assets are fresh for one hour. The edge retains responses for up to one day so a stale value can be returned while refreshing in the background or during an upstream outage. Failed initial responses are not cached. The browser respects the edge's reported age rather than starting another full hour of freshness. Cache entries are scoped to the dashboard base URL/tenant/secret where relevant.

Dashboard media URLs are rewritten to signed, same-origin `/api/website/asset` URLs. The server checks the signature, exact HTTPS storage origin and redirect targets before fetching. Only supported media/document types are served, with safe response headers. Browsers request the website cache endpoint, not storage. The first cache miss must fetch the original asset **on the server** to fill the cache; later requests reuse it. Cache entries are per Cloudflare location and are not a permanent asset archive or a promise of exactly one origin request worldwide.

External registration redirects re-read the event and deadline without caching. Native registration/payment submissions are not implemented. Local demo forms retain their honest no-submission messages. API mode shows the external registration route only where configured; other registration shows an unavailable message rather than pretending to save data. Prices/capacity/deadlines are not treated as live transaction guarantees from an hour-old editorial feed.

## New detail URLs

Fixture URLs are exported as normal static pages. API mode also uses a reusable exported detail shell for new blog/report/event/programme/highlight slugs. The Pages Function resolves the slug from the cached dashboard feed, serves the correct shell, supplies a title, and returns HTTP 404 for an unknown/unavailable record. The client resolves the same record from the shared feed. This allows newly published URLs without rebuilding the static website for every record.

Detail bodies load in the client. This is not full server-rendered article content for search engines; server-rendered rich content and broader SEO metadata would be a separate enhancement. Internal shell URLs are not navigation destinations.

## What remains fixed/local

The existing Figma layout, site navigation, section headings, institutional copy/history/statistics, Contact page/FAQs, global partner directory, Partnership benefits/testimonials and shared footer copy remain in their existing local files. Those items do not have an approved complete public dashboard source. They are not fabricated from unrelated API records. The intentionally reserved sections stay empty.

Contact enquiry, newsletter, native event registration, payment checkout, and the pending partnership Google Form are separate submission/integration tasks. This work connects the content reads, not those writes.

## Verify

```sh
npm run typecheck
npm run build
npm test
NEXT_PUBLIC_WEBSITE_DATA_SOURCE=api PORT=3002 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 npm test -- tests/api-mode.spec.ts
```

The API-mode browser tests mock public responses; gateway tests independently exercise pagination, errors, freshness, stale refreshes, signed media, storage redirects, body/media cache reuse, new slugs and fresh registration checks. This does not claim a deployed end-to-end dashboard connection.

For Cloudflare's actual local runtime after building, use `npx wrangler pages dev out` with the same server variables. No deployment or Git push is performed by these commands unless you explicitly run a deployment command.

Cloudflare references: [Pages Functions advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/) and [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).
