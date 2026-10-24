import { reportSummary } from "./landing";

export const reportInitiatives = [
  { id: "healthweek", name: "HealthWeek" },
  { id: "amsul-games", name: "AMSUL Games" },
  { id: "iwd", name: "IWD" },
  { id: "election", name: "Election" },
  { id: "academic", name: "Academic" },
  { id: "quiz-club", name: "Quiz Club" },
  { id: "freshers-week", name: "Freshers’ Week" },
  { id: "community-outreach", name: "Community Outreach" },
  { id: "create-club", name: "Create Club" },
  { id: "senate", name: "Senate" },
  { id: "editorial-board", name: "Editorial Board" },
  { id: "amsul-games-2", name: "AMSUL Games" },
];

// shortcut: the hub supplies repeated report copy;
// replace these sample records with approved unique reports and the agreed public content source later.
export const impactReports = Array.from({ length: 24 }, (_, index) => ({
  id: `impact-report-${index + 1}`,
  title: "AMSUL Health Week 2025",
  excerpt: reportSummary,
  href: "/impact-reports/amsul-health-week-2025",
  initiativeId: reportInitiatives[index % reportInitiatives.length].id,
  initiative: reportInitiatives[index % reportInitiatives.length].name,
}));

export const impactHub = {
  hero: {
    badge: "IMPACT REPORTS", title: "Measuring Progress.", subtitle: "Documenting Impact.",
    description: "Every initiative tells a story. Explore detailed reports documenting AMSUL's programmes, partnerships, events and community impact over the years. Building trust through transparency.",
  },
  featured: impactReports.slice(0, 4),
};
