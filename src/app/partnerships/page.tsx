import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { BenefitCard } from "@/components/content-cards";
import { PartnershipCallout } from "@/components/partnership-callout";
import { PartnerGrid } from "@/components/partner-grid";
import { ImpactStatistics } from "@/components/impact-statistics";
import { BrochureDownload } from "@/components/brochure-download";
import { TestimonialCard } from "@/components/testimonial-card";
import { partnershipPage } from "@/data/partnership";
import assets from "@/data/partnership-assets.json";
import "./partnerships.css";

export const metadata: Metadata = { title: "Partnerships", description: partnershipPage.hero.introduction };
const partnerHref = "/partnerships/become-a-partner";

export default function PartnershipsPage() {
  return <main id="main-content" className="partnerships-page">
    <Hero badge={partnershipPage.hero.badge} title={partnershipPage.hero.title} nodeId="464:8610" introduction={<><p>{partnershipPage.hero.introduction}</p><div className="button-row"><ButtonLink href={partnerHref}>Become a Partner</ButtonLink><BrochureDownload file={partnershipPage.brochure} arrowSrc={assets.imgPajamasArrowRight} /></div></>} />
    <ImpactStatistics statistics={partnershipPage.statistics} repeatFirstRow title="IMPACT CHANGING THE WORLD" nodeId="464:8008" />
    <section className="partnership-benefits section container" data-node-id="464:5889"><div className="partnership-benefits-top"><div className="partnership-benefits-copy"><SectionHeading {...partnershipPage.benefits} /><ButtonLink href={partnerHref}>Become A Partner</ButtonLink></div><div className="partnership-benefits-side">{partnershipPage.benefits.items.slice(0,2).map(item => <BenefitCard key={item.id} {...item} />)}</div></div><div className="partnership-benefits-bottom">{partnershipPage.benefits.items.slice(2).map(item => <BenefitCard key={item.id} {...item} />)}</div></section>
    <section className="partners-section section container" data-node-id="467:8701"><SectionHeading {...partnershipPage.partners} /><PartnerGrid partners={partnershipPage.partners.items} /></section>
    <section className="partnership-testimonials" aria-label="Testimonials" data-node-id="464:7922"><SectionHeading {...partnershipPage.testimonials} centered /><div className="testimonial-grid">{partnershipPage.testimonials.items.map((item, index) => <TestimonialCard key={item.id} testimonials={partnershipPage.testimonials.items} initialIndex={index} />)}</div></section>
    <PartnershipCallout nodeId="470:9338" actions={[{label:"Become A Partner",href:partnerHref}]} />
  </main>;
}
