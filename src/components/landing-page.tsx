"use client";
import { landingImageSrcSet } from "@/lib/landing-image";
import { ContentSkeleton } from "./content-skeleton";
import { useWebsiteData, DataStatus } from "./website-data";
import { postsOf, postCard, eventCard, upcomingEvents } from "@/lib/website/selectors";
import assets from "@/data/assets.json";
import { landing } from "@/data/landing";
import { partnershipFormUrl } from "@/data/site";
import { ImpactStatistics } from "./impact-statistics";
import { PartnerGrid } from "./partner-grid";
import { Hero } from "./hero";
import { HistoryTimeline } from "./history-timeline";
import { ButtonLink, SectionHeading } from "./ui";
import { Carousel } from "./carousel";
import { BenefitCard, EventCard, InitiativeCard, ReportCard, StoryCard } from "./content-cards";

export function LandingPage() {
  const { feed, loading } = useWebsiteData();
  const reports = postsOf(feed, 'reports').slice(0, 4).map(post => postCard(post, feed, 'reports'));
  const stories = postsOf(feed, 'blog').slice(0, 5).map(post => postCard(post, feed));
  const events = upcomingEvents(feed).map(event => eventCard(event, feed));
  const featured = events.find(event => feed.events.find(item => item.id === event.id)?.featured);
  return <>
    <Hero badge={landing.hero.badge} title={<>{landing.hero.title}<br />{landing.hero.since}</>} nodeId="739:13366" images={landing.hero.images} introduction={<><p>{landing.hero.description}</p><div className="button-row"><ButtonLink href={partnershipFormUrl}>Partner With AMSUL</ButtonLink><ButtonLink href="/impact-reports" secondary arrow>Explore Our Impact</ButtonLink></div></>} />
    <section className="partners-section container section" data-node-id="80:1652">
      <SectionHeading {...landing.partners} />
      <PartnerGrid className="landing-partner-grid" partners={landing.partners.items} />
    </section>
    <ImpactStatistics statistics={landing.statistics} nodeId="80:3601" />
    <section className="landing-photo container"><img src={landing.photos[0]} srcSet={landingImageSrcSet(landing.photos[0])} sizes="(max-width: 700px) 100vw, 1248px" alt="" loading="lazy" /></section>
    <section className="history-section landing-history section container" data-node-id="80:1697">
      <SectionHeading {...landing.history} centered />
      <HistoryTimeline milestones={landing.history.milestones} />
    </section>
    <section className="reports-section section container" data-node-id="80:1963">
      <SectionHeading {...landing.reports}><ButtonLink href="/impact-reports" arrow arrowSrc={assets["80-1963-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      <DataStatus contained={false} /><Carousel label="Impact reports" className="report-carousel">{reports.map(report => <ReportCard key={report.id} report={report} />)}</Carousel>
    </section>
    <section className="events-section section container" data-node-id="80:2022">
      <SectionHeading {...landing.events}><ButtonLink href="/programs-events" arrow arrowSrc={assets["80-2022-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      {loading && <ContentSkeleton variant="events" contained={false} />}
      {featured && <InitiativeCard {...featured} featured tags={featured.tags.map(label => ({ label }))} />}
      <Carousel label="Upcoming events" controls className="event-carousel">{events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}</Carousel>
    </section>
    <section className="landing-photo container"><img src={landing.photos[1]} srcSet={landingImageSrcSet(landing.photos[1])} sizes="(max-width: 700px) 100vw, 1248px" alt="" loading="lazy" /></section>
    <section className="stories-section section container" data-node-id="80:2407">
      <SectionHeading {...landing.stories}><ButtonLink href="/blog" arrow arrowSrc={assets["80-2407-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      {loading && <ContentSkeleton contained={false} />}<Carousel label="Stories and insights" className="story-carousel">{stories.map(story => <StoryCard key={story.id} story={story} />)}</Carousel>
    </section>
    <section className="partnership-section section container" data-node-id="80:2518">
      <div className="partnership-copy"><SectionHeading eyebrow={landing.partnership.eyebrow} title={landing.partnership.title} /><div className="partnership-paragraphs">{landing.partnership.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><div className="button-row"><ButtonLink href={partnershipFormUrl}>Become A Partner</ButtonLink><ButtonLink href="/partnerships" secondary arrow arrowSrc={assets["80-2518-imgPajamasArrowRight"]}>View More Details</ButtonLink></div></div>
      <div className="benefits">{landing.partnership.benefits.map(benefit => <BenefitCard key={benefit.number} {...benefit} inlineNumber={benefit.number === "02"} />)}</div>
    </section>
  </>;
}
