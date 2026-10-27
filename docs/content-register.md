> **26 October 2026 integration update:** Variable sections now use the shared feed and dashboard-shaped fictional local fixtures. Source selection, API/cache preparation and remaining fixed content are documented in [Data integration](data-integration.md). This does not make demonstration content approved for publication.

# AMSUL website: living content register

Scope: **all 13 implemented page types — Landing, About Us, Impact Report Hub, Impact Report Details, Blog Listing, Blog Detail, Event Listing, Event Details, Event Highlights, Event Highlights Details, Contact Us, Leadership and Partnerships**. The page-building phase is complete. The consolidated handover is in `website-content-checklist.md`; this register preserves the detailed section inventory and verification history.

## Confirmed decisions

- Match the supplied desktop Figma design, except for the hero side-thumbnail strip, which the user explicitly removed from all pages.
- Make it responsive without a separate mobile design.
- Reuse shared components throughout the application.
- Keep initial content in local structured data, ready to replace with normalized API results.
- Preserve the two blank landing-page sections and the blank About Us section for future content.
- Use clearly labelled temporary destinations for sample records whose matching content is not yet supplied.
- Partner With AMSUL and Become A Partner will use the same external Google Form, to be supplied. No separate partner-application page or application API is needed for this agreed journey.
- Keep Alumni Network, Constitution, Payments & Dues, Elections and Subsidiaries hidden in shared navigation.

## Landing content inventory

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Brand | AMSUL 60th anniversary logo in header and footer | Confirm the anniversary identity and when it should change |
| Hero | “MEDICINE BEYOND TIME”; “Shaping Medical Leaders. Creating Impact. Since 1966”; six-decade description; outreach photo; two calls to action | Approved copy and photo alt text/credit. No side-thumbnail strip is wanted on any page |
| Partners | Heading and description; 12 copies of the same AMSUL partner mark | Actual organization names and logo files for all slots, plus optional destinations |
| Statistics | 10k+ Alumni; 25+ Annual Events; 20+ Awards; 100+ Community Outreaches | Approved totals, definitions, supporting source and update owner |
| First reserved area | Empty panel after statistics | Content type, media or copy, and interaction if applicable |
| History | “1966 — 2026”; legacy heading and description; five identical “1966 / Born From God” milestones | Real milestone years, titles and descriptions in chronological order |
| Impact reports | Four repeated “AMSUL Health Week 2025” cards; report tag; excerpt; shared desktop hover reveal and persistent mobile details | Approved titles, summaries, cover images, publication dates, report bodies or downloadable files and their accessible labels |
| Featured event | “AMSUL HEALTHWEEK 2026”; generic Category tag; repeated report-summary copy | Actual event/program identification, category, image, correct summary and destination |
| Event cards | Three repeated “AMSUL BUSINESS SUMMIT 2026” cards; programme/category tags; July 1 dates; Old Great Hall, LUTH; 10:00AM–2:00PM; sample $5000 on two cards | Real event IDs, title, date/time/timezone, location, categories, cover media, display price/currency and registration behaviour |
| Second reserved area | Empty panel after events | Content type, media or copy, and interaction if applicable |
| Stories | Five repeated neonatal-mortality titles and excerpts; three taxonomy tags per card; Ajala Michael; July 1st, 2026; blank avatar | Actual posts, bodies, cover images, taxonomy, author/avatar, publication dates and canonical slugs/IDs |
| Partnership | Legacy heading; two introductory paragraphs; two calls to action; three repeated Health Week benefit boxes | Approved partnership value proposition and three real benefits; application/contact journey |
| Footer | @amsul_unilag, support@amsul.org, social icons, newsletter copy, StruktHQ credit and 2026 copyright | Confirm email, each individual social profile URL, credit destination and copyright policy |
| Newsletter | Email field, native email validation, explicit unavailable-service feedback | Newsletter provider/public endpoint, opt-in wording, success/error behaviour and privacy-policy destination |
| Navigation | About AMSUL, Leadership, Subsidiaries, Alumni Network, Constitution, Programs & Events, Impact Reports, Partnerships, Event Highlights, Blog & News, Contact Us, Payments & Dues, Elections | All supplied page types are built; five member-service links are hidden. Replace remaining sample destinations with matching real content; partnership actions await the shared Google Form URL |

## About Us content inventory

The About Us page is implemented at `/about` and linked through the shared header and footer. All page copy is in `src/data/about.ts`. The supplied desktop frame is 1440 × 7247, with mobile adaptations of the same content.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | About Us badge, six-decades heading and the original outreach image | Approved headline and confirmation of imagery/usage; side thumbnails remain excluded |
| Who We Are | The supplied introduction and background paragraphs, repeated twice exactly as the design shows | Confirm whether the duplication is intentional, or provide replacement copy |
| Statistics | 5,000+ medical students, 1st medical student association in Sub-Saharan Africa, 10k+ alumni | Approved values and support for the historical rank claim; update owner |
| Reserved area | Blank rounded panel after the statistics | Content type, media/copy and any interactions |
| Purpose | Original speaker photograph, mission and vision copy | Approved statements, image credit and final alternative text |
| History | Eight repeated “Born From God / 1966” milestones in a two-sided timeline | Final milestone years, headings and descriptions; no destinations were invented for the underlined sample text |
| What We Do | Five repeated Health Week cards; the design uses numbers 01, 02, 03, 03, 03 | Real activity titles, descriptions and numbering |
| Flagship Initiatives | One featured Business Summit card and three repeated summary cards; placeholder programme/category labels | Real programme IDs, copy, cover images, category labels and destinations |
| Partnership call to action | Future-leaders copy; Meet Our Leadership and Partner With AMSUL links | Approved copy; Leadership is implemented and partnership actions await the shared Google Form URL |

