"use client";
import Link from "next/link";
import { highlightDetails } from "@/data/highlight-details";
import assets from "@/data/highlight-detail-assets.json";
import { SiteHeader } from "@/components/site-header";
import { Icon, Tag } from "@/components/ui";
import { ArticleContent } from "@/components/article-content";
import { Sponsors } from "@/components/sponsors";
import { PictureGallery } from "@/components/picture-gallery";
import { EventPicturesAction } from "@/components/event-pictures-action";
import { StoryCard, ReportCard } from "@/components/content-cards";
import "@/components/detail-content.css";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWebsiteData, useRecordDetail } from './website-data';
import { DetailState } from './detail-state';
import { ContentCover } from './content-cover';
import { postsOf, slugOf } from '@/lib/website/selectors';
import { contentDetail, eventDetail } from '@/lib/website/detail-adapters';
import "@/app/event-highlights/[slug]/highlight-details.css";

export function HighlightDetailsView({ slug: initialSlug }: { slug: string }) {
  const { feed, loading, error, retry } = useWebsiteData();
  const [slug, setSlug] = useState(initialSlug);
  const pathname = usePathname();
  useEffect(() => { setSlug(initialSlug === '__detail' ? decodeURIComponent(window.location.pathname.split('/').filter(Boolean).at(-1) ?? '') : initialSlug); }, [initialSlug, pathname]);
  const record = postsOf(feed, 'highlights').find(item => slugOf(item) === slug);
  const detail = useRecordDetail('posts', record?.id);
  const linkedEvent = useRecordDetail('events', record?.eventId ?? undefined);
  useEffect(() => { if (record) document.title = `${record.title} | AMSUL`; }, [record]);
  if (loading || slug === '__detail') return <DetailState />;
  if (error) return <DetailState error={error} retry={retry} />;
  if (!record) return <DetailState missing />;
  if (detail.error) return <DetailState error={detail.error} retry={detail.retry} />;
  if (linkedEvent.error) return <DetailState error={linkedEvent.error} retry={linkedEvent.retry} />;
  if (!detail.data || !linkedEvent.data) return <DetailState />;
  const highlight = { ...highlightDetails[0], ...contentDetail(record, feed, { ...detail.data, media: linkedEvent.data.media, sponsors: linkedEvent.data.sponsors }, 'highlights') };
  return <div className="highlight-details-page" data-node-id="562:13505"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="highlight-detail-intro section container" aria-labelledby="highlight-title" data-node-id="562:13545"><div className="highlight-detail-heading">
      <Link className="button detail-back-link" href="/event-highlights"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Event Highlights</Link>
      <div className="highlight-detail-titles"><div className="highlight-detail-tags">{highlight.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="highlight-title">{highlight.title}</h1></div>
      <div className="highlight-detail-meta"><span><Icon src={assets.imgLetsIconsDateTodayDuotone} />{highlight.date}</span><a href={highlight.venueSearchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Find ${highlight.location} on Google Maps (opens in a new tab)`}><span><Icon src={assets.imgDuoIconsLocation} />{highlight.location}</span><span className="highlight-venue-out-icon"><Icon src={assets.imgGroup1} /></span></a></div>
    </div><div className="detail-cover"  data-node-id="562:13596" ><ContentCover src={highlight.coverImageUrl} priority /></div></section>
    <section className="highlight-detail-body section container" aria-label="Event highlight content" data-node-id="562:13603"><div className="highlight-detail-content"><ArticleContent body={highlight.body} /><PictureGallery pictures={highlight.pictures} /></div><aside className="highlight-detail-sidebar" aria-label="Event sponsors and pictures"><Sponsors sponsors={highlight.sponsors} />{highlight.album.url && <EventPicturesAction content={highlight.album} icon={assets.imgGroup2} />}</aside></section>
    <section className="highlight-related section container" aria-labelledby="highlight-related-title" data-node-id="562:13664"><h2 id="highlight-related-title">{highlight.relatedHeading}</h2><div className="highlight-related-grid">{highlight.related.map(item => <StoryCard key={item.id} story={item} location={{ label: item.location, icon: assets.imgDuoIconsLocation1 }} dateIconSrc={assets.imgLetsIconsDateTodayDuotone1} className="event-highlight-card past-event-card" tagsBelowImage={item.tagsBelowImage} />)}{highlight.relatedReport && <ReportCard report={highlight.relatedReport} />}</div></section>
  </main></div>;
}
