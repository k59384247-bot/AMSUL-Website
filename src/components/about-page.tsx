"use client";
import { useState, type CSSProperties } from "react";
import { useWebsiteData, DataStatus } from "./website-data";
import { programCard } from "@/lib/website/selectors";
import assets from "@/data/about-assets.json";
import { about } from "@/data/about";
import { Hero } from "./hero";
import { HistoryTimeline } from "./history-timeline";
import { ActivityCard, InitiativeCard } from "./content-cards";
import { Carousel } from "./carousel";
import { SectionHeading } from "./ui";
import { PartnershipCallout } from "./partnership-callout";

export function AboutPage() {
  const [activeStatistic, setActiveStatistic] = useState(0);
  const { feed } = useWebsiteData();
  const initiatives = feed.programs.map(program => ({
    ...programCard(program),
    title: program.slug === "freshers-week" || /^elixir week\b/i.test(program.title)
      ? "Freshers Week"
      : program.title.replace(/\s+2026$/, ""),
  }));
  return <main id="main-content" className="about-page">
    <Hero badge={about.hero.badge} title={<>{about.hero.title}<br />{about.hero.subtitle}</>} centered backgroundImage={about.hero.image} nodeId="991:21511" />
    <section className="about-introduction section container" data-node-id="192:1304">
      <p className="eyebrow">{about.introduction.eyebrow}</p>
      <div className="about-introduction-columns"><h2>{about.introduction.title}</h2><div className="about-paragraphs">{about.introduction.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
    </section>
    <section className="about-statistics section container" aria-label="AMSUL in numbers" data-node-id="192:1378">
      <div className="about-statistics-track" style={{ "--active-stat": activeStatistic } as CSSProperties} onMouseLeave={() => setActiveStatistic(0)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveStatistic(0); }}>
      <span className="about-stat-indicator" aria-hidden="true" />
      <div className={`about-stat ${activeStatistic === 0 ? "is-active" : ""}`} tabIndex={0} onMouseEnter={() => setActiveStatistic(0)} onFocus={() => setActiveStatistic(0)}><p className="about-stat-value">{about.statistics.rank}<span>{about.statistics.rankUnit}</span></p><p className="about-stat-label">{about.statistics.rankLabels.map(label => <span key={label}>{label}</span>)}</p></div>
      <div className={`about-stat ${activeStatistic === 1 ? "is-active" : ""}`} tabIndex={0} onMouseEnter={() => setActiveStatistic(1)} onFocus={() => setActiveStatistic(1)}><p className="about-stat-value">{about.statistics.students}</p><p className="student-label">{about.statistics.studentLabel}</p></div>
      <div className={`about-stat ${activeStatistic === 2 ? "is-active" : ""}`} tabIndex={0} onMouseEnter={() => setActiveStatistic(2)} onFocus={() => setActiveStatistic(2)}><p className="about-stat-value">{about.statistics.alumni}<span>{about.statistics.alumniUnit}</span>+</p><p className="about-stat-label">{about.statistics.alumniLabel}</p></div>
      </div>
    </section>
    <section className="about-class-section container" aria-label="AMSUL class photos" data-node-id="921:23355">
      <Carousel label="AMSUL class photos" controls autoplay className="about-class-carousel" arrowSrc={assets.imgPajamasArrowRight}>{about.classes.map(item => <div key={item.id} className={`about-class-slide about-class-${item.id}`} aria-label={item.label}>{item.image && <img src={item.image} alt={`${item.label} class`} loading="lazy" />}<span>{item.label}</span></div>)}</Carousel>
    </section>
    <section className="about-purpose section container" data-node-id="195:4117">
      <SectionHeading eyebrow={about.purpose.eyebrow} title={about.purpose.title} centered />
      <div className="purpose-grid"><div className="purpose-photo"><img src={assets.imgImage54} alt={about.purpose.photoAlt} /></div><div className="purpose-copy"><article className="purpose-mission"><h3>{about.purpose.mission.title}</h3><p>{about.purpose.mission.description}</p></article><article className="purpose-vision"><h3>{about.purpose.vision.title}</h3><p>{about.purpose.vision.description}</p></article></div></div>
    </section>
    <section className="history-section about-history section container" data-node-id="192:1401"><SectionHeading {...about.history} centered /><HistoryTimeline milestones={about.history.milestones} /></section>
    <section className="about-activities section container" data-node-id="195:3720"><div className="activities-top"><SectionHeading eyebrow={about.activities.eyebrow} title={about.activities.title} description={about.activities.description} /><div className="activities-side">{about.activities.items.slice(0, 1).map(item => <ActivityCard key={item.id} {...item} />)}</div></div><div className="activities-bottom">{about.activities.items.slice(1).map(item => <ActivityCard key={item.id} {...item} />)}</div></section>
    <section className="about-initiatives section container" data-node-id="192:1673"><SectionHeading {...about.initiatives} centered /><DataStatus variant="events" contained={false} />{initiatives[0] && <InitiativeCard {...initiatives[0]} featured />}<Carousel label="Flagship initiatives" controls arrowSrc={assets.imgPajamasArrowRight}>{initiatives.slice(1).map(item => <InitiativeCard key={item.id} {...item} />)}</Carousel></section>
    <PartnershipCallout nodeId="921:23720" />
  </main>;
}