The mission, vision, introductory copy and statistics currently remain local editorial content. No public About-page settings API has been established from the supplied dashboard contracts. The flagship cards can later use the documented Events/Programs projections once content mapping is agreed. The dashboard is unchanged.

## Impact Report Hub content inventory

The hub is implemented at `/impact-reports`. The desktop frame is 1440 × 4156; mobile uses the same content with stacked cards and controls. Local records live in `src/data/impact-reports.ts`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | Impact Reports badge, “Measuring Progress. Documenting Impact.” headline, supplied description and shared outreach image | Approved copy and imagery; side thumbnails remain excluded |
| Featured reports | Four sample records in the shared carousel; featured/category tags, title, excerpt and View Report link; plain wine cover slots from Figma | Real featured report IDs/order, category, cover images and detail destinations |
| Categories | 12 sample initiative identities matching the chips, including two separate chips both labelled “AMSUL Games” | Approved unique category IDs and labels; confirm whether the duplicate label should change |
| Report listing | 24 local sample records; 12 visible initially; repeated Health Week title/summary and wine cover slots; shared desktop hover reveal and persistent mobile details | Real report IDs, initiative assignments, titles, summaries, covers, publication dates, slugs, bodies/PDFs and accessible file labels |
| Search and filters | Case-insensitive title/summary/initiative search, category filtering, derived result counts and a clearable empty state | Confirm final search fields and API query/pagination contract |
| Pagination | Results-per-page choices 6, 12 and 24; only page numbers backed by the current results are shown | The approved correction shows two actual pages for 24 reports at 12 per page, replacing Figma’s unused slots. Confirm final totals and default page size |
| Partnership | Shared call to action with About Us | Approved copy; Leadership is implemented and partnership actions await the shared Google Form URL |

All 24 records intentionally repeat design sample copy. Their category assignments are demonstration data, not factual classifications. Report links now open the implemented Health Week detail page. Its body is the sample copy in the details design; no final report text or PDF was supplied. No new facts, report files or live integrations were invented. Confirmed 25 October 2026: Impact Reports are published Content records selected by their assigned Content category. The exact category slug and record assignments remain pending; the inspected staging taxonomy has no Impact Report(s) label. Private Finance reports must not be used. See `api-to-ui-mapping.md` for the complete mapping.

## Impact Report Details content inventory

Implemented at `/impact-reports/amsul-health-week-2025`, using the shared `[slug]` detail template and data in `src/data/report-details.ts`. The desktop frame is 1440 × 4012; the header stays visible while scrolling. Unknown report slugs return 404.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Introduction | Back to Reports, Impact Report badge, “Health Week Impact Report 2025”, introduction referring to Health Week 2026, and Category - HealthWeek | Approved report title/year, introduction, category and canonical slug; resolve the 2025/2026 discrepancy |
| Cover | Blank dark panel from Figma, 1248 × 560 on desktop | Cover/media content and approved alternative text, or confirmation that this is intentionally reserved |
| Main download | PDF icon and Download Report action | Approved public report PDF URL, filename, file size and accessible label; currently gives file-specific unavailable feedback |
| Body | Three copies of “The List That Started It All”, each with the same seven paragraphs about AMSUL Quill and Hostel Movement 2026; headings use the three supplied sizes | Actual report sections, results, participation metrics, outcomes, sources and approved publication metadata; confirm the sample text should be replaced |
| Attachments | “AMSUL HealthWeek Proposal 2026” with PDF icon, and “HealthWeek Impact Report 2025” with Slides icon | Real files/URLs, exact names, formats, sizes and download permissions; neither file has been supplied |
| Related reports | Three Health Week sample cards using the shared responsive report layout | Real related report IDs and selection rules; all current sample cards lead to the same implemented report |
| Partnership | “Inspired by what you've seen?” copy, Become a Partner and Contact Us | Approved copy; Contact Us is implemented and Become a Partner awaits the shared Google Form URL |

No fake report or attachment was generated. Each missing-file button responds with an accessible message; when an approved URL is added, the shared attachment component exposes a normal download link. Dashboard integration and real file delivery remain untested in this local-content phase. Cross-origin file delivery may require its own download response headers when integrated.

## Blog Listing content inventory

