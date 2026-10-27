> **Website implementation update — 26 October 2026:** Shared feed adapters and local fixture mode are implemented for the variable website sections and detail pages. API gateway, one-hour caching and new detail URL support are prepared. Local fixtures remain selected; live deployment/configuration is pending. See [Data integration](data-integration.md) for the implemented mappings and current limitations.

> **Step 1 implementation update — 25 October 2026:** Dashboard source now supports `impact-reports` / `event-highlights` category slugs, Content `eventId` and `albumUrl`, stable Event slugs, and Executive `group` (`executive`/`patron`/`committee`) plus `featured`. Earlier gap rows below describe the original audit. See the dashboard `docs/Website-Fields-Contract.md` for exact validation, defaults and rollout. Website adapters/cache remain unimplemented; new API projections require deployment.

# AMSUL — complete API-to-frontend mapping

**Date:** 25 October 2026
**Coverage:** all 13 implemented page types, shared components, media, navigation, forms and metadata.
**Status:** integration specification based on the inspected projects. The shared feeds, Pages Functions, asset proxy, cache invalidation and source switch described here are not yet implemented in AMSUL-Website. This document maps the work; it does not claim the website is connected.

## 1. Source rules and notation

- **API:** field exists in an inspected public route. Availability of a field does not guarantee every record has a value.
- **Derived:** computed by an explicit frontend adapter/selector, not a separate dashboard field.
- **Local:** approved page copy, UI configuration or a local content file. It remains local even when variable records use the API.
- **Gap:** the public API does not currently supply the required field/relationship, or the component cannot yet render it.
- **Decision:** proposed selection/behaviour requires agreement; it must not be treated as an existing API contract.

Only public serializers are the integration contract. A field present on an internal Firestore type is not automatically available to the website. Examples below refer to normalized frontend model names as proposed names, not code already added.

**Confirmed correction:** Impact Reports are Content records identified by their Content category. They are not a new module or private Finance reports. A public category check on 25 October returned 11 categories but no name matching “Impact Report(s)”; its exact taxonomy identity still needs to be supplied or created.

## 2. Central feeds and consumers

| Shared source | Upstream public API | Normalized feed | Pages/sections that read it |
| --- | --- | --- | --- |
| Published Content | `GET /v1/blog/posts?tenantId=…`; follow all required pages/cursors | `contentFeed`, indexed by Content ID | Home stories/reports; Blog listing/details; Impact Report hub/details; related articles/reports; a highlight recap only if explicitly associated |
| Content categories | `GET /v1/blog/categories?tenantId=…` | `taxonomy.categories` | Blog/report filters, report classification, labels and tag resolution |
| Content tags | `GET /v1/blog/tags?tenantId=…` | `taxonomy.tags` | Resolved tag labels, filtering and related-content rules |
| Content units | `GET /v1/blog/content-units?tenantId=…` | `taxonomy.units` | Editorial Board/club/unit badges and filters where the design has a slot |
| Published Events | `GET /v1/events?tenantId=…` | `eventFeed`, indexed by Event ID | Home event previews; About flagship initiatives; Events listing/details; related events; potential highlight parent metadata |
| Published Programs | `GET /v1/programs?tenantId=…` | `programFeed`, indexed by Program ID | Upcoming programmes; event programme-name joins; About initiatives when programme-backed |
| Executives | `GET /v1/executives?tenantId=…&session=…` | `leadershipFeed`, indexed by Executive ID | Leadership council/cards/bios; other leadership previews only if later added |
| Event-owned children | `/v1/events/{id}/media`, `/sponsors`, `/sessions`, `/form-fields` | Child caches keyed by Event ID and resource | Event detail, approved highlight gallery/sponsors, dynamic registration and any approved session display |
| Program-owned children | `/v1/programs/{id}`, `/media`, `/sponsors` | Program detail/children keyed by Program ID | Programme joins and a future/approved programme destination; not a new page invented by this mapping |
| Tenant identity | `/v1/tenants/{tenantId}/public` | Optional `tenantIdentity` | Association name/logo/description where approved; do not automatically replace the Figma theme |
| Website editorial settings | Current `src/data/site.ts`, `landing.ts`, `about.ts`, `contact-page.ts`, `partnership.ts`, etc. | `siteCopy`, `siteSettings` | All hero/section headings, history, statistics, contact details, FAQs, partner directory and testimonials without a public source |

The feeds belong to the application, not to a page. Home can load `contentFeed` first and Blog can reuse it; the reverse also works. No visitor must open Blog before Home can show posts. Components select records from the shared store; they do not independently call the upstream API.

Lists and full details are distinct: reuse existing summary fields immediately, fetch genuinely missing detail/body/child data once when needed, and merge by stable ID. Do not download every article body and every gallery on the homepage merely to populate a common cache. A complete small list snapshot must follow pagination; one API page is not the entire dataset. A future large dataset can use cached query membership plus one shared entity store without forcing every visitor to download everything.

## 3. Content taxonomy and routing rules

### 3.1 Impact Report identity

| Item | Mapping/rule | Status |
| --- | --- | --- |
| Category definition | Category API `{id, name, slug}` identifies the configured Impact Reports category | API; exact category pending |
| Stored membership | `post.categories[]` contains the category value assigned by the dashboard | API |
| Correct comparison | Current Create/Edit Content UI stores **category slugs**, not category document IDs. Match the confirmed category slug against `post.categories[]`; support legacy ID/name values only with explicit aliases | Inspected source fact |
| Report selector | `contentFeed.records.filter(record => record.categorySlugs.includes(reportCategorySlug))` | Derived; proposed normalized property |
| Detail lookup | `/v1/blog/posts/{postId}?tenantId=…` after resolving the website report slug to the same Content ID | API + derived |
| Report URL | `/impact-reports/{canonicalSlug}` | Derived; requires runtime route resolution for newly published records |
| Blog selector | Proposed: non-report Content records; include reports in Blog too only if explicitly wanted | Decision |
| Report initiatives | Additional categories on report records can represent HealthWeek/etc. only if approved as that taxonomy. The Content API has no `initiativeId` or Event/Program relationship | Gap/decision |

Renaming a category slug needs a migration/alias plan for existing post membership. The category `postCount` is informational; it is not the exact count for the current report/filter/search combination. Do not identify reports by title text, attachment format, `hub='impact-reports'`, or a private Finance collection. The current Content hub values are `blog`, `headlines`, `announcements` and `press`.

### 3.2 Shared record identity

- One Content ID remains one record whether rendered on Home, Blog, Reports or a related-content section.
- IDs drive API detail requests, cache identity and joins. Slugs drive readable website URLs; they are not the API's detail identifiers.
- Validate duplicate/missing slugs. Preserve known URL aliases through an explicit redirect/lookup table; do not invent a new slug from a title on every render.
- Event/Program routes read `d.slug`, but current creation types/handlers do not establish a reliable slug on every record. Supply/backfill stable slugs or agree stable ID-based URLs.
- The website currently uses `output: 'export'`, fixed `generateStaticParams` lists and `dynamicParams=false`. Pages Functions alone do not make previously unexported detail URLs resolve. Runtime detail routing/page rendering is an explicit integration task.

