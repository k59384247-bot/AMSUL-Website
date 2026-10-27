"use client";

import { useRef, useState, type FormEvent } from "react";
import assets from "@/data/highlights-assets.json";

import { StoryCard } from "./content-cards";
import { CategoryFilters, ListingSearch, ListingSelect } from "./listing-controls";
import { Pagination } from "./pagination";
import { useWebsiteData, DataStatus } from "./website-data";
import { postsOf, postCard, eventCard, programCard, upcomingEvents } from "@/lib/website/selectors";

export function HighlightsListing() {
  const { feed, loading, error } = useWebsiteData();
  const eventHighlights = postsOf(feed, 'highlights').map(post => postCard(post, feed, 'highlights'));
  const highlightCategories = feed.categories.filter(category => eventHighlights.some(post => post.categoryIds.includes(category.slug))).map(category => ({ id: category.slug, name: category.name }));
  const highlightContentTypes = [...new Set(eventHighlights.map(post => post.contentType).filter(Boolean))];
  const [category, setCategory] = useState("all");
  const categories = [{ id: "all", name: "All categories" }, ...highlightCategories];
  const [contentType, setContentType] = useState("all");
  const [sort, setSort] = useState("latest");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const grid = useRef<HTMLDivElement>(null);
  if (loading || (error && !eventHighlights.length)) return <DataStatus />;
  const filtered = eventHighlights.filter(highlight => (category === "all" || highlight.categoryIds.includes(category)) && (contentType === "all" || highlight.contentType === contentType) && `${highlight.title} ${highlight.excerpt} ${highlight.location} ${highlight.date} ${highlight.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => sort === "latest" ? b.publishedAt.localeCompare(a.publishedAt) : a.publishedAt.localeCompare(b.publishedAt));
  const visible = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(sorted.length / pageSize);
  function changeCategory(value: string) { setCategory(value); setPage(1); }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setQuery(draft.trim()); setPage(1); }
  function reset() { setDraft(""); setQuery(""); setCategory("all"); setContentType("all"); setPage(1); }
  function changePage(next: number) { setPage(next); grid.current?.focus({ preventScroll: true }); grid.current?.scrollIntoView({ block: "start", behavior: "instant" }); }
  return <section className="highlights-listing section container" data-node-id="269:5748">
    <div className="highlights-filters listing-filter-controls"><CategoryFilters id="highlight-category-label" items={categories} value={category} onChange={changeCategory} />
      <div className="highlights-search-row listing-filter-search-row"><ListingSearch id="highlight-search" label="Search Event" placeholder="Search Event" value={draft} onChange={setDraft} onSubmit={search} icon={assets.imgSiSearchFill} /><CategoryFilters mobile id="highlight-category-label-mobile" items={categories} value={category} onChange={changeCategory} />
        <ListingSelect label="Content Type:" value={contentType} onChange={value => { setContentType(value); setPage(1); }} options={[{ value: "all", label: "All Types" }, ...highlightContentTypes.map(type => ({ value: type, label: type }))]} icon={assets.imgOcticonChevronDown12} />
        <ListingSelect label="Sort By:" value={sort} onChange={value => { setSort(value); setPage(1); }} options={[{ value: "latest", label: "Latest" }, { value: "oldest", label: "Oldest" }]} icon={assets.imgOcticonChevronDown12} className="sort-select" />
      </div>
    </div>
    <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "highlight" : "highlights"} found</p>
    <div ref={grid} className="highlights-grid" role="region" aria-label="Event highlights" tabIndex={-1} data-node-id="269:5838">{visible.map(highlight => <StoryCard key={highlight.id} story={highlight} location={{ label: highlight.location, icon: assets.imgDuoIconsLocation }} dateIconSrc={assets.imgLetsIconsDateTodayDuotone} className="event-highlight-card" />)}{visible.length === 0 && <div className="highlights-empty"><h2>No highlights found</h2><p>Try another search, category or content type.</p><button className="button" onClick={reset}>Clear filters</button></div>}</div>
    <Pagination page={page} pageCount={pageCount} pageSize={pageSize} pageSizeOptions={[3, 6, 15]} label="Highlight results pagination" onPageChange={changePage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} previousIcon={assets.imgPajamasArrowRight} nextIcon={assets.imgPajamasArrowRight1} sortIcon={assets.imgUilSort} />
  </section>;
}
