import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Icon, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
import { FaqAccordion } from "@/components/faq-accordion";
import { contactPage } from "@/data/contact-page";
import assets from "@/data/contact-assets.json";
import "@/components/detail-content.css";
import "./contact.css";

export const metadata: Metadata = { title: "Contact Us", description: contactPage.hero.description };
export default function ContactPage() {
  return <main id="main-content" className="contact-page"><Hero {...contactPage.hero} centered nodeId="451:4923" />
    <section className="contact-content section container" aria-label="Contact AMSUL" data-node-id="451:4985"><div className="contact-information"><section className="contact-information-card" aria-labelledby="reach-out-title"><div className="contact-information-heading"><h2 id="reach-out-title">{contactPage.introduction.title}</h2><p>{contactPage.introduction.description}</p></div><div className="contact-channels">{contactPage.channels.map(channel => <a key={channel.id} href={channel.href} target={channel.newTab ? "_blank" : undefined} rel={channel.newTab ? "noopener noreferrer" : undefined}><span className="contact-channel-icon"><Icon src={channel.icon} /></span><span>{channel.label}</span></a>)}</div></section>
      <section className="contact-information-card" aria-labelledby="connect-title"><div className="contact-information-heading"><h2 id="connect-title">{contactPage.social.title}</h2><p>{contactPage.social.description}</p></div><div className="contact-social-row"><SocialLinks items={contactPage.social.items} className="contact-social-links" /><span>{contactPage.social.handle}</span></div></section>
    </div><ContactForm /></section>
    <section className="contact-faq section container" aria-label="Frequently asked questions" data-node-id="453:5977"><SectionHeading eyebrow={contactPage.faq.eyebrow} title={contactPage.faq.title} description={contactPage.faq.description} centered /><FaqAccordion items={contactPage.faq.items} plusIcon={assets.imgGroup1} minusIcon={assets.imgMynauiMinusSolid} /></section>
  </main>;
}
