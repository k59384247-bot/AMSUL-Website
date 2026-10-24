import { reportSummary } from "./landing";
import { eventHighlights } from "./event-highlights";

export const eventsPage = {
  hero: { badge: "PROGRAMS & EVENTS", title: "Experiences That Build Leaders.", description: "From flagship programmes and academic conferences to community outreach and student experiences, explore the initiatives shaping the AMSUL community." },
  introduction: "Discover upcoming events, conferences, and initiatives shaping the AMSUL experience.",
  featured: Array.from({ length: 4 }, (_, index) => ({ id: `featured-event-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026", excerpt: reportSummary, href: "/programs-events/amsul-business-summit-2026", tags: ["Event Type", "Category"] })),
  programmes: Array.from({ length: 4 }, (_, index) => ({ id: `programme-${index + 1}`, title: "AMSUL HEALTHWEEK 2026", excerpt: `${reportSummary} Explore reports documenting the outcomes, reach, `, count: "12 EVENTS", date: "1st November - 14th November, 2026", href: "/programs-events/amsul-healthweek-2026" })),
  // shortcut: preserve the four supplied cards, repeated dates and sample prices; replace with published Events/Programs records later.
  events: Array.from({ length: 4 }, (_, index) => ({
    id: `listing-event-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026", program: index === 0 ? "PROGRAMME" : index === 3 ? "AMSUL HEALTHWEEK" : undefined,
    category: index === 0 ? "Category" : "Entrepreneurship", date: index === 0 ? "Wed.,  July 1st" : "Wed.,  July 1st, 2026",
    startsAt: "2026-07-01", location: "Old Great Hall, LUTH", time: "10:00AM - 2:00PM", priceLabel: "$5000", isProgrammeEvent: index === 0 || index === 3,
    href: "/programs-events/amsul-business-summit-2026",
  })),
  highlights: eventHighlights.slice(0, 3),
};
