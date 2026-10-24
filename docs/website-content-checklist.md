# AMSUL website — consolidated content and integration checklist

Prepared 22 October 2026. Covers the 13 implemented page types: Home, About Us, Impact Report Hub, Impact Report Details, Blog Listing, Blog Details, Events Listing, Event Details, Event Highlights, Event Highlights Details, Contact Us, Leadership and Partnerships.

The supplied page layouts and local interactions are built. The site still uses structured local sample data. Live dashboard reads, contact delivery, newsletter signup, event registration and payment processing are not connected. This document distinguishes content to supply from decisions and implementation work still required.

## Decisions already settled

- Reuse shared components, retain the supplied desktop design and adapt it for mobile.
- Use the current shared header/footer throughout; omit hero side-thumbnail strips.
- Standard report cards reveal summaries on desktop hover/keyboard focus and show summaries immediately on mobile/touch.
- Use custom app-styled dropdowns, mobile Category below Search, and pagination calculated from actual results.
- Keep Alumni Network, Constitution, Payments & Dues, Elections and Subsidiaries hidden in navbar/footer.
- Both **Partner With AMSUL** and **Become A Partner** will open the **same Google Form**, to be supplied. No separate partnership application page or application API is needed for this agreed journey. The current temporary destination has not yet been replaced.
- Highlight photos and sponsors grow/shrink with their records and hide when empty.
- Two Home panels and one About panel are reserved for future content; what fills them is still undecided.

## 1. Content and assets to provide

Supply one approved record per real item; repeated Figma cards do not require inventing extra records to fill the design. Homepage previews, listings and detail pages should reuse those records.

| Area | Required content and assets |
| --- | --- |
| Global brand and footer | Approved logo files/brand variants; confirm the AMSUL at 60 identity; official association name; footer/newsletter copy; official email, address, phone, WhatsApp and hours; Instagram/X/LinkedIn URLs; StruktHQ credit URL. |
| Home | Final hero and section headings/descriptions; approved hero photograph; verified impact figures; partner names/logos/order; real featured reports/events/stories; real milestone years/titles/descriptions; partnership introduction and benefits; decisions for the two reserved panels. |
| About Us | Final introduction, mission, vision and activity descriptions; historical facts/sources; approved statistics; purpose/speaker photograph; real chronological milestones; flagship initiative records and destinations; content for the reserved panel. |
| Impact Report Hub | Real report list; featured selection/order; final categories and assignments. Each report needs a unique ID/slug, title, summary, cover, category/initiative and publication date. |
| Impact Report Details | For each report: introduction, body sections, outcomes/metrics and sources, cover, correct year/category, public report PDF and any attachments, related report IDs. Files need approved names/formats/URLs; provide sizes where available. |
| Blog Listing | Real posts; final categories, tags, content types and units; featured selection/order. Each post needs ID/slug, matching title/excerpt, author name/avatar, publication date, cover and taxonomy assignments. |
| Blog Details | Full approved body for each post; matching introduction/byline; reading time or permission to calculate it; attributed/approved quotations; cover; relevant attachments or confirmation there are none; related post IDs. |
| Events Listing | Real upcoming events and programmes; titles, summaries, covers, category/programme relationships, featured selection/order, dates/times/timezone, venue, free/paid status, amount/currency and destination. Programme records need their date range and actual child events. |
| Event Details | Matching event description, agenda/participation information, one consistent date/time/venue, full address/map URL, cover, sponsor names/logos/order, registration mode/fields/settings and external registration URL where applicable, related event IDs. |
| Event Highlights | Actual past-event records with unique IDs/slugs, titles/summaries, covers, correct year/date/venue, category/programme/type assignments and publication dates. Identify which appear on Home or Events pages. |
| Event Highlights Details | Actual recap/outcomes; ordered photographs and captions/alt text; event cover; sponsor records; album URL; photo-specific album CTA copy; related record IDs. Supply whatever number of photos/sponsors exists. |
| Contact Us | Confirmed contact channels/map/social links; final support/response hours; real FAQ questions/answers and introduction; final enquiry categories; required fields; recipient/routing and delivery method. |
| Leadership | Current session/tenure; names, offices and ordering; featured executives; separate executive/patron/committee group assignments; correct committee names; approved portraits and biographies; section descriptions. |
| Partnerships | Shared partnership Google Form URL; final partnership copy and benefits/numbering; brochure PDF; approved organisation names/logos/order; real testimonials with exact quotes, names/roles/organisations and portraits/logos; intended testimonial grouping. |
| Launch metadata | Production domain; approved page titles/descriptions; social-sharing image(s); privacy/consent wording and destination for collecting email/enquiries/registration details. Analytics details only if analytics is wanted. |

