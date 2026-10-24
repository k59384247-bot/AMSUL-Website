import { reportSummary } from "./landing";
import { reportInitiatives } from "./impact-reports";

export const blogCategories = reportInitiatives;
export const blogContentTypes = ["Content Type", "Publication", "News"];

// shortcut: Figma repeats one article, with placeholder taxonomy and media; replace these samples with approved published posts later.
export const blogPosts = Array.from({ length: 12 }, (_, index) => ({
  id: `blog-post-${index + 1}`,
  title: "Mortality rate, neonatal (per 1000 live births) - Nigeria",
  excerpt: reportSummary, author: "Ajala Michael", date: "July 1st, 2026", publishedAt: "2026-07-01",
  tags: index === 1 || index === 4 ? ["Publication", "Research", "Editorial Board"] : index === 2 || index === 5 ? ["News", "Election", "Electoral Committee"] : ["Content Type", "Category", "Content Unit"],
  categoryId: index === 2 || index === 5 ? "election" : index === 1 || index === 4 ? "editorial-board" : blogCategories[index].id,
  href: "/blog/dear-future-doctor-it-is-okay-to-be-undecided",
}));

export const blog = {
  hero: {
    badge: "STORIES & INSIGHTS", title: "Stories AND NEWS That Inform, Inspire and Connect.",
    description: "Explore news, achievements, public health campaigns, student stories, opportunities and updates from across the AMSUL community.",
  },
  featured: Array.from({ length: 4 }, (_, index) => ({
    ...blogPosts[0], id: `featured-story-${index + 1}`, title: "AMSUL Hosts National Medical Conference", tags: ["Category", "Content Type"],
    href: "/blog/amsul-hosts-national-medical-conference",
  })),
};
