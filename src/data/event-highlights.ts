import { reportSummary } from "./landing";
import { reportInitiatives } from "./impact-reports";

export const highlightCategories = reportInitiatives;
// shortcut: only “All Types” is designed; Event is a local type until approved taxonomy is supplied.
export const highlightContentTypes = ["Event"];
export const highlightsPage = {
  hero: { badge: "EVENT HIGHLIGHTS", title: "EVENT HIGHLIGHTS", description: "Explore news, achievements, public health campaigns, student stories, opportunities and updates from across the AMSUL community." },
};

// shortcut: preserve the six identical Figma records. Their placeholder tags do not establish real category associations.
export const eventHighlights = Array.from({ length: 6 }, (_, index) => ({
  id: `event-highlight-${index + 1}`, title: "MR & MISS AMSUL 2025", excerpt: reportSummary,
  tags: ["Program Name", "Category"], categoryId: null as string | null, contentType: "Event",
  date: "July 1st, 2026", publishedAt: "2026-07-01", location: "Old Great Hall, LUTH",
  href: "/event-highlights/mr-miss-amsul-2025",
}));
