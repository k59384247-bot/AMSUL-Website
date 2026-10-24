import Link from "next/link";
import assets from "@/data/assets.json";
import { Icon, Tag } from "./ui";

export function BenefitCard({ number, title, description, additionalText, inlineNumber = false }: {
  number: string; title: string; description: string; additionalText?: string; inlineNumber?: boolean;
}) {
  return <article className={`benefit ${inlineNumber ? "benefit-inline-number" : ""}`}>
    <span className="benefit-number">{number}</span><h3>{title}</h3><p>{description}{additionalText && <><br />{additionalText}</>}</p>
  </article>;
}

export function InitiativeCard({ title, excerpt, additionalText, href, tags = [], featured = false, programme }: {
  title: string; excerpt: string; additionalText?: string; href: string; tags?: { label: string; dot?: boolean }[]; featured?: boolean; programme?: { count: string; date: string; dateIcon: string };
}) {
  return <Link href={href} className={`content-card ${featured ? "featured-event" : "initiative-card"} ${programme ? "programme-card" : ""}`}>
    <div className="card-image">
      {tags.length > 0 && <div className="featured-category">{tags.map(tag => <Tag key={tag.label} dot={tag.dot}>{tag.label}</Tag>)}</div>}
      <div className="featured-copy">{programme ? <><div className="programme-title"><h3>{title}</h3><span aria-hidden="true" /><p>{programme.count}</p></div><p className="programme-date"><Icon src={programme.dateIcon} />{programme.date}</p></> : <h3>{title}</h3>}<p>{excerpt}{additionalText && <><br />{additionalText}</>}</p></div>
    </div>
  </Link>;
}

export function FeaturedContentCard({ item, tags, linkLabel, arrowSrc, starSrc, className = "", kind }: {
  item: { id?: string; title: string; excerpt: string; href: string }; tags: string[];
  linkLabel: string; arrowSrc: string; starSrc: string; className?: string; kind: "report" | "article" | "event";
}) {
  return <article className={`content-card featured-content-card ${className}`} data-report-id={kind === "report" ? item.id : undefined} data-story-id={kind === "article" ? item.id : undefined} data-event-id={kind === "event" ? item.id : undefined}>
    <Link className="featured-content-image" href={item.href} aria-label={`View ${kind}: ${item.title}`} />
    <div className="featured-content-copy"><h2><Link href={item.href}>{item.title}</Link></h2><p>{item.excerpt}</p><Link className="featured-content-link" href={item.href}>{linkLabel}<Icon src={arrowSrc} /></Link></div>
    <div className="featured-content-tags"><Tag dot={false}><Icon src={starSrc} />Featured</Tag>{tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>
  </article>;
}

export function ReportCard({ report, featured }: {
  report: { id?: string; title: string; excerpt: string; href: string };
  featured?: { category: string; arrowSrc: string; starSrc: string };
}) {
  if (featured) return <FeaturedContentCard item={report} tags={[featured.category]} linkLabel="View Report" arrowSrc={featured.arrowSrc} starSrc={featured.starSrc} className="featured-report" kind="report" />;
  return <Link href={report.href} className="content-card report-card" data-report-id={report.id}>
    <div className="card-image report-image"><Tag>Report</Tag></div>
    <div className="card-body"><h3>{report.title}</h3><div className="report-description"><p>{report.excerpt}</p></div></div>
  </Link>;
}

export function EventCard({ event, index = 0, icons, groupMetadata = false }: {
  event: { id?: string; title: string; program?: string; category: string; date: string; location: string; time: string; priceLabel: string | null; href: string };
  index?: number; icons?: { date: string; location: string; timer: string }; groupMetadata?: boolean;
}) {
  const date = <span><Icon src={icons?.date || assets[index === 1 ? "80-2022-imgLetsIconsDateTodayDuotone1" : "80-2022-imgLetsIconsDateTodayDuotone"]} className="event-icon" />{event.date}</span>;
  const location = <span><Icon src={icons?.location || assets["80-2022-imgDuoIconsLocation"]} className="event-icon" />{event.location}</span>;
  const time = <span><Icon src={icons?.timer || assets[index === 1 ? "80-2022-imgMaskGroup1" : "80-2022-imgMaskGroup"]} className="timer-icon" />{event.time}</span>;
  return <Link href={event.href} className="content-card event-card" data-event-id={event.id}>
    <div className="card-image event-image"><div className="event-tags">{event.program && <Tag>{event.program}</Tag>}<Tag dot={false}>{event.category}</Tag></div>
      <div className="event-card-content"><div className="event-title-row"><h3>{event.title}</h3>{event.priceLabel && <span className="event-price">{event.priceLabel}</span>}</div>
        <div className="event-meta">{groupMetadata ? <div className="event-meta-details">{date}{location}</div> : <>{date}{location}</>}{time}</div>
      </div>
    </div>
  </Link>;
}

export function StoryCard({ story, dateIconSrc = assets["80-2407-imgLetsIconsDateTodayDuotone"], featured, location, className = "", tagsBelowImage = false }: {
  story: { id?: string; title: string; excerpt: string; author?: string; date: string; tags: string[]; href: string };
  tagsBelowImage?: boolean; className?: string; location?: { label: string; icon: string }; dateIconSrc?: string; featured?: { tags: string[]; arrowSrc: string; starSrc: string };
}) {
  if (featured) return <FeaturedContentCard item={story} tags={featured.tags} linkLabel="View More" arrowSrc={featured.arrowSrc} starSrc={featured.starSrc} className="featured-story" kind="article" />;
  return <Link href={story.href} className={`content-card story-card ${className}`} data-story-id={story.id}>
    <div className="card-image story-image">{!tagsBelowImage && <div className="story-tags">{story.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>}</div>
    {tagsBelowImage && <div className="story-tags-below">{story.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>}
    <div className="card-body"><h3>{story.title}</h3><p>{story.excerpt}</p>
      <div className="story-meta"><span>{location ? <><Icon src={location.icon} />{location.label}</> : <><span className="author-avatar" aria-hidden="true" />{story.author}</>}</span><span><Icon src={dateIconSrc} />{story.date}</span></div>
    </div>
  </Link>;
}
