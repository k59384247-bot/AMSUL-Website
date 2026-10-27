"use client";

import { useRef, useState, type FormEvent } from "react";
import assets from "@/data/events-assets.json";
import { eventsPage } from "@/data/events";
import { Carousel } from "./carousel";
import { FeaturedContentCard, EventCard, InitiativeCard, StoryCard } from "./content-cards";
import { ListingSearch, ListingSelect } from "./listing-controls";
import { Pagination } from "./pagination";
import { useWebsiteData, DataStatus } from "./website-data";
import { postsOf, postCard, eventCard, programCard, upcomingEvents } from "@/lib/website/selectors";
import { ButtonLink, SectionHeading } from "./ui";

export function EventListing() {
  const { feed, loading, error } = useWebsiteData();
  const events = upcomingEvents(feed);
  const content = { featured: events.filter(event => event.featured).map(event => eventCard(event, feed)), events: events.map(event => eventCard(event, feed)), programmes: feed.programs.filter(program => Date.parse(program.endDate ?? program.startDate ?? '') >= Date.now()).map(programCard), highlights: postsOf(feed, 'highlights').slice(0, 3).map(post => postCard(post, feed, 'highlights')) };
  const [eventType, setEventType] = useState("all");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);
  const grid = useRef<HTMLDivElement>(null);
  if (loading || (error && !feed.events.length)) return <DataStatus />;
  const filtered = content.events.filter(event => (eventType === "all" || event.isProgrammeEvent) && `${event.title} ${event.program || ""} ${event.category} ${event.location} ${event.date}`.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => sort === "latest" ? b.startsAt.localeCompare(a.startsAt) : a.startsAt.localeCompare(b.startsAt));
  const pageCount = Math.ceil(sorted.length / pageSize);
  const visible = sorted.slice((page - 1) * pageSize, page * pageSize);
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setQuery(draft.trim()); setPage(1); }
  function reset() { setDraft(""); setQuery(""); setEventType("all"); setPage(1); }
  function changePage(next: number) { setPage(next); grid.current?.focus({ preventScroll: true }); grid.current?.scrollIntoView({ block: "start", behavior: "instant" }); }
  return <>
    <section className="featured-events section container" data-node-id="265:2142"><Carousel label="Featured events" controls dots className="featured-carousel featured-event-carousel" arrowSrc={assets.imgPajamasArrowRight1}>{content.featured.map(event => <FeaturedContentCard key={event.id} item={event} tags={event.tags} linkLabel="Event Details" arrowSrc={assets.imgPajamasArrowRight} starSrc={assets.imgPhStarFourFill} className="featured-listing-event" kind="event" />)}</Carousel></section>
    <section className="upcoming-programmes section container" data-node-id="265:3538"><SectionHeading eyebrow="" title="Upcoming pROGRAMMeS" description={eventsPage.introduction} /><Carousel label="Upcoming programmes" controls dots className="programme-carousel" arrowSrc={assets.imgPajamasArrowRight1}>{content.programmes.map(programme => <InitiativeCard key={programme.id} title={programme.title} excerpt={programme.excerpt} coverImageUrl={programme.coverImageUrl} href={programme.href} tags={[{ label: programme.title }]} featured programme={{ count: programme.count, date: programme.date, dateIcon: assets.imgLetsIconsDateTodayDuotone }} />)}</Carousel></section>
    <section className="upcoming-events section container" data-node-id="267:3928"><SectionHeading eyebrow="" title="Upcoming EVENTS" description={eventsPage.introduction} />
      <div className="event-listing-controls"><div className="event-type-filters" role="group" aria-label="Event type">{[{ value: "all", label: "All Events" }, { value: "programme", label: "Programme Events" }].map(type => <button key={type.value} aria-pressed={eventType === type.value} onClick={() => { setEventType(type.value); setPage(1); }}>{type.label}</button>)}</div><div className="event-search-controls"><ListingSearch id="event-search" label="Search Event" placeholder="Search Event" value={draft} onChange={setDraft} onSubmit={search} icon={assets.imgSiSearchFill} /><ListingSelect label="Sort By:" value={sort} onChange={value => { setSort(value); setPage(1); }} options={[{ value: "latest", label: "Latest" }, { value: "oldest", label: "Oldest" }]} icon={assets.imgOcticonChevronDown12} className="sort-select" /></div></div>
      <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "event" : "events"} found</p>
      <div ref={grid} className="event-listing-grid" tabIndex={-1} role="region" aria-label="Upcoming events">{visible.map(event => <EventCard key={event.id} event={event} icons={{ date: assets.imgLetsIconsDateTodayDuotone, location: assets.imgDuoIconsLocation, timer: assets.imgMaskGroup }} groupMetadata />)}{visible.length === 0 && <div className="event-listing-empty"><h2>No events found</h2><p>Try another search or event type.</p><button className="button" onClick={reset}>Clear filters</button></div>}</div>
      <Pagination page={page} pageCount={pageCount} pageSize={pageSize} pageSizeOptions={[2, 4, 15]} label="Event results pagination" onPageChange={changePage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} previousIcon={assets.imgPajamasArrowRight2} nextIcon={assets.imgPajamasArrowRight3} sortIcon={assets.imgUilSort} />
    </section>
    <section className="past-event-highlights section container" data-node-id="269:5643"><h2>past Events highlights</h2><div className="event-highlights-grid">{content.highlights.map(highlight => <StoryCard key={highlight.id} story={highlight} location={{ label: highlight.location, icon: assets.imgDuoIconsLocation1 }} dateIconSrc={assets.imgLetsIconsDateTodayDuotone1} className="event-highlight-card" />)}</div><ButtonLink href="/event-highlights" arrow arrowSrc={assets.imgPajamasArrowRight4}>View All</ButtonLink></section>
  </>;
}