For every photograph/logo: identify the record/section it belongs to, its desired order, any important crop/focal point, alt text or enough description to write it, and any required credit/publication permission. Existing Figma assets can be retained where approved; the missing covers, portraits and gallery slots need real assets or an explicit decision to leave them reserved.

## 2. Content contradictions needing a decision

These are current design samples, not verified AMSUL facts.

| Issue | Current mismatch | Decision needed |
| --- | --- | --- |
| Alumni count | Home/About use 10k+; Partnerships uses 5000+. | One verified total, or clearly different scopes and labels. |
| Other statistics | About includes 5,000+ students and a historical “first in Sub-Saharan Africa” claim. Partnerships repeats Alumni/Awards tiles. | Approved definitions/sources; whether repeated partnership figures are intentional. |
| History/About copy | Five Home and eight About milestones repeat “Born From God / 1966”; About introduction is duplicated. | Real history and whether introductory duplication stays. |
| Report year/body | Health Week report title says 2025; introduction says 2026; repeated body concerns Quill/Hostel Movement. | Correct year and actual report text/attachments. |
| Blog identity/body | Listing cards use a neonatal-mortality title but link to Dear Future Doctor; its introduction discusses World Hypertension Day and a later section discusses Hostel Movement. | Matching title, introduction, body, taxonomy and files for each real article. |
| Event date/time | Business Summit listing says July 1 and 10 AM–2 PM; detail header says August 1 and 9 AM–3 PM; body has July 1 and 9 AM. | One confirmed date/year/time/timezone and venue throughout. |
| Upcoming events | July/August 2026 samples are already past as of 22 October 2026. | Actual upcoming records and handling of completed events. |
| Event prices | Cards display $5000; dashboard Events contract uses NGN amounts. | Correct amount/currency, or free status. |
| Highlight date/body | Mr & Miss title says 2025; cards say July 2026; day/date labels also need correction; body discusses medical specialties. | Correct event date/year/day, programme and actual recap. |
| Taxonomy | AMSUL Games appears twice; labels such as Category, Program Name and Content Type are placeholders; named highlight filters lack assignments. | Unique category IDs/labels and real record assignments. |
| Reused copy | Event/highlight bodies, Contact FAQs, Leadership descriptions and some excerpts concern other subjects. | Approved copy for each section. |
| Testimonials and profiles | Jali Africa/product-designer endorsements and repeated Michael Ajala/President records are design samples. | Real endorsements, identities, roles, portraits and bios. |
| Contact details/promises | Contact page uses contactsupport@amsul.org; footer uses support@amsul.org. Copy promises 24/7 support and a 24–48-hour reply. | Which addresses are valid, official phone/WhatsApp, actual support hours/response promise. |
| Labels/related cards | Blog search says Search Report; article related heading says related reports; gallery description asks visitors to register; some related cards include the current item. | Correct labels and related-content selection. |
| Repeated numbering | About activities and partnership benefits repeat 03. Partnership eyebrow says “What Partner With Us”. | Confirm intentional wording/numbering or provide corrections. |

## 3. Functionality and destination decisions

