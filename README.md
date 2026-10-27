> **Content integration update:** Local fixtures are active (`NEXT_PUBLIC_WEBSITE_DATA_SOURCE=local`). See [Data integration](docs/data-integration.md) for the fixture file, API switch, Cloudflare Pages Function configuration, cache behavior and remaining submission work. Earlier sample-data descriptions below document the original Figma build; the rendered variable records now come from the shared feed.

# AMSUL Website

The public AMSUL website, with the landing, About Us, Impact Report Hub, Impact Report Details, Blog Listing, Blog Detail, Event Listing, Event Details, Event Highlights, Event Highlights Details, Contact Us, Leadership and Partnership pages supplied in Figma.

## Run locally

Requires Node.js 20.9 or later.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3001. Port 3001 avoids the dashboard's usual development port.

```sh
npm run typecheck
npm run build
npm test
```

Browser checks use Playwright Chromium. On a new machine, run `npx playwright install chromium` first.

## Working agreement

- Reproduce the Figma designs; adapt layout for mobile because no mobile frame was supplied.
- Build one page at a time. Other destinations currently show explicit temporary pages.
- Reuse the shared components below before adding any new component.
- Keep fixed institutional copy in `src/data/`. Variable content comes from the shared data layer; local dashboard-shaped fixtures are active by default.
- Keep the reserved landing-page and About Us sections empty until their content is supplied.
- Do not show hero side-thumbnail strips on any page; the user explicitly removed them.

## Shared components

| Component | Purpose |
| --- | --- |
| `SiteHeader`, `SiteFooter` | Site navigation, mobile menu, contact details and newsletter form |
| `ImpactStatistics`, `PartnerGrid` | Shared homepage/Partnership impact tiles and partner marks |
| `TestimonialCard` | Reusable testimonial panels with independent, keyboard-operable sample selection |
| `ProfileCard`, `LeadershipSection` | Shared leadership cards and expandable groups, including reserved portraits and missing-biography feedback |
| `HeroBadge` | Shared page badge, reused by the photo hero and report details |
| `FormField` | Shared labelled form controls for contact enquiries and event registration |
| `SocialLinks` | Shared social icon links and missing-profile feedback, reused in the footer and Contact Us |
| `FaqAccordion` | Accessible single-open questions with keyboard-operable controls |
| `PictureGallery` | Content-driven event photos with the supplied small/wide pattern, responsive stacking and no section for an empty list |
| `Sponsors` | Shared dynamic sponsor cards for event and highlight details |
| `DetailActionCard` | Shared white heading/action panel used by registration and event photo albums |
| `ArticleContent` | Shared rich-text sections for reports, articles and events, with optional attachments |
| `EventRegistration` | The supplied local form and external-link registration variants, with validation and missing-service feedback |
| `PlannedPage` | Shared temporary destination for pages whose designs are still pending |
| `AttachmentDownload` | Shared report/attachment download row with clear feedback when a file is missing |
| `Hero` | Landing and centered inner-page heroes, without side thumbnails |
| `HistoryTimeline` | Shared timeline with the landing and two-sided About Us variants |
| `ButtonLink`, `Icon`, `Tag`, `SectionHeading` | Shared visual primitives based on the Figma components |
| `Carousel` | Touch scrolling, keyboard scrolling, optional previous/next controls, progress and selectable slide indicators |
| `ReportCard`, `EventCard`, `StoryCard` | Repeated report, event and article cards; report hover/focus reveal on desktop and persistent details on mobile/touch; event highlight metadata |
| `FeaturedContentCard` | Shared featured report/article/event layout composed by the card components |
| `SelectControl` | Shared styled dropdown/listbox with keyboard selection, type-to-match, Escape/outside dismissal and required-field validation; no native selects |
| `CategoryFilters`, `ListingSearch`, `ListingSelect` | Shared category/search controls; mobile Category dropdown below Search; app-styled listing dropdowns |
| `BenefitCard`, `InitiativeCard` | Shared benefit boxes and featured/summary programme cards |
| `Pagination` | Shared page navigation with configurable page sizes and accessible labels |
| `PartnershipCallout` | Shared call to action with configurable copy and links on About Us, the report hub and details |
| `ReservedSection` | The approved empty content areas |

