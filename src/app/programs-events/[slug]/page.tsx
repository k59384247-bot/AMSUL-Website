import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/data/site";
import { eventDetails } from "@/data/event-details";
import assets from "@/data/event-detail-assets.json";
import { PlannedPage } from "@/components/planned-page";
import { SiteHeader } from "@/components/site-header";
import { ArticleContent } from "@/components/article-content";
import { EventCard } from "@/components/content-cards";
import { Sponsors } from "@/components/sponsors";
import { EventRegistration } from "@/components/event-registration";
import { Icon, Tag } from "@/components/ui";
import "@/components/detail-content.css";
import "./event-details.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return routes.filter(route => route.href.startsWith("/programs-events/")).map(route => ({ slug: route.href.slice("/programs-events/".length) })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = eventDetails.find(item => item.slug === slug);
  return { title: event?.title || routes.find(route => route.href === `/programs-events/${slug}`)?.label || "Event not found", ...(!event && { robots: { index: false, follow: false } }) };
}

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  const event = eventDetails.find(item => item.slug === slug);
  if (!event) {
    const route = routes.find(route => route.href === `/programs-events/${slug}`);
    if (!route) notFound();
    return <PlannedPage title={route.label} />;
  }
  return <div className="event-details-page" data-node-id="269:6377"><SiteHeader className="detail-header" /><main id="main-content">
    <section className="event-detail-intro section container" aria-labelledby="event-title" data-node-id="269:6417">
      <div className="event-detail-heading"><Link className="button detail-back-link" href="/programs-events"><Icon src={assets.imgPajamasArrowRight} className="arrow-back" />Back to Programs &amp; Events</Link>
        <div className="event-detail-titles"><div className="event-detail-tags">{event.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div><h1 id="event-title">{event.title}</h1></div>
        <div className="event-detail-meta"><span><Icon src={assets.imgLetsIconsDateTodayDuotone} />{event.date}</span><span><span className="event-detail-timer"><Icon src={assets.imgMaskGroup} /></span>{event.time}</span><a href={event.venueSearchUrl} target="_blank" rel="noopener noreferrer" aria-label={`Find ${event.location} on Google Maps (opens in a new tab)`}><span><Icon src={assets.imgDuoIconsLocation} />{event.location}</span><span className="event-venue-out-icon"><Icon src={assets.imgGroup1} /></span></a></div>
      </div><div className="detail-cover" aria-hidden="true" data-node-id="269:6463" />
    </section>
    <section className="event-detail-body section container" aria-label="Event information" data-node-id="467:9013">
      <div className="event-detail-information"><div className="event-description"><ArticleContent sections={event.sections} /><div className="event-body-meta"><span><Icon src={assets.imgDuoIconsLocation1} />{event.location}</span><span><Icon src={assets.imgLetsIconsDateTodayDuotone1} />{event.bodyDate}</span><span><span className="event-body-timer"><Icon src={assets.imgMaskGroup1} /></span>{event.bodyTime}</span></div></div>
        <Sponsors sponsors={event.sponsors.map((name, index) => ({ id: `event-sponsor-${index + 1}`, name, logo: assets.imgImage48 }))} />
      </div>
      <aside className="event-registration-options" aria-label="Event registration options"><EventRegistration content={event.registration} externalIcon={assets.imgGroup2} /><EventRegistration content={event.registration} external externalIcon={assets.imgGroup2} /></aside>
    </section>
    <section className="event-related section container" aria-labelledby="event-related-title" data-node-id="269:6494"><h2 id="event-related-title">{event.relatedHeading}</h2><div className="event-related-grid">{event.related.map(item => <EventCard key={item.id} event={item} groupMetadata icons={{ date: assets.imgLetsIconsDateTodayDuotone2, location: assets.imgDuoIconsLocation2, timer: assets.imgMaskGroup2 }} />)}</div></section>
  </main></div>;
}