## 4. Content field dictionary — Blog and Impact Reports

`Post` below means the public projection returned by the list/detail Content endpoints. All display URLs for dashboard assets are rewritten to owned cached endpoints.

| Dashboard API item | Normalized frontend item | Exact UI destinations / transformation |
| --- | --- | --- |
| `id` | `content.id` | Shared store key, card identity, detail request, related-item exclusion and cache ownership. Never display internal IDs as titles |
| `slug` | `content.slug`, `content.href` | Blog/report card link and canonical detail URL, based on classification |
| `title` | `content.title` | Home StoryCard/ReportCard; featured title; listing title; detail H1; title fallback for metadata |
| `subtitle` | `content.subtitle` | No separate subtitle slot in several current detail layouts. Preserve in the model; use as intro only with an agreed editorial rule, not as an automatic replacement for `excerpt` |
| `excerpt` | `content.excerpt` | Card summary, featured summary, detail introductory description. Null → omit summary/use an explicitly approved derived plain-text excerpt; never unrelated sample copy |
| `coverImageUrl` | `content.cover.src` | Standard card cover and detail cover, through media proxy. Components currently show blank panels and need real-image support |
| `featuredImageUrl` | `content.featuredCover.src` | Featured carousel image; fallback to the same record's cover when absent |
| `contentUrl` | `content.bodyRef` → `content.body` | Cached fetch of the JSON document; article/report body renderer. Do not put the Storage URL in a browser fetch |
| JSON `type='doc'`, `content[]` | `RichDocument` | Full article/report body. Both inspected published article files have this root shape |
| JSON heading nodes and level | Body heading hierarchy | Preserve semantic hierarchy and shared typography; current fixed paragraph-section renderer needs expansion |
| JSON paragraph/text nodes | Body paragraphs | Preserve text and supported marks; do not flatten the entire article into one string |
| JSON lists, blockquotes, links and supported media | Body list/quote/link/media elements | Validate supported nodes/attributes; safe links; inline dashboard media also uses cached media routes; unsupported blocks get defined handling |
| `attachments[].name` | `attachment.title` | Attachment row label and accessible download label |
| `attachments[].url` | `attachment.downloadRef` | Owned cached download endpoint, not direct Storage navigation |
| `attachments[].fileType` | `attachment.format` | Correct file icon/format label. Dashboard upload UI currently permits PDF/DOC/DOCX; frontend currently only models PDF/Slides and needs a generic/document option |
| `author.id` | `content.author.id` | Author identity; no visible ID |
| `author.name` | `content.author.name` | Story card byline and article detail byline; no invented Ajala Michael fallback |
| `author.avatarUrl` | `content.author.avatar.src` | Cached author avatar in card/detail; absent → intentional fallback shape, not another person's portrait |
| `contentType.id`, `.name` | `content.type` | First story badge; Content Type dropdown; article content-type tag. Compare IDs, display names |
| `categories[]` | `content.categorySlugs`, resolved categories | Category badges, Blog/report filters, report membership. Resolve metadata using actual stored slugs |
| `tags[]` | `content.tags` | Search/related signals and optional tag display; do not replace content type/unit with arbitrary array positions |
| `contentUnit.id`, `.name` | `content.unit` | Editorial/club/unit badge, e.g. third StoryCard badge; unit filter only if a UI slot is approved |
| `hub` | `content.hub` | Optional content grouping/selection, not the Impact Reports classifier |
| `featured` | `content.featured` | Eligibility for featured blog/report carousel and proposed homepage featured selections |
| `displaySection[]` | `content.placements` | Section selection only for supported exact values. The Content editor currently offers blog/headlines/announcements/press, **not homepage**; an API field existing does not create a dashboard Homepage option |
| `publishedAt` | `content.publishedAt`, formatted `dateLabel` | Card/detail publication date and Latest/Oldest sort; format consistently, omit invalid/missing dates |
| `readTime` | `content.readingMinutes`, `readingTimeLabel` | Article detail reading time. Accept valid positive numbers; agreed calculation from body may be used when absent |
| `seoTitle`, `seoDescription` | `content.seo` | Detail title/description metadata; fall back to the same record's title/excerpt. Dynamic metadata needs a compatible route/rendering strategy |
| API `meta.total`, `.hasMore`, `.nextCursor`, `.page`, `.limit` | Feed completeness / page membership | Complete the feed/query correctly; do not show upstream overall Content total as filtered Blog/report total |
| Cover alt text, credit | `content.cover.alt`, `.credit` | No dedicated public cover-alt/credit fields found. Supply approved per-record asset metadata or extend the public projection |
| Primary report download | `report.primaryDownload` | No dedicated primary-file field. One unambiguous approved PDF can be selected by an agreed rule; multiple candidates require explicit selection/configuration |
| Report-specific outcomes/metrics | Structured body sections | No public report-metrics object. Render approved metrics in the Content body; add structured fields only if actual UI behaviour needs them |
| Related IDs | Related selectors/configuration | No `relatedPostIds` in the current projection. Use approved configured IDs or a deterministic same-category/tag rule; exclude the current ID |

## 5. Shared header, footer, hero and site metadata — all pages

| Data item | Source | Frontend destination / rule |
| --- | --- | --- |
| Association name | Local approved identity; optional tenant `name` | Brand accessible label and site metadata; do not rename the site on an optional identity-request failure |
| Header/footer anniversary logo | Existing approved local assets; optional tenant `logoUrl` | `SiteHeader` / `SiteFooter` brand images. Replacing the anniversary mark needs approval; cached proxy if dashboard-sourced |
| Navbar/footer labels, groups, URLs, visibility | `site.navigation` | Shared desktop/mobile navigation and footer; five requested member-service links remain hidden |
| Partner With AMSUL / Become A Partner destination | One local/configured public Google Form URL | All header, Home, report/article callout, About and Partnerships buttons. One destination, no extra application page |
| Hero badge/title/description/line breaks | Each page's local hero copy | Shared `Hero` / `HeroBadge`; no Content/Event record should overwrite page-level editorial headings |
| Shared hero background photo | Existing local hero asset | Shared `Hero` background. A future configured dashboard asset goes through the media cache |
| Hero side thumbnails | None | Intentionally omitted everywhere |
| Site font/colours/button treatment | Existing design system | Tenant `headingFont` and `primaryColor` must not silently replace the agreed Figma appearance |
| Footer email/handle/social URLs | `site.contact` and approved shared settings | Footer contact row. Reconcile with Contact page settings instead of two conflicting sources |
| Newsletter copy/input/button | Local site copy + visitor input | Footer newsletter block; submission provider is a separate gap, not a Content API write |
| Powered by credit | Approved local credit label/URL | Footer StruktHQ link |
| Copyright year/text | Local policy/derived year | Footer copyright; use one agreed policy |
| Base title/description/theme colour/language | Local metadata settings | Root layout title template, description, viewport theme colour, `lang` |
| Domain, canonical URL, share image | Deployment/local SEO config; record SEO on details | Canonical/open-graph URLs; dashboard share images use media proxy; no private/origin token URLs in share metadata |
| Missing page / temporary page labels | Route registry + local UI copy | 404 or explicit temporary state; API absence must not redirect visitors to an unrelated sample detail |