`src/app/globals.css` holds the shared Figma colour, spacing and type rules. `src/components/detail-content.css` holds the shared detail-page header, cover, typography and attachment styles. `src/components/listing.css` holds the shared featured-card, carousel indicator, filter, search and pagination styles. No UI kit or generated alternative design is used. Fonts and Figma assets are served locally.

## Content and routing

- `src/data/event-details.ts`: Event Details title/tags, date/time/venue, supplied body, sponsors, registration copy and related events.
- `src/data/contact-page.ts`: Contact Us hero, email/telephone/WhatsApp/address links, social profiles, form copy/categories and FAQ samples.
- `src/data/highlight-details.ts`: Mr & Miss AMSUL 2025 highlight, body, picture records, sponsors, album CTA and related cards.
- `src/data/event-highlights.ts`: highlight hero, the shared six sample records, category chips and provisional content-type option. Event Listing reuses its first three records.
- `src/data/events.ts`: Event Listing hero, featured event samples, programme carousel, four event records and past-event highlight samples.
- `src/data/article-details.ts`: article title, supplied body, author/date/reading time, attachments, related samples and partnership content.
- `src/data/content.ts`: shared content/file types and the repeated Figma sample paragraphs.
- `src/data/blog.ts`: blog hero, featured articles, 12 local sample posts and content-type options.
- `src/data/landing.ts`: landing-page copy, statistics, milestones, report/event/story samples and partnership benefits.
- `src/data/about.ts`: About Us copy, mission, vision, statistics, milestones, activities and flagship-initiative samples.
- `src/data/report-details.ts`: sample report detail copy, attachments, related reports and partnership content.
- `src/data/impact-reports.ts`: report hub copy, 24 sample reports, category identities and featured records.
- `src/data/partnership.ts`: Partnership hero, brochure reference, statistics, benefits, partner marks and testimonial samples.
- `src/data/leadership.ts`: Leadership hero, executive council, patrons, committee heads and exact hidden Figma sample groups.
- `src/data/site.ts`: navigation, temporary route registry, shared partnership callout, email and social label.
- `src/data/assets.json`: mapping from original design slots to local assets.
- `/about`, `/impact-reports`, `/impact-reports/amsul-health-week-2025`, `/blog`, `/blog/dear-future-doctor-it-is-okay-to-be-undecided`, `/programs-events`, `/programs-events/amsul-business-summit-2026`, `/event-highlights`, `/event-highlights/mr-miss-amsul-2025`, `/contact`, `/leadership` and `/partnerships` are real pages and are excluded from the temporary catch-all route generator. The report-details route uses `[slug]`, generates known local reports and returns 404 for unknown reports.
- `src/app/[...slug]/page.tsx`: remaining temporary destinations. Replace with real page implementations as their designs are provided. Unknown paths return 404.
- `docs/content-register.md`: living content checklist, integration mapping and unresolved questions. Extend it as each page is built; it is not the final whole-website inventory.

## Current limitations

The repeated sample content, empty media slots and prices are intentionally preserved from the design. The Health Week report, Dear Future Doctor article, Business Summit event details and Mr & Miss highlight details are implemented; other detail destinations remain temporary. The report cover is the blank design slot, and report/attachment files have not been supplied. Download buttons show file-specific unavailable feedback until real URLs are added. The newsletter validates email and reports that subscriptions are unavailable; it never claims to have subscribed anyone or sends personal information.

Later integration should use the dashboard's documented public contracts, with server-side reads where required by CORS. Do not copy dashboard credentials, private collections, service accounts or admin-only UI into this public project.

## Design reference

[Landing page in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=80-2316)

Desktop reference: 1440 × 7987. Mobile layout is an adaptation of the same content and visual system.

[About Us in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=192-1302)

About Us desktop reference: 1440 × 7247. Open http://127.0.0.1:3001/about.

[Impact Report Hub in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=212-1644)

Impact Report Hub desktop reference: 1440 × 4156. Open http://127.0.0.1:3001/impact-reports. Search, category filters, the featured carousel and pagination use local sample records. The Health Week report links open the implemented details page.

[Impact Report Details in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=236-1787)