Implemented at `/blog`, linked through the shared navigation. The desktop frame is 1440 × 3868. Local data lives in `src/data/blog.ts`; shared article cards, featured cards, category filters, search, carousel and pagination are reused.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | Stories & Insights badge, “Stories AND NEWS That Inform, Inspire and Connect.” and supplied introduction, with the shared outreach image | Approved headline, introduction, image usage and alternative text; side thumbnails remain excluded |
| Featured carousel | Four local copies of “AMSUL Hosts National Medical Conference”, report-style excerpt, Category and Content Type tags, wine cover slot and View More action | Actual featured article IDs, titles, excerpts, categories, content types, images and order |
| Categories | All categories and the same 12 initiative chips as the report hub, including two AMSUL Games labels | Approved taxonomy and distinct IDs/labels; demonstration category assignments are not factual classifications |
| Search | The design placeholder says “Search Report”; the accessible label identifies article search | Confirm whether the visible placeholder should become “Search articles”; final searchable fields and query contract |
| Content type | All Types plus Content Type, Publication and News from the card samples | Approved content types and their mapping to the Content API; Content Type is placeholder material |
| Sort | Latest/Oldest using publication dates; equal dates keep their existing order | Real publication dates; the twelve supplied samples all show July 1st, 2026, so no visual order change occurs between the two options yet |
| Article grid | 12 repeated neonatal-mortality titles with report-summary excerpts; Ajala Michael; July 1st, 2026; blank gold avatars; wine covers; generic, Publication/Research/Editorial Board, and News/Election/Electoral Committee tags | Real post IDs, title, excerpt, author, avatar, publication date, content type, category, unit, cover media, accessible text and canonical slug |
| Pagination | The supplied view has 12 cards, a 15-per-page limit and four page-number slots. Only page numbers backed by results are shown; 6/12/15 choices work, with two pages at 6 | Confirm final page size and actual post count; no extra articles were invented to fill unused page buttons |
| Article destinations | The repeated article cards and homepage story cards now open `/blog/dear-future-doctor-it-is-okay-to-be-undecided`; featured conference cards remain temporary | Reconcile the listing’s neonatal-mortality sample titles with the supplied Dear Future Doctor detail. Supply individual article IDs, slugs and matching content; the original neonatal route remains an explicit temporary page |

Category, content type and text search combine, reset pagination and expose an accessible result count and clearable empty state. Search covers title, excerpt, author and displayed tags. No live Content API connection is active. Integrate through the published Content contract later, confirming the actual taxonomy, post IDs/slugs and production origins as described below.

## Blog Detail content inventory

Implemented at `/blog/dear-future-doctor-it-is-okay-to-be-undecided`, with content in `src/data/article-details.ts`. The supplied desktop frame is 1440 × 4312. The report and article pages share their editorial text, attachment rendering, header treatment and cover styles. Existing article cards retain their design copy but lead to this supplied detail sample; the two designs currently represent different article subjects.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Introduction | Back to Stories & Insights, Category - HealthWeek and Content Type - Academic tags, Dear Future Doctor title, and World Hypertension Day introduction | Approved matching title, introduction, taxonomy and canonical article ID/slug; the introduction does not describe the specialty-choice article |
| Byline | Ajala Michael, July 1st, 2026, 5 mins. read and blank gold avatar | Approved author identity/avatar, publication date and reading time or agreed calculation |
| Cover | Blank 1248 × 560 dark media slot | Cover content, approved image/credit and alternative text, or confirmation it should remain reserved |
| First section | “Choosing a specialty isn’t a race.” and the supplied clinical-rotation narrative | Approved body copy and editorial review |
| Second section | “CLINICAL ROTATIONS AND SPECIALTY INFLUENCES DURING MEDICAL SCHOOL” and the supplied first-person quotation | Attribution/source, approval for quotation, fact-checking of statements and final article copy |
| Final section | “The List That Started It All” and the seven repeated AMSUL Quill/Hostel Movement sample paragraphs | Matching continuation of the article, or confirmation that this unrelated section should remain |
| Attachments | HealthWeek Proposal 2026 PDF and HealthWeek Impact Report 2025 Slides rows, both without files | Correct attachments for this article, public URLs/files, names, formats, sizes and accessible labels; missing-file feedback is shown on click |
| Related content | Heading “related reports”; three repeated neonatal-mortality story cards with Publication/Research/Editorial Board tags | Confirm the section label and provide actual related article IDs, matching titles/excerpts, authors, dates and images |
| Partnership | Shared “Inspired by what you've seen?” call to action | Approved copy and final partner/contact journeys |

The listing and homepage sample titles, detail headline, introduction, final section and attachments are not yet consistent with one another. They are preserved as design samples; no new article body, quote attribution, report PDF or external link was invented. The featured National Medical Conference and the former neonatal-mortality destination remain explicitly temporary. Unknown article routes return 404. Dashboard reads, final content accuracy and actual file delivery remain pending.

## Event Listing content inventory

Implemented at `/programs-events`, linked through the shared Programs & Events navigation. The supplied desktop frame is 1440 × 4484. Data lives in `src/data/events.ts`; cards, carousels, search, sort, headings and pagination reuse shared components. No live Events/Programs API reads are active.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | Programs & Events badge, “Experiences That Build Leaders.”, supplied introduction and the shared outreach photo | Approved copy and imagery; side thumbnails remain excluded |
| Featured events | Four copies of AMSUL Business Summit 2026, report-summary excerpt, Featured/Event Type/Category tags, wine media slot and Event Details link | Real featured event IDs, order, type, category, title, excerpt and cover media |
| Upcoming programmes | Four repeated HealthWeek carousel slides, NAME OF PROGRAMME/Category tags, 12 EVENTS, 1st November–14th November 2026 and repeated report copy | Approved programme ID/name, category, date range/timezone, actual child-event count, excerpt, image and destination |
| Upcoming events | Four Business Summit sample cards; first PROGRAMME/Category, two Entrepreneurship-only, last AMSUL HEALTHWEEK/Entrepreneurship; July 1, 2026, Old Great Hall, LUTH, 10:00AM–2:00PM and $5000 | Published event records, correct programme links/type, fresh dates/timezone, registration settings, venue, description and pricing/currency |
| Event type/search/sort | All Events and Programme Events combine with title/programme/category/venue/date search; Latest/Oldest sort the sample start dates | Confirm final filter/search fields, date sorting semantics and API query contract; all sample event dates are equal, so either sort preserves their order |
| Pagination | Four supplied cards with 15 selected per page and four number slots; only page numbers backed by results are shown; 2/4/15 page-size choices work | Confirm final page size and actual event count; no extra event records were invented to fill unused pages |
| Past highlights | Three MR & MISS AMSUL 2025 cards; Program Name/Category tags, wine covers, report-summary copy, Old Great Hall, LUTH and July 1st, 2026 | Real highlights and their IDs, title/year, summary, cover/media, programme/category, venue, date and detail destination |
| Destinations | Business Summit and HealthWeek link to existing planned detail pages; highlight cards link to `/event-highlights/mr-miss-amsul-2025`; View All opens `/event-highlights` | Event, programme, highlight-hub and highlight-detail designs/content as those pages are built |

