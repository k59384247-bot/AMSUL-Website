"use client";

import { useRef, useState, type FormEvent } from "react";
import assets from "@/data/impact-assets.json";

import { Carousel } from "./carousel";
import { ReportCard } from "./content-cards";
import { Pagination } from "./pagination";
import { useWebsiteData, DataStatus } from "./website-data";
import { postsOf, postCard, eventCard, programCard, upcomingEvents } from "@/lib/website/selectors";
import { CategoryFilters, ListingSearch } from "./listing-controls";

export function ImpactReportHub() {
  const { feed, loading, error } = useWebsiteData();
  const impactReports = postsOf(feed, 'reports').map(post => postCard(post, feed, 'reports'));
  const reportInitiatives = feed.categories.filter(category => impactReports.some(report => report.categoryIds.includes(category.slug))).map(category => ({ id: category.slug, name: category.name }));
  const featured = postsOf(feed, 'reports').filter(post => post.featured).map(post => postCard(post, feed, 'reports'));
  const [category, setCategory] = useState("all");
  const categories = [{ id: "all", name: `All categories (${impactReports.length})` }, ...reportInitiatives];
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const grid = useRef<HTMLDivElement>(null);
  if (loading || (error && !impactReports.length)) return <DataStatus />;
  const filtered = impactReports.filter(report => (category === "all" || report.categoryIds.includes(category)) && `${report.title} ${report.excerpt} ${report.initiative}`.toLowerCase().includes(query.toLowerCase()));
  const pageCount = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const initiativeCount = new Set(filtered.flatMap(report => report.categoryIds)).size;

  function changeCategory(value: string) { setCategory(value); setPage(1); }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setQuery(draft.trim()); setPage(1); }
  function changePage(next: number) { setPage(next); grid.current?.focus({ preventScroll: true }); grid.current?.scrollIntoView({ block: "start", behavior: "instant" }); }
  function reset() { setDraft(""); setQuery(""); setCategory("all"); setPage(1); }

  return <section className="report-hub-content section container" data-node-id="217:3124">
    <Carousel label="Featured reports" controls dots arrowSrc={assets.imgPajamasArrowRight1} className="featured-carousel featured-report-carousel">{featured.map(report => <ReportCard key={report.id} report={report} featured={{ category: report.initiative, arrowSrc: assets.imgPajamasArrowRight, starSrc: assets.imgPhStarFourFill }} />)}</Carousel>
    <div className="report-filters listing-filter-controls"><CategoryFilters id="report-category-label" items={categories} value={category} onChange={changeCategory} />
      <div className="report-search-row listing-filter-search-row"><ListingSearch id="report-search" label="Search Report" placeholder="Search Report" value={draft} onChange={setDraft} onSubmit={search} icon={assets.imgSiSearchFill} /><CategoryFilters mobile id="report-category-label-mobile" items={categories} value={category} onChange={changeCategory} /><p className="report-result-count" role="status">Showing <strong>{filtered.length}</strong> published reports across <strong>{initiativeCount}</strong> {initiativeCount === 1 ? "initiative" : "initiatives"}</p></div>
    </div>
    <div ref={grid} className="report-grid" tabIndex={-1} role="region" aria-label="Published impact reports">{visible.map(report => <ReportCard key={report.id} report={report} />)}{visible.length === 0 && <div className="report-empty"><h2>No reports found</h2><p>Try another search or category.</p><button className="button" onClick={reset}>Clear filters</button></div>}</div>
    <Pagination page={page} pageCount={pageCount} pageSize={pageSize} onPageChange={changePage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} previousIcon={assets.imgPajamasArrowRight2} nextIcon={assets.imgPajamasArrowRight3} sortIcon={assets.imgUilSort} />
  </section>;
}