Impact Report Details desktop reference: 1440 × 4012. Open http://127.0.0.1:3001/impact-reports/amsul-health-week-2025. The 2025/2026 year mismatch and repeated newsletter-style body copy are preserved from the design and recorded for replacement.

[Blog Listing in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=246-3185)

Blog Listing desktop reference: 1440 × 3868. Open http://127.0.0.1:3001/blog. Category, content type and text search combine; Latest/Oldest sort by publication date. All supplied sample dates are equal, so either sort preserves their stable order. The initial 12 cards and 15-per-page limit match the design; choose 6 per page to navigate both sample pages. The grid and homepage story samples now open the supplied Blog Detail page. The featured conference article remains temporary.

[Blog Detail in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=250-4369)

Blog Detail desktop reference: 1440 × 4312. Open http://127.0.0.1:3001/blog/dear-future-doctor-it-is-okay-to-be-undecided. The design’s unrelated introduction, final sample section, attachment labels and “related reports” heading are preserved and recorded in the content register. The report and article pages share their body and attachment components. Known unfinished article routes stay temporary; unknown article slugs return 404.

[Event Listing in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=265-2079)

Event Listing desktop reference: 1440 × 4484. Open http://127.0.0.1:3001/programs-events. Featured events and programmes have functional carousels. Event type and text search combine, Latest/Oldest sort by sample date, and pagination follows the local results. The initial four cards and 15-per-page limit match Figma; choose 2 per page to navigate both sample pages. Business Summit links open the implemented Event Details page. Mr & Miss highlight links open the implemented Highlight Details page. Programme and other event details remain temporary.

[Event Details in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=269-6377)

Event Details desktop reference: 1440 × 3264. Open http://127.0.0.1:3001/programs-events/amsul-business-summit-2026. The page reuses the header, footer, tags, event cards and editorial content component. Both registration cards in the frame are preserved. The built-in form validates name, email and phone locally and explicitly reports that registration is not connected; it sends and saves nothing. The external variant reports its missing link. The venue opens a Google Maps search for the supplied venue text, without inventing an address or coordinates. Known unfinished event/programme slugs show the shared temporary page; unknown event slugs return 404. Conflicting dates/hours, unrelated body copy, sponsor logos, currency and registration-mode decisions are tracked in the content register.

[Event Highlights in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=269-5685)

Event Highlights desktop reference: 1440 × 2356. Open http://127.0.0.1:3001/event-highlights. The page reuses the photo hero, header/footer, shared highlight variant of StoryCard, category/search/select controls and Pagination. Six identical records and the repeated AMSUL Games chip are preserved from Figma. Search matches the displayed title, description, tags, date and venue; it combines with category and type filters. The placeholder records have no approved category assignments, so named categories show the accessible empty state. Event is a provisional local content type; dropdown options were not provided in the frame. Latest/Oldest use the records' date and preserve their order when dates match. The default 15-per-page view shows all six supplied records; choose 3 per page to navigate both sample pages. Only page numbers backed by actual results are shown. Empty results show no page numbers. Highlight cards now lead to the implemented Mr & Miss AMSUL 2025 details page.

[Event Highlights Details in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=562-13505)

Open http://127.0.0.1:3001/event-highlights/mr-miss-amsul-2025. Original desktop reference: 1440 × 3484. The user explicitly chose the current shared site header/footer over this frame's older variants; the shared footer makes the implemented desktop page 1440 × 3608. The main content retains the original section positions and dimensions.

PictureGallery renders exactly the supplied picture records, with two small cards followed by a wide card on desktop and stacked cards on phones. A final single card fills its row. It has no fixed row count; an empty list removes its heading and section. Five null-source records preserve the frame's blank media slots for review; replace them with approved image URLs/alternative text or remove them. Sponsors likewise renders exactly its input list in automatically growing rows and hides when empty. It is reused on Event Details. The album CTA shares DetailActionCard with both registration variants and gives honest feedback until the album URL is provided. Related StoryCards support the below-image tag arrangement shown on the second card. Business Summit 2025 details remain temporary; the Health Week related report is live locally.

[Contact Us in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=451-4922)