## 6. Home `/`

| Section / data item | Source → normalized item | Frontend destination / selection rule |
| --- | --- | --- |
| Hero badge, headline, since line, intro | Local `landing.hero` | Main hero and introductory copy; partnership URL from shared site settings |
| Partner-section headings | Local `landing.partners` | SectionHeading eyebrow/title/description |
| Partner IDs/names/logos/order/optional URL | Approved local partner directory; no public directory API | Shared PartnerGrid. Reuse the same approved directory on Partnerships; never derive all partners from one Event's sponsors |
| Alumni/events/awards/outreach figures and labels | Approved local statistics | ImpactStatistics tiles. Public Event count is not evidence for a historical outreach/award/alumni total |
| Tile tones and mobile stagger | UI configuration | Existing shared impact-grid behaviour; not dashboard content |
| Reserved panel 1 | Local reserved-section configuration | Empty panel until its approved content/behaviour is supplied |
| History heading/date range | Local `landing.history` | History SectionHeading |
| Milestone ID/year/title/description/order | Local approved history records | HistoryTimeline. Reuse common milestones with About where intended; no matching public API |
| Report section headings | Local `landing.reports` | “Impact You Can Measure” copy and View All → `/impact-reports` |
| Report cards | Report selector from `contentFeed` | `id/title/excerpt/cover/href`; ReportCard badge is local “Report”. Proposed selection: configured IDs or featured report records, then stable publication ordering |
| Event section headings | Local `landing.events` | Section heading/description and View All → `/programs-events` |
| Featured event/programme | Approved selector from `eventFeed` or `programFeed` | InitiativeCard title, summary, cover, category/programme tags and canonical URL. First agree whether this slot represents an Event or Program |
| Event carousel | Upcoming Event selector | EventCard title, cached cover, programme name, category, formatted date/time, venue, price and href; shared Event dictionary below applies |
| Reserved panel 2 | Local reserved-section configuration | Second empty panel; no API record invented |
| Stories section headings | Local `landing.stories` | SectionHeading; View All → `/blog` |
| Story cards | Blog selector from `contentFeed` | StoryCard title/excerpt/cached cover, type/category/unit badges, author/avatar/date and href; same records as Blog listing |
| Homepage Content placement | `featured` plus approved website selector/ID configuration | No current Content editor Homepage placement control. Add one or keep explicit central selection settings; do not assume `displaySection=homepage` is configured |
| Partnership section headings/paragraphs | Local `landing.partnership` | Partnership copy |
| Benefits number/title/description/continuation | Local approved benefit records | BenefitCard; do not pull unrelated report summaries into benefits in API mode |
| Partnership buttons | Shared Google Form URL; `/partnerships` | Become A Partner and View More Details |

## 7. About Us `/about`

| Section / data item | Source | Frontend destination / rule |
| --- | --- | --- |
| Hero badge/title/subtitle | Local `about.hero` | Shared centered hero |
| Who We Are eyebrow/headline/paragraphs | Local `about.introduction` | Introduction columns; duplicated sample paragraphs need approved replacement/confirmation |
| Student figure/label | Local approved statistics | First About statistic; no public Membership total is established for this page |
| Historical rank, ordinal and qualification | Local verified historical copy | Rank statistic; do not infer from tenant identity |
| Alumni figure/unit/label | Shared approved organisation statistics | Alumni statistic, consistent with Home/Partnerships scopes |
| Reserved panel | Local section configuration | Intentionally blank until content supplied |
| Purpose eyebrow/title | Local `about.purpose` | Purpose section heading |
| Purpose photograph/alt/credit | Approved local asset; future configured media reference | Purpose image, cached if dashboard-sourced |
| Mission/vision titles and text | Local `about.purpose` | Mission/vision cards |
| History heading/date range/description | Local `about.history` | History introduction |
| Milestones | Approved local history records | Two-sided HistoryTimeline; no new dates/names inferred from public Events |
| What We Do heading/description | Local `about.activities` | Activities introduction |
| Activity IDs/numbers/titles/descriptions | Local approved activity records | Five BenefitCards; unrelated HealthWeek samples do not become real activity claims |
| Flagship initiative heading/description | Local `about.initiatives` | Initiative section introduction |
| Featured and additional initiatives | Approved Event/Program ID selectors from shared feeds | InitiativeCard title/summary/cover/tags/href; no duplicate Event API requests per section |
| Partnership callout copy | Shared local callout | Heading/description, Meet Our Leadership → `/leadership`, partner action → shared Google Form |

## 8. Blog listing `/blog`

| UI item / section | Source → destination | Rules / gaps |
| --- | --- | --- |
| Hero | Local `blog.hero` → Hero | Page-level copy remains independent of the latest article title |
| Featured carousel records | Blog selector + `featured` / configured IDs → FeaturedContentCard | Use real title/excerpt, `featuredImageUrl` fallback cover, resolved type/category badges and own detail href; no repeated fabricated slides |
| Categories | Category metadata + membership in Blog selector → CategoryFilters | Desktop chips/mobile dropdown use the same state; use slug values matching dashboard assignments |
| Content Type choices | Distinct `contentType.id/name` in the available Blog feed | No public `/content-types` endpoint is currently mounted. Deriving options shows types represented by the feed, not every unused dashboard type |
| Search | Shared Blog records → title/excerpt/author/resolved taxonomy | Existing API has no documented free-text `q` search. Search a complete bounded snapshot or add a backend search contract; never search just one arbitrary API page as though global |
| Latest/Oldest | `publishedAt` → comparator | Stable ID tie-breaker; missing-date rule defined consistently |
| Card title/summary | `Post.title/excerpt` → StoryCard | Same text used in Home preview and detail introduction |
| Card cover | Cached `coverImageUrl` → image region | Current StoryCard has no data image prop; component wiring is required |
| Card badges | `contentType.name`, resolved category, `contentUnit.name` | Keep type/category/unit distinct; additional tags do not arbitrarily occupy these roles |
| Card byline/avatar/date | `author.name/avatarUrl`, `publishedAt` | Cached avatar; missing author is omitted/approved editorial fallback, never invented |
| Card destination | Post ID/slug registry → `/blog/{slug}` | Each card opens its own Content record |
| Result count | Length/total of the exact selected Blog query | Exclude report records if that is the approved Blog membership rule |
| Page numbers/per-page/directions | Filtered result total + local page size | `ceil(total/pageSize)`; no fake page numbers; reset after filter/search/sort changes |
| Empty/loading/error UI | Feed status + filtered records | Empty is not API failure. On API failure retain valid cached records or show error, never silently switch to demo data |

## 9. Blog details `/blog/{slug}`

