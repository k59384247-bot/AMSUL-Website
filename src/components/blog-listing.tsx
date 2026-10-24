"use client";

import { useRef, useState, type FormEvent } from "react";
import assets from "@/data/blog-assets.json";
import { blog, blogCategories, blogContentTypes, blogPosts } from "@/data/blog";
import { Carousel } from "./carousel";
import { StoryCard } from "./content-cards";
import { CategoryFilters, ListingSearch, ListingSelect } from "./listing-controls";
import { Pagination } from "./pagination";

export function BlogListing() {
  const [category, setCategory] = useState("all");
  const categories = [{ id: "all", name: "All categories" }, ...blogCategories];
  const [contentType, setContentType] = useState("all");
  const [sort, setSort] = useState("latest");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const grid = useRef<HTMLDivElement>(null);
  const filtered = blogPosts.filter(post => (category === "all" || post.categoryId === category) && (contentType === "all" || post.tags[0] === contentType) && `${post.title} ${post.excerpt} ${post.author} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => sort === "latest" ? b.publishedAt.localeCompare(a.publishedAt) : a.publishedAt.localeCompare(b.publishedAt));
  const visible = sorted.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(sorted.length / pageSize);
  function changeCategory(value: string) { setCategory(value); setPage(1); }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setQuery(draft.trim()); setPage(1); }
  function reset() { setDraft(""); setQuery(""); setCategory("all"); setContentType("all"); setPage(1); }
  function changePage(next: number) { setPage(next); grid.current?.focus({ preventScroll: true }); grid.current?.scrollIntoView({ block: "start", behavior: "instant" }); }
  return <section className="blog-listing-content section container" data-node-id="246:3248">
    <Carousel label="Featured articles" controls dots arrowSrc={assets.imgPajamasArrowRight1} className="featured-carousel featured-blog-carousel">{blog.featured.map(story => <StoryCard key={story.id} story={story} featured={{ tags: story.tags, arrowSrc: assets.imgPajamasArrowRight, starSrc: assets.imgPhStarFourFill }} />)}</Carousel>
    <div className="blog-filters listing-filter-controls"><CategoryFilters id="blog-category-label" items={categories} value={category} onChange={changeCategory} />
      <div className="blog-search-row listing-filter-search-row"><ListingSearch id="blog-search" label="Search articles" placeholder="Search Report" value={draft} onChange={setDraft} onSubmit={search} icon={assets.imgSiSearchFill} /><CategoryFilters mobile id="blog-category-label-mobile" items={categories} value={category} onChange={changeCategory} />
        <ListingSelect label="Content Type:" value={contentType} onChange={value => { setContentType(value); setPage(1); }} options={[{ value: "all", label: "All Types" }, ...blogContentTypes.map(type => ({ value: type, label: type }))]} icon={assets.imgOcticonChevronDown12} className={contentType !== "all" ? "has-selected-type" : ""} />
        <ListingSelect label="Sort By:" value={sort} onChange={value => { setSort(value); setPage(1); }} options={[{ value: "latest", label: "Latest" }, { value: "oldest", label: "Oldest" }]} icon={assets.imgOcticonChevronDown12} className="sort-select" />
      </div>
    </div>
    <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "article" : "articles"} found</p>
    <div ref={grid} className="blog-grid" role="region" aria-label="Published articles" tabIndex={-1}>{visible.map(story => <StoryCard key={story.id} story={story} dateIconSrc={assets[story.tags[0] === "News" ? "imgLetsIconsDateTodayDuotone1" : "imgLetsIconsDateTodayDuotone"]} />)}{visible.length === 0 && <div className="listing-empty"><h2>No articles found</h2><p>Try another search, category or content type.</p><button className="button" onClick={reset}>Clear filters</button></div>}</div>
    <Pagination page={page} pageCount={pageCount} pageSize={pageSize} pageSizeOptions={[6, 12, 15]} label="Blog results pagination" onPageChange={changePage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} previousIcon={assets.imgPajamasArrowRight2} nextIcon={assets.imgPajamasArrowRight3} sortIcon={assets.imgUilSort} />
  </section>;
}
