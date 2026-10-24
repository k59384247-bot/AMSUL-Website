import assets from "@/data/assets.json";
import { landing } from "@/data/landing";
import { ImpactStatistics } from "./impact-statistics";
import { PartnerGrid } from "./partner-grid";
import { Hero } from "./hero";
import { HistoryTimeline } from "./history-timeline";
import { ButtonLink, ReservedSection, SectionHeading } from "./ui";
import { Carousel } from "./carousel";
import { BenefitCard, EventCard, InitiativeCard, ReportCard, StoryCard } from "./content-cards";

export function LandingPage() {
  return <>
    <Hero badge={landing.hero.badge} title={<>{landing.hero.title}<br />{landing.hero.since}</>} nodeId="739:13366" introduction={<><p>{landing.hero.description}</p><div className="button-row"><ButtonLink href="/partnerships/become-a-partner">Partner With AMSUL</ButtonLink><ButtonLink href="#impact" secondary arrow>Explore Our Impact</ButtonLink></div></>} />
    <section className="partners-section container section" data-node-id="80:1652">
      <SectionHeading {...landing.partners} />
      <PartnerGrid partners={landing.partners.items.map(partner => ({ ...partner, image: assets["80-1652-imgImage48"] }))} />
    </section>
    <ImpactStatistics statistics={landing.statistics} nodeId="80:3601" />
    <ReservedSection id="122:1448" />
    <section className="history-section section container" data-node-id="80:1697">
      <SectionHeading {...landing.history} centered />
      <HistoryTimeline milestones={landing.history.milestones} />
    </section>
    <section className="reports-section section container" data-node-id="80:1963">
      <SectionHeading {...landing.reports}><ButtonLink href="/impact-reports" arrow arrowSrc={assets["80-1963-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      <Carousel label="Impact reports" className="report-carousel">{landing.reports.items.map(report => <ReportCard key={report.id} report={report} />)}</Carousel>
    </section>
    <section className="events-section section container" data-node-id="80:2022">
      <SectionHeading {...landing.events}><ButtonLink href="/programs-events" arrow arrowSrc={assets["80-2022-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      <InitiativeCard {...landing.events.featured} featured tags={[{ label: landing.events.featured.category, dot: false }]} />
      <Carousel label="Upcoming events" controls className="event-carousel">{landing.events.items.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}</Carousel>
    </section>
    <ReservedSection id="80:2317" />
    <section className="stories-section section container" data-node-id="80:2407">
      <SectionHeading {...landing.stories}><ButtonLink href="/blog" arrow arrowSrc={assets["80-2407-imgPajamasArrowRight"]}>View All</ButtonLink></SectionHeading>
      <Carousel label="Stories and insights" className="story-carousel">{landing.stories.items.map(story => <StoryCard key={story.id} story={story} />)}</Carousel>
    </section>
    <section className="partnership-section section container" data-node-id="80:2518">
      <div className="partnership-copy"><SectionHeading eyebrow={landing.partnership.eyebrow} title={landing.partnership.title} /><div className="partnership-paragraphs">{landing.partnership.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div><div className="button-row"><ButtonLink href="/partnerships/become-a-partner">Become A Partner</ButtonLink><ButtonLink href="/partnerships" secondary arrow arrowSrc={assets["80-2518-imgPajamasArrowRight"]}>View More Details</ButtonLink></div></div>
      <div className="benefits">{landing.partnership.benefits.map(benefit => <BenefitCard key={benefit.number} {...benefit} inlineNumber={benefit.number === "02"} />)}</div>
    </section>
  </>;
}