| UI item / section | Source → destination | Rules / gaps |
| --- | --- | --- |
| Back button | Local label and `/blog` | Preserve navigation; no upstream request |
| Category/content-type tags | Resolved `categories[]`, `contentType.name` | Correct labels for this post, not sample HealthWeek/Academic labels |
| Main heading | `title` → H1 | Same record identity as its listing card |
| Introduction | `excerpt` → introductory paragraph | `subtitle` stays separate unless editorial rule approves its use |
| Author/avatar/date | `author.*`, `publishedAt` | Same shared byline model as cards |
| Reading time | `readTime` or approved body calculation | Format singular/plural; do not preserve fixed “5 mins” for every article |
| Cover | Cached `coverImageUrl` | Actual image; require appropriate alt/credit handling |
| Body | Cached JSON from `contentUrl` | Shared rich-document renderer, preserving headings/paragraphs/marks/lists/quotes/links/media |
| Attachments | `attachments[]` → AttachmentDownload rows | Validate descriptor; owned cached download URL; proper file icon and name |
| Related section heading | Local copy | Confirm “related articles/stories” instead of sample “related reports” |
| Related records | Approved Blog related selector from same `contentFeed` | Match IDs/categories/tags as agreed; exclude current post; no extra list fetch |
| Partnership copy/actions | Shared local callout and Google Form URL | Contact Us → `/contact`; no duplicated application URLs |
| Browser/share metadata | `seoTitle/seoDescription`, title/excerpt and cover fallbacks | Correct per-record metadata requires the runtime routing/rendering task |

## 10. Impact Report Hub `/impact-reports`

| UI item / section | Source → destination | Rules / gaps |
| --- | --- | --- |
| Hero badge/headline/intro | Local `impactHub.hero` | Keep page copy independent of a particular report |
| Report eligibility | Shared Content category selector | Exact approved category slug; no standalone Reports API and no Finance access |
| Featured carousel | Report records with `featured=true` or configured IDs | Title/excerpt/cached feature cover; local Featured badge; resolve a meaningful secondary initiative/category label |
| Report cards | Same report records | `title/excerpt/cover/href`; shared desktop hover and persistent mobile details |
| Report badge | Local “Report” | Badge is determined by report membership, not an arbitrary tag in the Content record |
| Filter labels/options | Additional approved categories on report records | Exclude the umbrella report category if it is not a meaningful initiative filter. Do not reuse a fabricated 12-initiative array |
| Category/initiative assignment | Resolved additional post categories, or future explicit relationship | There is no Content `initiativeId`. Decide whether secondary categories mean initiative; do not substitute `contentUnit` without approval |
| Search | Report title/excerpt/resolved category labels | Complete report subset, not all posts and not a single upstream page |
| Published report count | Exact report subset after filters | Content API's unfiltered `meta.total` is not this count |
| “Across N initiatives” | Distinct approved initiative assignments | If no real initiative relationship exists, revise/omit the initiative count rather than claim a fabricated number |
| Pagination | Actual filtered report total | Existing 6/12/24 page sizes can remain local UI configuration |
| Related/navigation destinations | Report ID/slug registry | `/impact-reports/{slug}` for the correct record |
| Partnership callout | Shared local copy and link configuration | Leadership is implemented; partner action uses the Google Form when supplied |

## 11. Impact Report details `/impact-reports/{slug}`

| UI item / section | Source → destination | Rules / gaps |
| --- | --- | --- |
| Back to Reports, Impact Report badge | Local UI strings | Static labels, not per-record API fields |
| Report title | Content `title` → H1 | Same identity as the report hub/Home card |
| Introductory description | Content `excerpt` | One consistent year/topic; no separate hardcoded contradictory introduction |
| Category/initiative label | Resolved secondary categories / agreed initiative relation | The umbrella Impact Reports category classifies the record; the displayed HealthWeek-style label needs a real relationship |
| Cover | Cached `coverImageUrl` | Report cover image; no automatic use of unrelated brochure/Event image |
| Download Report button | Explicitly selected item from `attachments[]` | Main PDF selection is a configuration/schema gap; never choose an arbitrary file because it comes first |
| Download label/format | Selected attachment `name/fileType` | Meaningful accessible filename; no assumed file size field |
| Main body | Cached Content JSON | Actual report headings, results, metrics and narrative; rich-document renderer |
| Additional attachments | Remaining approved `attachments[]` | Correct names/types/download URLs; decide whether selected main PDF should also appear in this list |
| Related reports | Same report subset, excluding current Content ID | Approved curated IDs or category/tag rule; no new Reports list API call |
| Partnership callout/actions | Shared local copy/form URL | Contact link stays `/contact` |
| SEO metadata | Content `seoTitle/seoDescription` with record fallbacks | Correct report URL, not a Blog URL for the same category-classified record |

## 12. Event and Program field dictionaries

### 12.1 Event records

| Dashboard API item | Normalized frontend item | UI destinations / transformation |
| --- | --- | --- |
| `id` | `event.id` | Shared store/cache key; detail/media/sponsor/form/session requests; registration Event ID |
| `slug` when present | `event.slug`, `event.href` | Home/About/Events/related card URLs and detail route. Stable slug creation/backfill or ID-routing decision required |
| `title` | `event.title` | All event card titles, featured title, detail H1 and metadata fallback |
| `startDate`, `endDate` | `event.startsAt/endsAt`, date labels | Upcoming/past selection, card date, detail date, body date and multi-day ranges. All locations derive from the same values |
| `startTime`, `endTime`, `timezone` | `event.timeRange`, `timeLabel` | Card time, detail header and repeated body metadata. Preserve the Event timezone; do not reinterpret local clock strings twice |
| `isMultiDay` | `event.isMultiDay` | Date-range formatting; no new badge invented if the layout has no slot |
| `location` | `event.venue` | Card venue, detail header/body venue. Public API already projects internal `venue` to `location` |
| `mapLocation` | `event.mapUrl` | Event/Highlight venue outbound link. Validate supported URL or explicitly convert coordinates/text; fallback to an honest search for the known venue |
| `organizer` | `event.organizer` | Retain for approved detail display; no standalone organizer slot currently exists |
| `bannerImageUrl` | `event.cover.src` | Cached featured/detail/event-card image |
| `posterImageUrl` | `event.poster.src` | Cached poster; use as cover fallback only under an approved image precedence rule |
| `descriptionUrl` **detail only** | `event.bodyRef` → rich document | Cached event detail body. Not present in the list; do not expect a list summary field |
| Derived plain-text excerpt or new API summary | `event.excerpt` | Home featured/Events featured/About initiative summaries. Current list has no excerpt; either fetch/cache detail body lazily or add an explicit public summary field |
| `eventType` | `event.type` | Event Type tag and All Events/Programme Events control |
| `programId` | `event.programId` | Join with `programFeed` to get the actual programme title; no placeholder PROGRAMME name |
| `category` | `event.category` | Card/detail category label. This is not automatically the same taxonomy as Content categories |
| `tags[]` | `event.tags` | Optional badges/search/related signals; retain only approved displayed tags |
| `featured`, `featuredType`, `displaySection[]` | Event placement selectors | Home/Events featured selections. Event editor supports homepage/events placement; featuredType requires a confirmed value convention if used |
| `registrationRequired` | `event.registration.required` | Show/omit registration journey based on fresh Event detail |
| `useExternalRegistration`, `externalRegistrationUrl` | `event.registration.mode/url` | One external registration action when enabled; no built-in POST for an external event |
| `registrationType` | `event.registration.type` | Free/paid/invite-only handling; invite-only must not be treated as free |
| `registrationDeadline` | `event.registration.deadline` | Closing state and submission validation; recheck fresh at action time |
| `capacity`, `totalRegistrations` | `event.registration.capacity/count` | Useful state, not authoritative seat availability from an hour-old card; no registration count UI added automatically |
| `paymentAmount`, `paymentCurrency` **detail only** | `event.price` | Card/detail price display and registration journey. List lacks the amount; reuse a cached detail projection or add a supported list price projection |
| `isPublic` | Public-read marker | Not an attendance/free-price flag; do not use it to decide registration mode |
| API pagination metadata | Event feed/query membership | Correct result totals and complete collection/query handling |
| Cover alt/credits, explicit related IDs, SEO fields | Optional normalized editorial metadata | Not provided by current Event serializer; use approved local mappings or extend the public contract |