The July 2026 events are already past on October 22, 2026, despite the Upcoming Events heading. Programme dates in November remain as supplied. Highlight titles say 2025 but their date labels say July 2026. The displayed $5000 also remains inconsistent with the Events contract's NGN pricing convention. These samples are preserved for design review, not treated as verified upcoming events or registration offers. Search, empty-state reset, event-type filtering, date sort, pagination and both carousels work locally; no checkout, registration or live dashboard behaviour is implemented here.

## Event Details content inventory

Figma node `269:6377`; desktop reference 1440 × 3264. Implemented at `/programs-events/amsul-business-summit-2026`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Heading and taxonomy | AMSUL BUSINESS SUMMIT 2026; Category - Business; PROGRAMME - HealthWeek | Approved event ID/slug, real category and programme association |
| Hero metadata | Saturday, August 1; 9:00 AM - 3:00 PM; Old Great Hall, LUTH | Confirm the year, date, time, timezone and venue. Listing cards say July 1, 2026 / 10:00AM - 2:00PM, while the body says July 1st, 2026 / 9:00 AM; all literal samples are preserved |
| Venue link | Google Maps search for the displayed venue text | Approved venue address and canonical map URL; no address or coordinates were guessed |
| Cover | Empty rounded dark cover from Figma | Approved image/media, descriptive alternative text and credit |
| Body | Clinical rotations, specialty choices and Hostel Movement sample paragraphs | Approved event description, agenda and participation details. The sample's desktop line break before “2026.” is preserved for visual fidelity |
| Body metadata | Old Great Hall, LUTH; July 1st, 2026; 9:00 AM | One consistent confirmed event date/time/venue across listing, intro and body |
| Sponsors | Six repeated AMSUL marks, labelled Lagos State Govt., Dobic Health, MobiHealth, then three Lagos State Govt. entries | Real sponsor names, authorized marks, ordering and optional links |
| Built-in registration | Name / Email Address / Phone Number fields; sample placeholders; Register button | Confirm required fields, privacy text, consent requirements, success/error copy and live public registration contract. Local validation works, but nothing is sent, persisted or reported as registered |
| External registration | Second Registration card with outbound-icon button, as visible in the frame | Real approved external URL and confirmation of which registration mode applies. Until supplied the button gives explicit missing-link feedback |
| Registration mode | Both variants visible, matching the supplied frame | Decide whether these are alternative design states. Later choose the current Event's built-in/external/no-registration mode from fresh detail data; never call a built-in endpoint for an external event |
| Related events | MR & MISS AMSUL 2026 and AMSUL BUSINESS SUMMIT 2026; programme/category tags; sample July dates, venue, 10:00AM - 2:00PM and $5000 | Approved related event records, genuinely upcoming dates, price/currency and cover media; the current event being related to itself is preserved as shown. The Mr & Miss destination remains explicitly temporary |

Dashboard integration remains deferred. The Events spec provides event detail, dynamic form fields, sponsors and registration/payment decisions. Before live registration, fetch fresh published event detail and apply external-registration, registration-required, deadline, capacity and free/paid settings. Free registration and paid checkout use different endpoints; an unavailable paid amount must not start checkout. No dashboard configuration or data was changed.

## Event Highlights content inventory

Figma node `269:5685`; desktop reference 1440 × 2356. Implemented at `/event-highlights`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | EVENT HIGHLIGHTS badge/title, existing outreach image, and news/community description from Figma | Approved highlight-specific introduction if the reused news copy is a placeholder; image credit and alternative text where meaningful |
| Category filters | All categories; HealthWeek; AMSUL Games; IWD; Election; Academic; Quiz Club; Freshers’ Week; Community Outreach; Create Club; Senate; Editorial Board; AMSUL Games again | Confirm taxonomy IDs, whether the duplicate Games entry should remain, and actual assignments for each highlight. The sample tags only say Program Name / Category, so no associations were fabricated; named filters currently return the empty state |
| Search | Search Event field and Search button; searches title, summary, displayed tags, date and venue | Confirm final search fields and whether this should later use an API query |
| Content type | All Types default; provisional local Event option | Approved type names and IDs. The design supplies only the collapsed default; Event is a local assumption, not a confirmed dashboard taxonomy |
| Sorting | Latest / Oldest by sample date | Confirm event date versus publication date. All supplied samples are July 1st, 2026, so their relative order is stable |
| Cards | Six copies of MR & MISS AMSUL 2025; Program Name / Category tags; repeated report-summary text; Old Great Hall, LUTH; July 1st, 2026; blank wine covers | Six approved records: IDs/slugs, titles, summaries, programme/category/type assignments, correct event/publication dates, venue, cover media and alt text/credit. Resolve the title's 2025 versus date's 2026 mismatch |
| Pagination | Results per page defaults to 15; Previous/Next and only the actual result page numbers | Real total and dataset. The six supplied samples remain six records; pages without results are omitted. Choosing 3 per page shows two local pages |
| Destinations | All six cards open the implemented `/event-highlights/mr-miss-amsul-2025` details page | Approved body/gallery/media and distinct final destinations |
| Shared listing preview | Event Listing uses the same source for its first three highlight cards | Keep shared cards/content consistent when replacing samples |