- [ ] **Partnership:** provide the shared Google Form URL. Confirm public visitors can open it without an unintended access restriction.
- [ ] **Leadership profiles:** should View Profile show an inline biography, open a modal, or open a separate profile page? A separate page would need its intended design. Current controls only report missing biographies.
- [ ] **Programme cards:** should a programme open its filtered event list, a programme detail page, or an external destination? HealthWeek's programme route is currently temporary.
- [ ] **Event registration:** choose the appropriate mode per event: built-in, external, or none. The supplied detail design shows both built-in and external variants; those should not automatically represent two live registration paths for every event. Supply required fields, deadline/capacity and free/paid settings.
- [ ] **Contact delivery:** choose a service/endpoint and recipient(s); approve enquiry categories and required fields. Phone is currently optional. Nothing is sent or saved today.
- [ ] **Newsletter:** provide the chosen provider/endpoint and approved opt-in wording. Nothing is subscribed or stored today.
- [ ] **Reserved panels:** decide their content and whether they should remain visibly empty until that content arrives.
- [ ] **Highlights:** decide whether Latest/Oldest means event date or publication date.
- [ ] **Featured/related content:** identify real selections or approve automatic selection rules; avoid repeatedly linking differently named sample cards to one unrelated detail record.
- [ ] **Temporary record destinations:** replace the conference article, neonatal-mortality article, HealthWeek programme, Mr & Miss 2026 event and Business Summit 2025 highlight samples with real matching data/destinations, or remove those sample cards. Hidden member-service routes can stay deferred.

## 4. What can stay local, and what should come from the dashboard

This is a proposed ownership split, not a completed integration.

| Content | Proposed source / outstanding gap |
| --- | --- |
| General page introductions, mission/vision, history, FAQs, contact details, section headings and reserved sections | Keep in shared structured website data initially. A dashboard website-settings source can be added later if editing these without code is required. No suitable public settings contract has been established. |
| Blog posts and taxonomy | Published Content API. Map website slugs to the API's post IDs, fetch/render approved rich content and use real categories/tags/featured metadata. |
| Events and programmes | Events/Programs public API. Read fresh event settings before registration; support its free/paid/external distinctions. |
| Executives | Executives public read API. Decide how featured cards and executive/patron/committee groups map to records; current contract does not establish all those groupings/sources. |
| Impact reports | Source still to be agreed, possibly appropriately classified published Content. General Finance reports are private and are not the website's public report source. |
| Highlights and galleries | Source still to be agreed: published Content, archived Events with media, or another explicit contract. No dedicated highlights feed was established in the inspected specs. |
| Partner directory, testimonials, brochure and homepage statistics | Keep structured local data initially unless a supported public settings/module source is agreed. |
| Partnership applications | The approved external Google Form; only its URL is needed by the website. |
| Contact enquiries and newsletter | Separate chosen delivery/subscription services or explicitly supplied public endpoints; not established by the inspected module specs. |
| Media | Use approved local assets or URLs from their owning Content/Event/Executive records. The Media spec does not provide a public standalone library browsing API. |

To start integration, we need the confirmed production API base/tenant configuration and deployment readiness, the website domain/origin, published real records, and agreed mappings for the unresolved modules above. The inspected Content, Events, Executives and Media specs still flag production verification as outstanding. Their statements are reference contracts, not evidence that production services were tested in this website.

Live registration/payment requires separate acceptance checks. The Events contract documents backend enforcement limitations around external/registration-required/deadline settings for free registration; resolve or explicitly account for those before launch. Content replacement alone will not connect these services.

## 5. Suggested handover order

1. **Decisions:** Google Form URL, official contacts, verified figures, reserved panels, profile/programme destinations and intended service providers.
2. **Static copy:** one document with a section per page, marking each existing Figma paragraph “keep” or supplying its replacement. Include real history, FAQs, leadership introductions and partnership copy.
3. **Records:** a spreadsheet or dashboard records for reports, posts, events/programmes, highlights, leadership, partners and testimonials. Give each item a stable ID and link its related records/assets by that ID.
4. **Assets/files:** labelled folders for covers, portraits, logos, gallery pictures, PDFs and slides; include the brochure and album links.
5. **Integration:** agree source mappings, connect verified services, then check real content, submissions, files and error states end to end.
6. **Launch:** confirm domain/metadata and approve the final content after replacement. Current layout/local-interaction checks do not establish content accuracy or live-service readiness.

You can supply these in batches. The most useful first batch is the shared Google Form URL, official contact details, verified statistics, and a decision on the three reserved panels. There is no need to supply passwords or administrative credentials in the content handover.