Current Event list query filters a stored field named `type`, while responses/types use `eventType`. Resolve that mismatch before relying on upstream Event Type filtering. Also, `past=true` is based on startDate, so an already-started ongoing Event is not automatically a completed highlight.

### 12.2 Program records

| Dashboard API item | Frontend destination / transformation |
| --- | --- |
| `id`, `slug` | Program identity and agreed programme destination; do not route a Program ID through an Event detail API |
| `title` | Upcoming programme card heading; parent programme tag on linked Event cards/details |
| `description` | Programme-card excerpt/initiative description; unlike Event list, this field exists in Program list |
| `bannerImageUrl` | Cached programme cover |
| `year` | Programme year/context if displayed; not an invented event start year |
| `startDate`, `endDate` | Programme card date range |
| `status` | Source selection already restricts public reads to published; do not expose draft/completed/cancelled data by querying private collections |
| `eventCount` | “N EVENTS” card count. Confirm it means published children; stored count may not equal the public detail's visible child count |
| Detail `events[]` | Approved programme child-event destination/list; IDs seed/join canonical Event store, not a second conflicting dataset |
| Child `coverImageUrl` | Cache if used; child projection's cover name differs from canonical Event banner/poster. Prefer canonical Event data when available |
| Program `/media` and `/sponsors` | Cache under Program ID; only display in an approved programme destination or explicit section |
| Programme category | No category field in current Program DTO; omit generic Category tag or add/agree a real source |

### 12.3 Event/Program child records

| Resource / API field | Normalized frontend destination | Rules |
| --- | --- | --- |
| Media `id` | `media.id` | Stable gallery key, cache ownership |
| Media `type` | `media.kind` | Photo → image gallery; video/recap/testimonial do not automatically become photo cards |
| Media `url` | Cached media reference | Same-origin media/body endpoint appropriate to content type |
| Media `caption` | Caption / source for an approved description | Current gallery has no visible caption slot. Caption is not guaranteed to be adequate alt text; do not invent descriptive facts |
| Media `order` | Sorted gallery order | Ascending, stable ID tie-breaker |
| Sponsors `id`, `name`, `logoUrl` | `Sponsor.id/name/logo` | Sponsors component ID, visible name and cached logo |
| Sponsors `tier` | `Sponsor.tier` | Can drive an approved ordering/group rule; no tier grouping currently designed |
| Sponsors `websiteUrl` | Optional sponsor outbound destination | Current sponsor component is not clickable. Only add a link if intended; do not use it as logo URL |
| Sponsor ordering | Deterministic selector | Serializer has no `order`; source result order is not a curated sponsorship order. Agree tier/name order or add a field |
| Sessions `id/title/description/speaker/startTime/endTime/order` | Optional agenda model | No standalone agenda section in current design. An approved body renderer/section change is needed; never silently discard a requested agenda or invent a new layout |
| Form `id`, `fieldId` | `formField.id/submissionKey` | Submit under `fieldId`; use `id` only under the serializer's explicit fallback |
| Form `label`, `fieldType` | Field label and control | text/email/select/checkbox/number mapped to shared form controls; select uses app dropdown |
| Form `required`, `options`, `order` | Validation, option records and display order | Actual dashboard choices replace fixed local fields; phone need/type mapping must be explicit |

## 13. Events listing `/programs-events`

| UI item / section | Source | Frontend destination / rule |
| --- | --- | --- |
| Hero and section introductions | Local `eventsPage` | Shared hero, Upcoming Programmes and Upcoming Events headings/descriptions |
| Featured carousel | Approved featured Event selector | FeaturedContentCard title, cached image, real excerpt, type/category badges, own event URL |
| Upcoming programme cards | Future/approved active Program selector from shared `programFeed` | Programme title, description, banner, public child count, date range and agreed destination |
| Programme count label | Program `eventCount` or confirmed published-child count | Format “1 event” / “N events”; do not preserve sample “12 EVENTS” |
| Programme tags | Program data plus explicitly configured taxonomy | No supplied Program category; generic placeholders are not live data |
| All Events/Programme Events control | Shared Events + `eventType/programId` | Correct filtered subset; resolve stored-type mismatch before server filtering |
| Event search | Title, resolved programme title, category, venue and formatted date | Full shared Event query/snapshot, not only the displayed page |
| Sort | Event start timestamp | Latest/Oldest stays distinct from Content publication sorting |
| Upcoming Event cards | Upcoming Event selector | Shared EventCard mapping; clarify whether ongoing events are included, because start-based API upcoming excludes them |
| Card price | Public Event detail amount/currency | No list amount field. Avoid N repeated detail fetches across pages by shared detail caching; consider backend list projection for scale |
| Card media and summaries | Canonical Event image and approved summary | Current EventCard/FeaturedContentCard/InitiativeCard need record-image rendering support |
| Count/empty state/pagination | Selected Event dataset/query metadata | Real totals; page size configuration remains local |
| Past Event Highlights preview | Same `highlightFeed` used by Highlights hub | First approved selection of highlight IDs; View All → `/event-highlights`; no separate preview data array |

## 14. Event details `/programs-events/{slug}`

| UI item / section | Source | Frontend destination / rule |
| --- | --- | --- |
| Back link | Local label → `/programs-events` | No API fetch |
| H1 and category/programme tags | Canonical Event title/category + Program join | Correct Event record; suppress unresolved programme label rather than show arbitrary HealthWeek |
| Header date/time/location | Shared Event formatting helpers | Same values repeated below the body; no independently hardcoded dates |
| Venue outbound link | Validated mapLocation or known-venue map search | Preserve accessible new-tab label |
| Cover | Cached Event banner/poster | Current blank detail-cover panel needs actual image rendering |
| Main description | Cached `descriptionUrl` document | Shared validated body renderer; no reused blog specialty-choice paragraphs |
| Body venue/date/time | Same normalized Event fields as header | Guarantees consistency between the two locations |
| Sponsors | Event `/sponsors` | Actual names/logos/tier/order rule; hide section when empty |
| Registration heading/helper copy | Local editorial copy | May include approved event-specific instructions from a supported field later |
| Registration action variant | Fresh Event registration flags | Show appropriate single mode, not both Figma variants on every live Event |
| Built-in fields | Event `/form-fields` | Dynamic labels/keys/types/options/requiredness; use shared controls |
| Required/closed/full state | Fresh Event detail + capacity response | Hour-old editorial cache must not authorize registration |
| Free submission | `POST /v1/registrations/register` with `eventId/formData` | Tenant comes from Event. User submission and response are not cached |
| Paid submission | `POST /v1/registrations/initiate-payment` | Valid live amount, correct field mapping and checkout response; do not infer amount from a card's formatted string |
| External registration | Fresh `externalRegistrationUrl` when configured | Outbound URL, not a Storage asset to proxy/cache |
| Form success/failure | Validated API response | Confirm success only when backend confirms; preserve useful error state |
| Related upcoming Events | Same shared Event store, exclude current ID | Proposed same-program/category selection then date ordering; no self-related sample card |
| Optional agenda/session data | Event `/sessions` | No existing dedicated slot; agree whether rendered within body or a designed section |
| Metadata | Event title + approved summary/image | No Event-specific public SEO fields currently exposed |