Desktop reference: 1440 × 2584. Open http://127.0.0.1:3001/contact. Contact Us uses the shared Hero, header/footer, DetailActionCard, FormField, SocialLinks and SectionHeading. The shorter hero and contact layout follow this frame. On smaller screens the contact information and enquiry form stack, and email/phone fields become one column. FAQ buttons support mouse and keyboard, keep one answer open and allow all answers to close.

The form validates name/company, email, category, subject and a nonblank message; phone is optional and validated when filled. Its local submission handler sends/stores nothing and clearly reports that the service is not connected. The frame does not supply dropdown choices, so General enquiry, Partnerships and Programs & Events are provisional local options. Supplied email, phone, WhatsApp and address text are preserved and wired to their respective mail/call/chat/map-search destinations. No message or call is initiated automatically. LinkedIn has no supplied URL and reports that gap when clicked. The repeated eco-learn FAQ copy, 24/7 statement, response-time promise, and contact-versus-footer email difference are retained from Figma and tracked for confirmation.


[Leadership in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=455-4446)

Desktop reference: 1440 × 3668. Open http://127.0.0.1:3001/leadership. The page reuses Hero, SiteHeader, SiteFooter, SectionHeading and Icon. ProfileCard is shared across executive, patron and committee groups; LeadershipSection shares the expansion controls and layout. Existing About Us, header and footer links now open the real page.

The initial two executives, three grand patrons and six committee heads match Figma, with intentionally reserved portrait areas. View All reveals the frame's eight hidden executive cards or ten hidden patron cards; View Less collapses them. Committee heads has no hidden records in the frame, so its control confirms that all six available entries are shown. Profile controls show clear missing-biography feedback; a later profile-page design and approved biography content are still needed. Repeated Michael Ajala names, repeated President offices in the hidden executive list and contact-style section introductions are preserved as supplied. No dashboard reads are active. The Executives public contract can supply names, offices, portraits, biographies and tenure, but does not establish patron/committee groups or featured-card assignments.


[Partnership in Figma](https://www.figma.com/design/eKx1BKUazc4wdhegOWXiFo/AMSUL-x-StruktHQ?node-id=464-5496)

Desktop reference: 1440 × 5032. Open http://127.0.0.1:3001/partnerships. The page reuses Hero, BenefitCard, SectionHeading, PartnershipCallout, the shared header/footer and button styles. ImpactStatistics and PartnerGrid are extracted from the homepage and reused without changing its layout. Partnership adds the third impact row shown in this frame.

Four TestimonialCard panels retain the exact supplied quotes, portrait, cropped marks, colours and initial arrangement. Each panel's dots cycle through the four provided source samples, without inventing other endorsements. Confirm this interaction/grouping when final testimonials are supplied. The unrelated Jali Africa copy, repeated organization marks, repeated statistics, What Partner With Us eyebrow and repeated 03 benefit numbers remain as shown and are recorded in the content register. The brochure action clearly reports its missing file; set the nullable local brochure URL when supplied. Become a Partner opens the existing explicit temporary destination, pending its own design. No application is submitted and no dashboard API is active.


## Shared control behaviour

All content-type, sort, page-size and contact-category dropdowns use SelectControl. Menus use app colours, rounded borders and selected/hover states, remain within the viewport and support keyboard arrows, Home/End, typing to match, Enter/Space, Escape, Tab and outside-click dismissal. Contact category remains a required form value. Header navigation continues using the existing custom-styled menus.

Pagination renders exactly the actual result page count, recalculates after search/filter/page-size changes, and shows no page numbers for empty results. Previous/Next respect the first/last page. Rounded search/newsletter wrappers carry the focus indicator instead of their inner text inputs; standalone form fields keep a focus ring following their border radius.

## Content handover

The supplied 13 page types are built. See `docs/website-content-checklist.md` for the consolidated final content/assets checklist, unresolved sample-copy issues, service decisions and integration gaps. `docs/content-register.md` retains the section-by-section inventory. Both Partner With AMSUL and Become A Partner will use the same Google Form URL when supplied; a dedicated application page is not required.

The complete field-level integration specification is in `docs/api-to-ui-mapping.md` (25 October 2026). Impact Reports are mapped as a category-filtered view of the shared Content feed; Pages Functions and cache wiring are still implementation work.