No dashboard connection is active. Confirm whether highlight stories are published Content records, archived Events with media, or another approved source. The Content public contract exposes taxonomy and rich content; the Events contract exposes published Events and parent-scoped media, but neither inspected contract establishes a dedicated highlights listing endpoint. Do not assume a private module or browse the Media Library directly.

## Event Highlights Details content inventory

Figma node `562:13505`; original desktop frame 1440 × 3484. Implemented at `/event-highlights/mr-miss-amsul-2025`.

The user explicitly confirmed using the current shared site header and footer. This replaces the frame's older circular logo/Careers navigation and business-newsletter/©2025 footer. The main Figma content geometry is preserved; the approved shared footer makes the desktop page 1440 × 3608.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Heading and taxonomy | MR & MISS AMSUL 2025; Category - Social; PROGRAMME - HealthWeek | Approved event ID/slug, social category and actual programme association. The listing's placeholder categories remain unassigned |
| Date and venue | Saturday, July 1st; Old Great Hall, LUTH; map search for the displayed venue | Confirm the exact date/year/day/timezone and approved venue/map URL. Related and listing cards say July 1st, 2026 while the title says 2025 |
| Cover | Empty dark cover from Figma | Approved hero media, descriptive alternative text and credit |
| Body | Clinical rotations and specialty-choice sample text from Figma | Actual event recap, outcomes and story copy |
| Pictures | Five blank media records shown in Figma; two small, one wide, then two small | Real ordered photographs, unique IDs, safe image URLs, alt text, credits and publication permission. Null-source sample records preserve the review layout, not real photos. Add/remove records to change the card count; an empty list hides the entire section. No fixed rows or extra cards are generated |
| Responsive picture layout | Repeating two-small/one-wide pattern; an unpaired last card fills its row; single-column phones | Confirm any desired ordering/crop for final media; a wide/portrait focal crop is not specified in the frame |
| Sponsors | Six repeated AMSUL marks labelled Lagos State Govt., Dobic Health, MobiHealth, then Lagos State Govt. three times | Actual sponsor records/names/logos and ordering. The shared section grows/shrinks by list length and disappears when empty; no filler cards or fixed section height |
| Photo-album CTA | Event pictures; View All Pictures; supplied “To join the event, please register below.” copy | Real album URL and corrected photo-specific description if the registration text is a placeholder. The local button reports the missing link without redirecting or claiming an album exists |
| Related content | MR & MISS AMSUL 2025 with image-overlay tags; BUSINESS SUMMIT 2025 with tags below its image; AMSUL Health Week 2025 report using the shared responsive report layout | Approved related records, dates, taxonomies and cover media; the self-related card and report among past events are preserved as shown. Business Summit 2025 is a clearly temporary destination |

Dynamic rendering was checked with 0, 1, 2, 3, 4, 5, 8 and 11 pictures and with 0, 1, 2, 4, 6, 9 and 10 sponsors. Actual image records were also exercised in the rendering checks. The page body has no fixed height; whichever column is longer determines its height. Dashboard integration and the final highlight source remain deferred as described above.

## Contact Us content inventory

Figma node `451:4922`; desktop reference 1440 × 2584. Implemented at `/contact`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | CONTACT US; Let’s Start a Conversation; supplied audience description; shared outreach photo | Confirm approved introduction and image credit |
| Reach out introduction | Supplied burning-question/assistance copy and 24/7 availability statement | Confirm whether support is actually available around the clock |
| Address | College of Medicine, University of Lagos, Idiaraba, Lagos State; Google Maps search using that exact text | Approved full address and canonical map destination; no coordinates or additional address details were guessed |
| Email | contactsupport@amsul.org in Contact Us; support@amsul.org in the shared footer | Confirm which addresses are valid and whether both should remain |
| WhatsApp | +234-810-079-5517, linked to the corresponding WhatsApp number | Confirm account ownership, public use and availability |
| Telephone | +234-810-011-2345, linked to a telephone action | Confirm the public phone number and operating hours |
| Social profiles | @amsul_unilag; Instagram and X use the existing handle-based destinations; LinkedIn reports its missing URL | Approved profile URLs, especially LinkedIn. No LinkedIn destination was invented |
| Enquiry fields | Full Name/Company Name, Email Address, Phone Number, Enquiry Category, Subject, Message; all supplied placeholders and Send Message | Confirm required/optional fields, limits, privacy/consent copy and approved categories. Current local assumption: phone is optional; name, email, category, subject and nonblank message are required |
| Category choices | Placeholder Select a category; provisional General enquiry / Partnerships / Programs & Events choices | Final category labels/IDs and routing rules. Only the placeholder is designed in Figma |
| Submission and response copy | “You’ll get a response to your enquiry within 24-48hrs.” is preserved; submit validates and shows explicit unavailable-service feedback | Public contact/enquiry endpoint or delivery service, recipient/routing, spam protection, success/failure wording, data retention/privacy requirements and confirmed response-time promise. Nothing is sent or persisted in the local-content phase |
| FAQ heading/intro | FAQs; FREQUENTLY ASKED QUESTIONS; repeated report-summary introduction | Approved FAQ-specific introduction if the report copy is a placeholder |
| FAQ questions and answers | Can organizations partner with AMSUL? initially expanded; three repeated What is the project about? questions; each has the component's eco-learn answer sample | Real unique questions/answers. The first answer currently concerns climate education rather than AMSUL partnerships. The repeated sample copy remains as supplied; the accordion works with mouse and keyboard |
| Navigation | Shared header/footer, existing Contact Us links and footer LinkedIn-contact shortcut now open this real page | Confirm any later dedicated support/contact journeys |

