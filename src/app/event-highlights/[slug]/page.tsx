import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/data/site";
import { highlightDetails } from "@/data/highlight-details";
import assets from "@/data/highlight-detail-assets.json";
import { SiteHeader } from "@/components/site-header";
import { PlannedPage } from "@/components/planned-page";
import { Icon, Tag } from "@/components/ui";
import { ArticleContent } from "@/components/article-content";
import { Sponsors } from "@/components/sponsors";
import { PictureGallery } from "@/components/picture-gallery";
import { EventPicturesAction } from "@/components/event-pictures-action";
import { StoryCard, ReportCard } from "@/components/content-cards";
import "@/components/detail-content.css";
import "./highlight-details.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return routes.filter(route => route.href.startsWith("/event-highlights/")).map(route => ({ slug: route.href.slice("/event-highlights/".length) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const highlight = highlightDetails.find(item => item.slug === slug);
  return { title: highlight?.title || routes.find(route => route.href === `/event-highlights/${slug}`)?.label || "Highlight not found", ...(!highlight && { robots: { index: false, follow: false } }) };
}

export default async function HighlightDetailsPage({ params }: Props) {
  const { slug } = await params;
  const highlight = highlightDetails.find(item => item.slug === slug);
  if (!highlight) {
    const route = routes.find(route => route.href === `/event-highlights/${slug}`);
    if (!route) notFound();
    return <PlannedPage title={route.label} />;
  }
  return <div className="highlight-details-page" data-node-id="562:13505"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="highlight-detail-intro section container" aria-labelledby="highlight-title" data-node-id="562:13545"><div className="highlight-detail-heading">
      <Link className="button detail-back-link" href="/event-highlights"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Event Highlights</Link>
      <div className="highlight-detail-titles"><div className="highlight-detail-tags">{highlight.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="highlight-title">{highlight.title}</h1></div>
      <div className="highlight-detail-meta"><span><Icon src={assets.imgLetsIconsDateTodayDuotone} />{highlight.date}</span><a href={highlight.venueSearchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Find ${highlight.location} on Google Maps (opens in a new tab)`}><span><Icon src={assets.imgDuoIconsLocation} />{highlight.location}</span><span className="highlight-venue-out-icon"><Icon src={assets.imgGroup1} /></span></a></div>
    </div><div className="detail-cover" aria-hidden="true" data-node-id="562:13596" /></section>
    <section className="highlight-detail-body section container" aria-label="Event highlight content" data-node-id="562:13603"><div className="highlight-detail-content"><ArticleContent sections={highlight.sections} /><PictureGallery pictures={highlight.pictures} /></div><aside className="highlight-detail-sidebar" aria-label="Event sponsors and pictures"><Sponsors sponsors={highlight.sponsors} /><EventPicturesAction content={highlight.album} icon={assets.imgGroup2} /></aside></section>
    <section className="highlight-related section container" aria-labelledby="highlight-related-title" data-node-id="562:13664"><h2 id="highlight-related-title">{highlight.relatedHeading}</h2><div className="highlight-related-grid">{highlight.related.map(item => <StoryCard key={item.id} story={item} location={{ label: item.location, icon: assets.imgDuoIconsLocation1 }} dateIconSrc={assets.imgLetsIconsDateTodayDuotone1} className="event-highlight-card past-event-card" tagsBelowImage={item.tagsBelowImage} />)}<ReportCard report={highlight.relatedReport} /></div></section>
  </main></div>;
}
