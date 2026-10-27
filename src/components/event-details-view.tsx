"use client";
import Link from "next/link";
import { eventDetails } from "@/data/event-details";
import assets from "@/data/event-detail-assets.json";
import { SiteHeader } from "@/components/site-header";
import { ArticleContent } from "@/components/article-content";
import { EventCard } from "@/components/content-cards";
import { Sponsors } from "@/components/sponsors";
import { EventRegistration } from "@/components/event-registration";
import { Icon, Tag } from "@/components/ui";
import "@/components/detail-content.css";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWebsiteData, useRecordDetail } from './website-data';
import { DetailState } from './detail-state';
import { ContentCover } from './content-cover';
import { postsOf, slugOf } from '@/lib/website/selectors';
import { contentDetail, eventDetail } from '@/lib/website/detail-adapters';
import "@/app/programs-events/[slug]/event-details.css";

export function EventDetailsView({ slug: initialSlug }: { slug: string }) {
  const { feed, loading, error, retry } = useWebsiteData();
  const [slug, setSlug] = useState(initialSlug);
  const pathname = usePathname();
  useEffect(() => { setSlug(initialSlug === '__detail' ? decodeURIComponent(window.location.pathname.split('/').filter(Boolean).at(-1) ?? '') : initialSlug); }, [initialSlug, pathname]);
  const record = feed.events.find(item => slugOf(item) === slug) ?? feed.programs.find(item => slugOf(item) === slug);
  const program = !!record && feed.programs.some(item => item.id === record.id);
  const detail = useRecordDetail(program ? 'programs' : 'events', record?.id);
  useEffect(() => { if (record) document.title = `${record.title} | AMSUL`; }, [record]);
  if (loading || slug === '__detail') return <DetailState />;
  if (error) return <DetailState error={error} retry={retry} />;
  if (!record) return <DetailState missing />;
  if (detail.error) return <DetailState error={detail.error} retry={detail.retry} />;
  if (!detail.data) return <DetailState />;
  const event = { ...eventDetails[0], ...eventDetail(record, feed, detail.data, program) };
  return <div className="event-details-page" data-node-id="269:6377"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="event-detail-intro section container" aria-labelledby="event-title" data-node-id="269:6417">
      <div className="event-detail-heading"><Link className="button detail-back-link" href="/programs-events"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Programs &amp; Events</Link>
        <div className="event-detail-titles"><div className="event-detail-tags">{event.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="event-title">{event.title}</h1></div>
        <div className="event-detail-meta"><span><Icon src={assets.imgLetsIconsDateTodayDuotone} />{event.date}</span><span><span className="event-detail-timer"><Icon src={assets.imgMaskGroup} /></span>{event.time}</span><a href={event.venueSearchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Find ${event.location} on Google Maps (opens in a new tab)`}><span><Icon src={assets.imgDuoIconsLocation} />{event.location}</span><span className="event-venue-out-icon"><Icon src={assets.imgGroup1} /></span></a></div>
      </div><div className="detail-cover"  data-node-id="269:6463" ><ContentCover src={event.coverImageUrl} priority /></div>
    </section>
    <section className="event-detail-body section container" aria-label="Event information" data-node-id="467:9013">
      <div className="event-detail-information"><div className="event-description"><ArticleContent body={event.body} /><div className="event-body-meta"><span><Icon src={assets.imgDuoIconsLocation1} />{event.location}</span><span><Icon src={assets.imgLetsIconsDateTodayDuotone1} />{event.bodyDate}</span><span><span className="event-body-timer"><Icon src={assets.imgMaskGroup1} /></span>{event.bodyTime}</span></div></div>
        <Sponsors sponsors={event.sponsors} />
      </div>
      <aside className="event-registration-options" aria-label="Event registration options">{event.registrationRecord && <EventRegistration content={event.registration} externalIcon={assets.imgGroup2} record={event.registrationRecord} />}</aside>
    </section>
    <section className="event-related section container" aria-labelledby="event-related-title" data-node-id="269:6494"><h2 id="event-related-title">{event.relatedHeading}</h2><div className="event-related-grid">{event.related.map(item => <EventCard key={item.id} event={item} groupMetadata icons={{ date: assets.imgLetsIconsDateTodayDuotone2, location: assets.imgDuoIconsLocation2, timer: assets.imgMaskGroup2 }} />)}</div></section>
  </main></div>;
}