The inspected public website specs do not establish a Contact Us enquiry submission endpoint or public contact-settings source. This page does not reuse election contact fields or registration/payment writes. Confirm its own public contract during the later dashboard-integration phase. Dashboard files and data were not changed.

## Leadership content inventory

Figma node `455:4446`; desktop reference 1440 × 3668. Implemented at `/leadership`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | LEADERSHIP; Leadership Rooted in Service and Excellence; supplied three-line introduction; exact shared outreach photo | Confirm approved introduction and photo credit |
| Executive council | Two featured Michael Ajala cards: President and Vice President; eight hidden Michael Ajala / President cards taken from Figma | Real names, unique IDs, correct offices, order, featured assignments, portraits/alt text, tenure/session and biography content. Repeated President entries are preserved samples, not claims about the actual council |
| Patrons | Three Michael Ajala / Grand Patron cards; ten hidden Michael Ajala / Patron cards | Actual grand patron/patron identities, roles, order and approved portraits. Figma supplies no profile actions on these cards |
| Committee heads | Six Michael Ajala cards with Senate President, Senate Vice President, Quiz Club President, Debate Club President, Editorial Board President and Create Club President | Actual names and correct committee/club titles, order, portraits and biographies; confirm whether Senate roles belong in this group and whether Create Club is the intended title |
| Section descriptions | All three repeat the burning-question/24/7 support copy from Contact Us | Approved leadership-specific descriptions and confirmation of the 24/7 statement |
| Portraits | Empty wine-coloured slots intentionally match the design; no stock/fabricated headshots | Approved image URLs, usage permissions and meaningful alternative text. ProfileCard accepts a nullable image and falls back to the reserved portrait area if loading fails |
| View All | Executive and patron controls reveal the exact hidden source cards and collapse with View Less; committee control confirms all six supplied records are already shown | Additional committee records if intended, any page-size/session rules, and whether future View All should remain an expansion or use a dedicated directory route |
| View Profile | Keyboard-operable controls open/close an honest missing-biography message | Profile-page design/destination and approved biography content; no invented biography, social link or extra profile route has been added |
| Navigation | Existing shared header/footer and About Us leadership links open this implemented page | Confirm any later individual-profile paths when those designs are supplied |

`Executives-Public-Website-Spec.md` documents read-only list/detail endpoints with name, position, nullable imageUrl/bio, tenureStart/tenureEnd and order. A session filter uses the start year. It does not document a department, group/type or featured-card field, nor establish separate patrons/committee sources. Agree how these three website groups and featured cards map to dashboard records during integration. Production API/tenant values remain unverified. No API calls, dashboard changes or writes were made for this page.

## Partnership content inventory

Figma node `464:5496`; desktop reference 1440 × 5032. Implemented at `/partnerships`.