Backend free-registration code currently lacks enforcement of some registration-required/external/deadline settings. Fresh frontend checks are necessary but are not a substitute for backend enforcement. This is a registration-integration task, not resolved by caching.

## 15. Event Highlights hub `/event-highlights`

Unlike Impact Reports, the source of Highlights is **not yet confirmed**. Do not silently define every past Event or ordinary blog post as a highlight. A complete normalized highlight may combine an explicitly selected past Event with an approved Content recap and Event-owned media. The current Content API does not expose an `eventId` relationship, so that association needs an explicit website binding or public schema addition.

| UI item / section | Proposed normalized source → destination | Gap / decision |
| --- | --- | --- |
| Hero badge/title/introduction | Local `highlightsPage.hero` | Static section copy |
| Highlight identity | Explicit approved `HighlightRecord.id` + parent IDs | Choose Event-backed, Content-backed or explicitly joined records; no dedicated Highlight endpoint currently |
| Title | Approved Event title or Content recap title | Set one canonical title; consistent with its detail page |
| Summary | Content recap `excerpt` or approved Event summary | No Event-list excerpt. Pre-event description must not automatically become a recap |
| Cover | Cached chosen Content cover/Event banner | Explicit precedence; one cover per highlight across previews/list/details |
| Programme badge | Parent Event `programId` joined to Program | Requires real Event binding for Content-backed stories |
| Category badge/filter | Agreed Event category or Content category | These are different taxonomies; define which this hub uses rather than mixing IDs/labels |
| Content Type dropdown | Normalized source/type classification | Existing local Event option is provisional; no new types fabricated |
| Venue | Parent Event `location` | Content projection has no venue field; explicit Event relation required if Content-backed |
| Visible event date | Parent Event dates | This is not automatically Content publication date |
| Latest/Oldest | Explicit `eventDate` or `publishedAt` policy | Current UI sorts sample publication dates while labels represent event dates; choose one policy |
| Search | Normalized title/summary/programme/category/venue/date labels | Shared highlight dataset/query; no independent Events preview fetch |
| Cards and href | Shared highlight selector → StoryCard highlight variant | Every card opens its own `/event-highlights/{slug}` record |
| Counts/pagination | Exact highlight subset after filters | No fake records/page counts; desktop chips/mobile Category remain shared |
| Loading/empty/error | Shared highlight feed status | API missing relation is not permission to substitute unrelated sample records |

Past Events API only returns past records still having `status='published'`; it does not expose all internally completed/archived Events. A public highlight policy must account for that. Start date in the past alone is insufficient evidence that an Event has finished.

## 16. Event Highlight details `/event-highlights/{slug}`

| UI item / section | Source → destination | Rules / gaps |
| --- | --- | --- |
| Back link and page labels | Local UI strings | Back → `/event-highlights` |
| H1/category/programme tags | Canonical HighlightRecord + parent joins | Same values as its cards; correct year/programme |
| Event date/venue/map | Bound Event dates/location/mapLocation | Exact Event relationship needed; Content category is not a venue/programme join |
| Cover | Cached chosen cover | Render actual image in existing detail panel |
| Recap body | Bound Content `contentUrl`, or explicitly approved Event recap document | Cached rich document; do not reuse pre-event invitation copy by assumption |
| Gallery photos | Event `/media` filtered to `type='photo'`, or an explicitly configured gallery | `id/url/order/caption` → PictureGallery ID/cached src/order/approved alt. Only real records; hide section when empty |
| Gallery layout | Current shared PictureGallery rules | Two small/one wide desktop, last unpaired wide, mobile stack; driven by item count |
| Video/recap/testimonial media | Preserve typed records | No current player/dedicated slot; do not render arbitrary media as broken `<img>` cards |
| Sponsors | Bound Event `/sponsors` or explicit approved source | Same sponsor records as that Event detail; dynamic count/empty hide |
| Album CTA title/description/label | Local approved gallery copy | Replace registration-related sample wording with photo-specific copy |
| View All Pictures URL | Approved per-highlight album URL | No dedicated album URL in Event or Content projection. A media item must not be guessed to be the full album |
| Other past highlights | Same shared highlight selector, excluding current ID | Correct title/excerpt/taxonomy/date/venue/href; image-overlay/below-image tag positioning stays UI configuration |
| Related report slot | Explicit related Content ID satisfying report category | Reuse report selector/entity cache. No Content-to-Event related-report relationship currently exposed |
| Metadata | Highlight title + approved summary/cover | Canonical detail route/rendering task still applies |

## 17. Leadership `/leadership`

| Dashboard/API or local item | Frontend destination / transformation | Status |
| --- | --- | --- |
| Local hero badge/headline/intro | Shared Leadership Hero | Local |
| Local group title/description | Executive council, Patrons, Committee heads headings/descriptions | Local; replace Contact-style sample descriptions |
| Executive `id` | Member identity, cache key and bio control target | API |
| `name` | ProfileCard heading | API |
| `position` | ProfileCard office/role line | API; no repeated invented President fallback |
| `imageUrl` | Cached ProfileCard portrait | API; current component already supports nullable image/failure fallback |
| `bio` | View Profile content | API; render approved plain/rich text safely. Current UI is an inline reveal, not a dedicated profile page |
| `tenureStart`, `tenureEnd` | Session selection/filtering and optional visible tenure | API; no tenure display invented where no slot exists |
| `order` | Stable member order within the agreed group | API; ID tie-breaker |
| `session` API query | Start-year session filter | API; it filters tenureStart year, not a formatted 2025/2026 academic-session label |
| Executive/patron/committee group | Correct section assignment | Gap: no group/type field in current Executive projection |
| Featured vs additional member IDs | Large initial cards vs View All list | Gap/decision: no featured flag. Use approved ID selections/configuration or add a public field; do not infer from names |
| Patron/grand patron source | Patron group records | Gap: no distinct public patron source established |
| Committee-head source/committee identity | Committee cards and titles | Gap: no distinct public committee source or relation established |
| View All/View Less | Length of featured/additional subsets | Derived UI interaction; no invented extra people to fill a grid |
| Member profile destination | Approved behaviour/configuration | Decision if separate profile pages/popups are desired; no hidden endpoint/page assumed |

