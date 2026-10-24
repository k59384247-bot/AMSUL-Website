export type SiteLink = { label: string; href: string; hidden?: boolean };

export const partnershipCallout = {
  eyebrow: "Partnership", title: "Building the Next Generation of Healthcare Leaders",
  description: "For sixty years, AMSUL has remained committed to empowering medical students to lead with compassion, excellence and purpose. As we celebrate our legacy, we look forward to building an even stronger future through innovation, collaboration and service.",
};

const navigationGroups: { label: string; footerLabel: string; links: SiteLink[] }[] = [
  { label: "About Us", footerLabel: "About", links: [
    { label: "About AMSUL", href: "/about" },
    { label: "Leadership", href: "/leadership" },
    { label: "Subsidiaries", href: "/subsidiaries", hidden: true },
    { label: "Alumni Network", href: "/alumni", hidden: true },
    { label: "Constitution", href: "/constitution", hidden: true },
  ] },
  { label: "Our Work", footerLabel: "Our Work", links: [
    { label: "Programs & Events", href: "/programs-events" },
    { label: "Impact Reports", href: "/impact-reports" },
    { label: "Partnerships", href: "/partnerships" },
    { label: "Event Highlights", href: "/event-highlights" },
  ] },
  { label: "Resources", footerLabel: "Resources", links: [
    { label: "Blog & News", href: "/blog" },
  ] },
  { label: "Get Involved", footerLabel: "Get Involved", links: [
    { label: "Contact Us", href: "/contact" },
    { label: "Payments & Dues", href: "/payments", hidden: true },
    { label: "Elections", href: "/elections", hidden: true },
  ] },
];

export const navigation = navigationGroups.map(group => ({
  ...group, links: group.links.filter(link => !link.hidden),
}));

export const contact = {
  email: "support@amsul.org",
  socialLabel: "@amsul_unilag",
  newsletterText: "Subscribe to our newsletter for the latest AMSUL news, upcoming events, and stories of impact.",
};

export const routes = [
  ...navigationGroups.flatMap(group => group.links),
  { label: "Become A Partner", href: "/partnerships/become-a-partner" },
  { label: "AMSUL Health Week 2025", href: "/impact-reports/amsul-health-week-2025" },
  { label: "BUSINESS SUMMIT 2025", href: "/event-highlights/business-summit-2025" },
  { label: "MR & MISS AMSUL 2025", href: "/event-highlights/mr-miss-amsul-2025" },
  { label: "AMSUL HEALTHWEEK 2026", href: "/programs-events/amsul-healthweek-2026" },
  { label: "MR & MISS AMSUL 2026", href: "/programs-events/mr-miss-amsul-2026" },
  { label: "AMSUL BUSINESS SUMMIT 2026", href: "/programs-events/amsul-business-summit-2026" },
  { label: "AMSUL Hosts National Medical Conference", href: "/blog/amsul-hosts-national-medical-conference" },
  { label: "Dear Future Doctor: It Is Okay to Be Undecided", href: "/blog/dear-future-doctor-it-is-okay-to-be-undecided" },
  { label: "Mortality rate, neonatal (per 1000 live births) - Nigeria", href: "/blog/neonatal-mortality-nigeria" },
] satisfies SiteLink[];