| Area | Currently represented | Needed for final content |
| --- | --- | --- |
| Hero | PARTNERSHIPS; Building Partnerships That Create Lasting Impact.; supplied sixty-year collaboration introduction and shared outreach photo | Approved final introduction and photo credit |
| Actions | Become a Partner / Become A Partner links in hero, benefits and final callout; Download Partnership Brochure | Shared Google Form URL for both Partner With AMSUL and Become A Partner. The existing `/partnerships/become-a-partner` destination remains temporary until that URL is supplied; no separate application page is needed. Approved brochure PDF/URL, version/date, accessibility and file size; the current button reports the missing file without starting a fake download |
| Impact tiles | 5000+ Alumni, 25+ Annual Events, 20+ Awards, 100+ Community Outreaches; the bottom row repeats Alumni and Awards exactly as shown | Verified counts, definitions, reporting period and whether repeated tiles are intentional. These use the shared ImpactStatistics component and retain all six coloured tiles |
| Benefits introduction | What Partner With Us; Why Organizations Choose AMSUL; supplied sponsorship/healthcare introduction | Confirm the eyebrow wording, preserved verbatim from Figma |
| Five benefit cards | Access to Healthcare Professionals; Strengthen Brand Visibility; Showcase your Product & Services; Build Long-Term Relationships; Demonstrate Social Impact; supplied descriptions and numbers 01, 02, 03, 03, 03 | Approved descriptions, punctuation/capitalisation and numbering; repeated 03 values remain as supplied |
| Trusted organizations | Partners; Trusted By Leading Organizations; supplied collaboration summary; twelve repetitions of the same sample organization mark | Real organization names, approved logo files/usage permission, order and any outbound URLs. No twelve distinct partner identities were invented |
| Testimonials heading | Testimonials; Hear from Clients we’ve helped tell their Stories | Approved AMSUL-specific heading if this is template copy |
| Testimonial panels | Finding Story X, Public Speaking, Jali Advanced, Founder X; repeated Jali Africa quotations and continuations; Ajala Michael / Product Designer, ET on all four; exact supplied portrait and cropped light/dark Jali Africa marks | Real AMSUL partner endorsements, permission to publish, names/roles/organizations, portraits, logo credits and exact quote text. These are design samples, not verified AMSUL endorsements |
| Testimonial interaction | Four independently controlled panels. Dots cycle through the four supplied source samples, starting with each panel's own Figma content. Keyboard selection and live content updates work | Confirm intended grouping/slide sets; no additional quotes or people were invented. Final data can replace the local sample list |
| Callout | Shared Building the Next Generation of Healthcare Leaders copy with the single Become A Partner action shown in the frame | Confirm final campaign copy and application journey |
| Navigation | Existing homepage View More Details, header Our Work → Partnerships and footer Partnerships open the real page | Confirm any later individual partnership/case-study paths |

No dedicated public partnership-settings, partner-directory, testimonial or brochure contract is established by the inspected public website specs. Keep these structured local records until their intended source is agreed. Partnership applications will use the same external Google Form for both CTA labels; only its approved public URL is outstanding, rather than a new application page or submission API. No dashboard code, data or API configuration was changed.

## Remaining content and integration gaps

1. The two landing-page reserved panels and the About Us reserved panel intentionally remain empty. Their final content is unknown.
2. Hero side-thumbnail strips are intentionally removed from the website at the user’s request; do not add them to future pages.
3. Partner marks, all five history milestones, report cards, story cards and partnership benefits contain repeated placeholder material.
4. The design's “upcoming” event samples are dated July 1, 2026, which is already past as of October 20, 2026. Keep the design samples for review, then supply genuinely upcoming events before launch.
5. The design uses `$5000`; the Events public API specifies NGN amounts. Preserve the design during this phase, then resolve currency and formatting before live registration.
6. “Impact Reports” uses the Content API and the approved Content category, as confirmed by the user on 25 October 2026. Supply/create its exact category slug and assign the real report records. The Finance contract keeps financial reports private.
7. Instagram and X URLs currently follow the displayed @amsul_unilag handle and need confirmation. No LinkedIn URL was supplied; its icon points to Contact Us until an approved profile is provided. Confirm the StruktHQ credit link too.
8. Temporary pages show their planned name and a return-home action; they do not pretend the real page is complete. Internal routes can be refined as page requirements become known.
9. Newsletter signup has no backend. The form does not collect/store emails or report a false subscription.
10. Homepage SEO text is initial copy; final social sharing imagery, canonical production domain and metadata should be supplied before launch.

## Later dashboard integration

Documents were read as reference contracts, not instructions to deploy or change the dashboard. No dashboard code or data was changed, and no API calls are active in this website.

| Website area | Documented integration path / remaining decision |
| --- | --- |
| Leadership | `Executives-Public-Website-Spec.md`: public list/detail for names, positions, portraits, bios, tenure and order. Group assignments (executive/patron/committee), featured records and non-executive sources remain undecided. |
| Blog and stories | `Content-Public-Website-Spec.md`: published posts and taxonomy; `featured=true` and `displaySection=homepage` are available. Confirm the actual taxonomy values. The detail endpoint uses post ID even when the website uses a slug. Fetch rich content separately and validate/sanitize it. |
| Programs and events | `Events-Public-Website-Spec.md`: published Events and Programs with homepage/featured metadata. Registration must use fresh Event detail and honour external-registration, registration-required and payment settings. |
| Media | `Media-Public-Website-Spec.md`: consume media URLs from their owning module. There is no public standalone Media Library browsing API. No direct Storage/Firestore browsing is assumed. |
| Impact reports | Confirmed: published Content API records filtered by their Impact Reports category. Configure the exact stored category slug (the Content editor stores slugs), report assignments and primary-download selection. General Finance reports are private. |
| Payments and dues | A later Payments page must follow `Payments-Public-Website-Spec.md`; Finance points to that dedicated contract. It is separate from the existing Event registration checkout. |
| Partnership, brochure and testimonials | No established public partnership or testimonial content source. Keep `src/data/partnership.ts` local until the source, approved endorsements and brochure file are provided. Applications will use the approved shared Google Form journey; its URL is pending. |
| Hero, partners, statistics, milestones and partnership benefits | No public homepage-settings contract has been established from the inspected specs. Retain local content until the intended source is confirmed. |

The Content, Events and Media specs list verified staging values and unverified production values. Integration should verify production manifests and allowed origins when that phase starts. Use server-side public reads for an independent domain as the contracts require. No dashboard login, Firebase admin secret, or service account belongs in the public frontend.

## Approved shared control corrections