If all groups are to be API-controlled, the dashboard must expose group/featured semantics or the website must hold an explicit ID-to-group configuration. Local group configuration is not permission to put fake sample members beside real API records. Missing groups need a defined empty/hidden state until approved data exists.

## 18. Contact Us `/contact`

| Data item | Frontend destination | Source / gap |
| --- | --- | --- |
| Hero badge/title/description | Contact Hero | Local approved page copy |
| Reach Out heading/description | Contact information card | Local; confirm support availability statement |
| Address text and map URL | Address channel text/link | Shared approved contact settings; no public contact-settings projection |
| Email label/address | Email channel / `mailto:` | Shared settings; reconcile contactsupport@amsul.org with footer support@amsul.org |
| WhatsApp display/international number | WhatsApp channel / `wa.me` | Shared settings; normalize URL number without altering displayed copy |
| Telephone display/international number | Phone channel / `tel:` | Shared settings; confirm official number |
| Social heading/description/handle | Social information card | Local copy/shared settings |
| Instagram/X/LinkedIn URLs | Shared SocialLinks destinations | Shared approved settings; current missing LinkedIn remains an honest unavailable state |
| Form title/help/button/response note | ContactForm card | Local; confirm response-time promise |
| Full Name/Company Name | Visitor `name` → submission payload | No response API mapping; required locally |
| Email Address | Visitor `email` | Required, validated; do not put personal submissions in content cache |
| Phone Number | Visitor `phone` | Currently optional; confirm final contract |
| Enquiry Category | Visitor chosen category ID/value | App-styled dropdown; final approved choices/routing needed |
| Subject / Message | Visitor `subject/message` | Required, trimmed validation/limits; exact payload depends on agreed service |
| Recipient/routing, success/errors | Delivery-service contract | No supported public contact submission endpoint found; dashboard Communications is not automatically a public enquiries API |
| FAQ eyebrow/title/introduction | FAQ heading | Local approved copy |
| FAQ IDs/questions/answer paragraphs/order | FaqAccordion | Local approved FAQ records; no public FAQ endpoint established |

## 19. Partnerships `/partnerships`

| Data item / section | Frontend destination | Source / rule |
| --- | --- | --- |
| Hero badge/title/introduction | Partnership Hero | Local `partnershipPage.hero` |
| Become a Partner actions | All hero/benefits/final CTA buttons | Shared Google Form URL; same as header/Home/other callouts |
| Brochure title/format/file URL | BrochureDownload | Approved local brochure reference; cached proxy if dashboard/storage-sourced; no public brochure field established |
| Impact values/labels | Shared ImpactStatistics | Approved organisation statistics, consistent scope across Home/About/Partnerships |
| Repeated tile placement | Existing `repeatFirstRow` UI configuration | A layout choice; do not invent two additional metrics |
| Benefits eyebrow/title/description | Partnership benefits introduction | Local approved copy; wording correction requires approved copy |
| Benefit ID/number/title/description/order | BenefitCard list | Local approved benefit records; numbering is explicit presentation data |
| Trusted organisations heading/description | Partners SectionHeading | Local shared copy |
| Partner ID/name/logo/website/order | PartnerGrid | Same approved central local partner directory as Home; no public general partner-directory API |
| Testimonials heading/description | Testimonial section introduction | Local approved copy |
| Testimonial ID/group label | Panel identity and tag | Local approved testimonial directory; no public testimonial feed |
| Quote/continuation | TestimonialCard blockquote | Approved exact text; continuation is optional content, not automatically repeated quote text |
| Name/position/organisation | Testimonial byline | Real approved identity/role; no Jali Africa/product-designer sample in API-driven presentation |
| Portrait/logo/alt text | Testimonial portrait and organisation mark | Approved assets; cached when dashboard-sourced. Current hardcoded Jali Africa alt text needs replacement |
| Dot selection/group ordering | Explicit testimonial groups | Shared UI interaction using approved groups; current four panels cycle sample records, not established real groupings |
| Final callout heading/description | Shared PartnershipCallout | Local copy; single partner action opens Google Form |

## 20. Shared media, cache and source-mode contract

### 20.1 Which data is cached

| Item | Intended cache behaviour | UI / upstream behaviour |
| --- | --- | --- |
| Public Content/Event/Program/Executive summaries and editorial details | 1-hour freshness default, configurable | Shared browser query cache plus Cloudflare public response cache; views read selectors |
| Content body JSON / Event description JSON | Cache through owned body endpoint | Fetch on demand; validate structure and size; body media also rewritten |
| Dashboard cover images, portraits, logos, inline media | Owned cached media endpoint | Browser receives website URL, not original Storage URL |
| Public attachment PDFs/documents | Owned cached download endpoint where supported | Preserve correct content type/download name; size/streaming/range/cacheability limits need defined handling |
| Gallery media | Cache typed public media | Photos vs videos handled distinctly; large/range media may require a different supported caching path |
| Existing bundled Figma assets/fonts/icons | Existing local/static URLs | Not unnecessarily sent through dashboard proxy |
| Registration flags/availability/price at action time | Fresh checks | Do not authorize registration/payment using a stale editorial snapshot |
| Contact/newsletter/registration/payment submissions and personal responses | Not public-content cached | Separate mutations, validated response handling |
| Google Form, map, social and sponsor website destinations | Ordinary validated outbound links | These are navigation targets, not Storage assets to proxy |

**Cache rules:**

1. Key by source mode, configured API environment, tenant, resource, record ID and query/representation; no cross-tenant or local/API cache collisions.
2. One shared query/provider per application; concurrent identical reads are deduplicated. Set retention (`gcTime`) to at least the intended reuse window, not only `staleTime`.
3. Maintain an entity store plus selectors/query membership. Home previews reuse Blog/Event records; filtered lists do not overwrite unrelated canonical entities.
4. Reuse summaries immediately; request body, full detail, gallery/sponsors or form fields only when missing and needed. Details have their own shared keys.
5. A first request, expired entry or cache eviction needs an origin fetch by the function. “Never directly from Storage” means the **browser** never bypasses the media gateway; cache misses cannot manufacture content without a source read.
6. Cloudflare edge caches are not one permanently synchronized worldwide cache. Reduce calls and deduplicate practical shared requests; do not promise exactly one upstream request globally per hour.
7. Propagate source freshness/version timestamps between edge and browser so an old edge object does not receive a second full hour of apparent freshness in the browser.
8. Refresh updates the canonical store used by all mounted consumers. Failed refresh can retain clearly stale last-good public data under an agreed bounded policy; it must not replace live records with demos.
9. Invalidate affected list/detail/body/media representations after public publish/edit/unpublish/delete/category changes. Browser invalidation must also be designed; edge purge alone does not refresh an already open tab. Target immediate takedown rules explicitly.
10. Use configured resource/record references to resolve allowed assets server-side. Do not expose an unrestricted `proxy?url=anything` endpoint or strip signed/token URL parameters from the origin fetch.
11. Cache successful public responses only with explicit rules; do not store authentication errors, payment responses, arbitrary upstream failures or private files in a public cache.

