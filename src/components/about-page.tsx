"use client";
import { useWebsiteData, DataStatus } from "./website-data";
import { programCard } from "@/lib/website/selectors";
import assets from "@/data/about-assets.json";
import { about } from "@/data/about";
import { Hero } from "./hero";
import { HistoryTimeline } from "./history-timeline";
import { BenefitCard, InitiativeCard } from "./content-cards";
import { Carousel } from "./carousel";
import { ReservedSection, SectionHeading } from "./ui";
import { PartnershipCallout } from "./partnership-callout";

export function AboutPage() {
  const { feed } = useWebsiteData();
  const initiatives = feed.programs.map(programCard);
  return <main id="main-content" className="about-page">
    <Hero badge={about.hero.badge} title={<>{about.hero.title}<br />{about.hero.subtitle}</>} centered nodeId="192:2153" />
    <section className="about-introduction section container" data-node-id="192:1304">
      <p className="eyebrow">{about.introduction.eyebrow}</p>
      <div className="about-introduction-columns"><h2>{about.introduction.title}</h2><div className="about-paragraphs">{about.introduction.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
    </section>
    <section className="about-statistics section container" aria-label="AMSUL in numbers" data-node-id="192:1378">
      <div className="about-stat"><p className="about-stat-value">{about.statistics.students}</p><p className="student-label">{about.statistics.studentLabel}</p></div>
      <div className="about-stat"><p className="about-stat-value">{about.statistics.rank}<span>{about.statistics.rankUnit}</span></p><p className="about-stat-label">{about.statistics.rankLabels.map(label => <span key={label}>{label}</span>)}</p></div>
      <div className="about-stat"><p className="about-stat-value">{about.statistics.alumni}<span>{about.statistics.alumniUnit}</span>+</p><p className="about-stat-label">{about.statistics.alumniLabel}</p></div>
    </section>
    <ReservedSection id="192:1399" />
    <section className="about-purpose section container" data-node-id="195:4117">
      <SectionHeading eyebrow={about.purpose.eyebrow} title={about.purpose.title} centered />
      <div className="purpose-grid"><div className="purpose-photo"><img src={assets.imgImage54} alt={about.purpose.photoAlt} /></div><div className="purpose-copy"><article className="purpose-mission"><h3>{about.purpose.mission.title}</h3><p>{about.purpose.mission.description}</p></article><article className="purpose-vision"><h3>{about.purpose.vision.title}</h3><p>{about.purpose.vision.description}</p></article></div></div>
    </section>
    <section className="history-section about-history section container" data-node-id="192:1401"><SectionHeading {...about.history} centered /><HistoryTimeline milestones={about.history.milestones} twoSided /></section>
    <section className="about-activities section container" data-node-id="195:3720"><div className="activities-top"><SectionHeading eyebrow={about.activities.eyebrow} title={about.activities.title} description={about.activities.description} /><div className="activities-side">{about.activities.items.slice(0, 2).map(item => <BenefitCard key={item.id} {...item} />)}</div></div><div className="activities-bottom">{about.activities.items.slice(2).map(item => <BenefitCard key={item.id} {...item} />)}</div></section>
    <section className="about-initiatives section container" data-node-id="192:1673"><SectionHeading {...about.initiatives} centered /><DataStatus />{initiatives[0] && <InitiativeCard {...initiatives[0]} featured />}<Carousel label="Flagship initiatives" controls arrowSrc={assets.imgPajamasArrowRight}>{initiatives.slice(1).map(item => <InitiativeCard key={item.id} {...item} />)}</Carousel></section>
    <PartnershipCallout nodeId="210:1594" />
  </main>;
}