The user approved replacing every native select with an app-styled dropdown, showing only actual result page numbers, and removing the rectangular inner focus outline from input fields. The shared SelectControl now supplies listing type/sort/page-size choices and the contact enquiry category, including keyboard selection, type-to-match, Escape/outside dismissal and viewport-aware menus. Native email/text validation remains in place; category is still required. No dropdown options or sample content changed.

Pagination now recalculates from the filtered result count: no artificial four-page minimum and no numbered pages when results are empty. Search/newsletter focus appears around the rounded outer field, and standalone inputs/textareas keep a focus ring following their own border radius. This approved correction supersedes the frame's unused pagination slots.

## Approved responsive card and filter corrections

All standard ReportCard instances now start with the cover, Report tag and title on desktops with a fine pointer. Hover or keyboard focus animates the summary into view and reduces the cover area without changing the card size. Phones and touch devices show the summary immediately. Reduced-motion preferences disable the animation. This replaces per-record collapsed flags across the homepage, report hub, report details and highlight details. The separate featured-report banner retains its own layout.

The shared mobile impact grid preserves the alternating coloured/empty pattern: Community Outreaches is one tile lower than Awards, with centred labels constrained inside each tile. This applies to the homepage and partnership page.

The shared CategoryFilters control keeps chips on desktop and uses the existing app-styled dropdown on mobile. On the report hub, blog and highlights listings, mobile Search comes first, followed by Category and then the other filters or result count. Both presentations share the same filter state and reset pagination after a selection.

## Approved navigation visibility

Alumni Network, Constitution, Payments & Dues, Elections and Subsidiaries are hidden from the shared desktop/mobile navbar and footer while their pages are unfinished. Their registered placeholder routes remain available directly. Partner With AMSUL and Become A Partner are confirmed to use the same Google Form once its URL is supplied; the current temporary destination is not a request for another page design. All remaining footer page links lead to implemented pages.

## Verification record

- Production build and strict TypeScript checking.
- Shared report hover/focus and return animation across all four uses; persistent phone/touch summaries; reduced motion; staggered mobile impact tiles and centred labels; custom mobile category selection, search/filter order and menu bounds at 390px and 320px.
- Browser smoke tests at 1440, 1024, 768, 390 and 320 CSS pixels.
- No page-level horizontal overflow, broken images or browser runtime errors in those checks.
- Mobile navigation, Escape handling, temporary routes and all internal link targets.
- Event and featured-report carousel controls, slide indicators and impact anchor navigation.
- Report search, category filtering, empty-state reset, result counts, pagination and page-size changes.
- Partnership desktop section/card geometry, 320–1440px layouts, all four testimonial panel selectors, missing-brochure feedback, partner CTA/temporary destination and homepage/footer navigation; shared homepage impact/partner appearance.
- Leadership desktop section/card geometry, responsive 320–1440px layouts, hidden executive/patron expansion and collapse, all-shown committee feedback, missing-biography toggles, and About/header/footer navigation.
- Contact Us desktop section/card geometry; 320–1440px layouts; required/invalid/valid enquiry inputs including blank text and optional phone; no enquiry POST; retained form values and clear service feedback; keyboard/mouse FAQ toggles; contact route and mail/telephone/WhatsApp/map/social destinations; missing LinkedIn feedback.
- Event Highlights Details desktop main-section geometry; approved shared header/footer; 320–1440px layouts; content-driven photo/sponsor counts including empty/single/odd/larger lists; real-image rendering; album missing-link feedback; listing/back/map/related/report navigation, temporary Business Summit 2025 and unknown-highlight 404s.
- Event Highlights desktop section geometry and 400 × 424 cards; 320–1440px layouts; combined search/type/category state, empty/reset states, duplicate category buttons, stable equal-date sorting, page-size changes/pagination/focus, listing/footer navigation, implemented highlight detail links and unknown-highlight 404s.
- Event Details desktop section geometry; 320–1440px layouts; local required/invalid/valid field validation; missing external-link feedback; no registration POST; listing/back/related/venue links; planned programme/event destinations and unknown-event 404s.
- Event Listing desktop section geometry; 320–1440px layouts; featured/programme carousels; combined event-type/search filters; empty-state reset; sorting, pagination, planned detail routes and highlight navigation.
- Article desktop section geometry; 320–1440px layouts; listing/homepage/back/related/partnership navigation; missing attachment feedback; temporary conference destination and unknown-article 404s.
- Blog desktop section geometry; 320–1440px layouts; combined category/type/search filters; empty-state reset; stable sorting of equal dates; page-size changes, pagination, featured carousel and temporary article links.
- Detail-page desktop section geometry, sticky header, 320–1440px layouts, back/report/partnership navigation, unknown-report 404s and file-specific missing-download feedback.
- Hub desktop section geometry matches the supplied frame; shared landing/About appearance checked after component reuse.
- Newsletter email validation and honest unavailable-service feedback.
- Visual comparison against the Figma screenshot, exact supplied image assets, local fonts, desktop section positions and responsive layout.

Live API behaviour, real newsletter delivery, payment processing and final content accuracy are outside this local-content phase.

## Complete API-to-UI mapping — 25 October 2026

`api-to-ui-mapping.md` covers all 13 page types, shared feeds, individual public fields, media/body/file handling, local-only copy, derived values, gaps and cache/source-mode requirements. This is a specification; Pages Functions, shared API feeds, the media gateway and local/API switch have not yet been wired into AMSUL-Website.