These are implementation requirements, not claims that cache invalidation or media streaming already exists. Relevant platform references: [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/), [Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/), [TanStack cache defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).

### 20.2 Proposed environment configuration

| Proposed setting | Purpose | Scope |
| --- | --- | --- |
| `NEXT_PUBLIC_DATA_SOURCE=local` or `api` | Select variable-record source | Website build setting; changing compiled frontend mode requires redeployment |
| `AMSUL_API_BASE_URL` | Configured public staging/production upstream | Pages Functions runtime setting; never a dashboard admin credential |
| `AMSUL_TENANT_ID=amsul` | Lock requests to the website's tenant | Function setting; public tenant context can be exposed by bootstrap as needed |
| `CONTENT_CACHE_TTL_SECONDS=3600` | Default public editorial freshness | Function/cache configuration; client freshness uses the same policy/timestamps |
| `IMPACT_REPORT_CATEGORY_SLUG` | Exact report Content classification | Confirmed taxonomy slug; no guessed document-ID comparison |
| Cache-invalidation secret/configuration | Authenticate change notifications | Runtime secret; separate from existing election integration |
| Partnership Google Form URL | Shared partner action | Public website setting; not sensitive |

All names are proposed. No `.env` file, secret, Function or deployment has been changed by preparing this mapping. General page copy and unsupported editorial settings remain deliberately local in API mode; that is separate from switching variable record feeds. Local and API inputs both pass through the same normalized model contract.

## 21. Metadata, UI controls and unused fields

| Item | Destination / rule |
| --- | --- |
| Source mode and freshness/version | Internal cache identity/state; optional development diagnostics, not implementation jargon displayed to normal visitors |
| Search draft, selected category/type/sort, page/per-page | Local UI state; do not mutate dashboard records |
| Result count | Exact selected dataset/query; deduplicate by canonical ID |
| Pagination arrows/numbers | Derived actual page count; preserve current approved behaviour |
| Featured labels, Report label, back/download/button labels | Local UI copy; record values determine eligibility and destination |
| Null optional image/name/date/text | Intentional defined fallback/omit state; no false personal details, fabricated photos or unrelated copy |
| Internal workflow/reviewer/scheduled/private fields | No frontend destination unless the public contract intentionally exposes a display field; never read internal Firestore records directly |
| Public fields with no current UI slot | Retain only what the model needs, document as unused; do not invent new sections or force unrelated values into visible slots |
| Tenant colour/font defaults | Optional identity metadata, not permission to redesign this site |
| File bytes/credits/alt/last-modified timestamps | Only display/use when supplied or explicitly derived from a validated response; current serializers lack several of these fields |

## 22. Decisions and concrete gaps before wiring

| Priority | Gap / decision | Affected pages |
| --- | --- | --- |
| 1 | Supply/create exact Impact Reports category and assign real posts; use its stored slug. Decide whether report records also appear in Blog | Home, Reports, Blog, related sections |
| 1 | Runtime resolution/rendering for newly published slugs; current static export cannot create them automatically | All variable detail pages |
| 1 | Shared Content rich-document renderer and cached body/media/download endpoints | Blog, Reports, Event/Highlight bodies, cards and assets |
| 1 | Add media props/rendering to existing cover panels/cards instead of merely fetching image URLs | Home, About initiatives, all listing/featured/detail covers |
| 1 | Event stable slug strategy, card excerpt source and list-price strategy | Home, About, Events listing/detail |
| 1 | Complete cache invalidation, freshness propagation and error/empty handling | All shared feeds |
| 2 | Choose Highlights source and explicit Event↔Content relation if needed; album URL source | Events preview, Highlights hub/details |
| 2 | Leadership group/featured mapping and patron/committee sources | Leadership |
| 2 | Explicit main report PDF selection and non-PDF/Slides attachment support | Reports, Blog attachments |
| 2 | Content Homepage placement: dashboard option vs central curated IDs/featured selector | Home stories/reports |
| 2 | Report initiative relation and “across N initiatives” meaning | Report hub/featured tags/detail |
| 2 | Consistent report/blog/category/type/unit taxonomy rather than hardcoded sample arrays | Content filters and badges |
| 2 | Registration mode/fields/price/capacity checks and backend rule enforcement | Event detail |
| 3 | Approved shared partner directory/statistics/history/contact/FAQ/testimonial copy and assets | Home, About, Leadership headings, Contact, Partnerships, footer |
| 3 | Contact delivery/newsletter provider and Google Form URL | Contact, footer, all partner buttons |

## 23. Implementation acceptance checklist

- [ ] Every visible record field is either mapped above, explicitly local or explicitly omitted pending data; no guessed source relationships.
- [ ] Home, listing and related-card views use the same canonical IDs and source values for title/date/venue/category/cover.
- [ ] Blog/Report shared Content feed classification uses the confirmed category slug, with real metadata labels and no private Finance data.
- [ ] Visiting Home before Blog, Blog before Home, or a bookmarked detail URL all work.
- [ ] Parallel consumers cause one shared in-flight request per equivalent cache key; detail requests occur only for missing needed data.
- [ ] No frontend request for dashboard-managed media/body/downloads goes directly to a Storage URL, including inline rich-content media.
- [ ] Cache miss, expiry, refresh failure, invalidation and source-mode changes have verified behaviour; no silent demo fallback in API mode.
- [ ] New/renamed/unpublished records have correct detail routes, aliases/404 behaviour and metadata strategy.
- [ ] Filters/search/counts/page numbers apply to the correct complete dataset/query, not a partial page masquerading as all records.
- [ ] All source images/attachments have correct empty/error states; unsupported media/files do not render as the wrong type.
- [ ] Registration uses fresh transactional checks and never reuses an hour-old snapshot to approve payment/submission.
- [ ] Existing design, shared components, mobile behaviour and hidden navigation decisions are preserved.

## 24. Inspected source references

**Website:** `src/data/*.ts`; `src/components/content-cards.tsx`, `article-content.tsx`, `profile-card.tsx`, `leadership-section.tsx`, `picture-gallery.tsx`, `sponsors.tsx`, `contact-form.tsx`, `event-registration.tsx`, `site-header.tsx`, `site-footer.tsx`; all 13 page implementations under `src/app`; `next.config.ts`.

**Dashboard:** `functions/src/api/router.ts`; public routes `blog.ts`, `events.ts`, `programs.ts`, `executives.ts`, `tenants.ts`, `registrations.ts`; `types/index.ts`; Content Create/Edit sidebars and `post-editor-shared.tsx`; Event editor and create/update handlers; supplied public website module specifications.

**Reference fetching pattern:** election-public-website `src/lib/apiClient.ts`, `queryClient.ts`, `src/app/providers.tsx`, `features/election/clientQuery.ts`, `useElection.ts`, `server/freshElections.ts`, `server/upstream.ts`, `src/app/api/elections/route.ts`. It supplies a reusable shared-query/validation/proxy pattern; its current server list fetch uses no-store and images use original URLs, so AMSUL's one-hour media-cache policy is additional implementation work.

**Interpretation:** the user's latest clarification establishes Content-category membership as the Impact Reports source. The taxonomy identity remains pending; all other unconfirmed mappings are labelled above rather than invented.
