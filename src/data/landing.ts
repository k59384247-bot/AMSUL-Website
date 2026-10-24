// Figma sample content stays separate from presentation. Replace these exports with
// normalized public API results when dashboard integration is requested.
export const reportSummary = "Explore reports documenting the outcomes, reach, and achievements of AMSUL initiatives and programs.";

export const landing = {
  hero: {
    badge: "MEDICINE BEYOND TIME",
    title: "Shaping Medical Leaders. Creating Impact.",
    since: "Since 1966",
    description: "For six decades, the Association of Medical Students, University of Lagos has nurtured generations of healthcare professionals through leadership, advocacy, service, and excellence.",
  },
  partners: {
    eyebrow: "Partners", title: "Trusted By Leading Organizations",
    description: "AMSUL has collaborated with organizations committed to advancing healthcare, education, and community development.",
    // shortcut: the design repeats one partner mark; replace with approved organizations before launch.
    items: Array.from({ length: 12 }, (_, index) => ({ id: `partner-${index + 1}`, name: `Partner logo ${index + 1}` })),
  },
  statistics: [
    { value: "10k+", label: "Alumni", tone: "wine" },
    { value: "25+", label: "Annual Events", tone: "gold" },
    { value: "20+", label: "Awards", tone: "gold" },
    { value: "100+", label: "Community Outreaches", tone: "wine" },
  ],
  history: {
    eyebrow: "1966 — 2026", title: "A Legacy Six Decades Strong",
    description: "From generations of student leaders to thousands of medical professionals impacting lives across the world, AMSUL has remained a symbol of leadership, advocacy, and excellence.",
    milestones: Array.from({ length: 5 }, (_, index) => ({
      id: `milestone-${index + 1}`, year: "1966", title: "Born From God",
      description: "We are so proud to be made by God, from God and in his in image",
    })),
  },
  reports: {
    eyebrow: "Impact Reports", title: "Impact You Can Measure", description: reportSummary,
    items: Array.from({ length: 4 }, (_, index) => ({
      id: `report-${index + 1}`, title: "AMSUL Health Week 2025", excerpt: reportSummary,
      href: "/impact-reports/amsul-health-week-2025",
    })),
  },
  events: {
    eyebrow: "Upcoming Events", title: "What's Happening Next",
    description: "Discover upcoming events, conferences, and initiatives shaping the AMSUL experience.",
    featured: {
      title: "AMSUL HEALTHWEEK 2026", category: "Category", excerpt: reportSummary,
      additionalText: "Explore reports documenting the outcomes, reach,",
      href: "/programs-events/amsul-healthweek-2026",
    },
    items: Array.from({ length: 3 }, (_, index) => ({
      id: `event-${index + 1}`, title: "AMSUL BUSINESS SUMMIT 2026",
      program: index === 0 ? "NAME OF PROGRAMME" : "AMSUL HEALTHWEEK", category: index === 0 ? "Category" : "Entrepreneurship",
      date: index === 1 ? "Wed.,  July 1st" : "Wed.,  July 1st, 2026",
      location: "Old Great Hall, LUTH", time: "10:00AM - 2:00PM", priceLabel: index === 1 ? null : "$5000",
      href: "/programs-events/amsul-business-summit-2026",
    })),
  },
  stories: {
    eyebrow: "Stories & Insights", title: "Stories That Matter",
    description: "From student achievements to public health awareness and opportunities, discover stories shaping our community.",
    items: Array.from({ length: 5 }, (_, index) => ({
      id: `story-${index + 1}`, title: "Mortality rate, neonatal (per 1000 live births) - Nigeria",
      excerpt: reportSummary, author: "Ajala Michael", date: "July 1st, 2026",
      tags: index === 0 ? ["Content Type", "Category", "Content Unit"] : index === 1 ? ["Publication", "Research", "Editorial Board"] : ["News", "Election", "Electoral Committee"],
      href: "/blog/dear-future-doctor-it-is-okay-to-be-undecided",
    })),
  },
  partnership: {
    eyebrow: "Partnership", title: "Partner With A Legacy Of Excellence",
    paragraphs: [
      "Join us in advancing medical education, leadership development, public health advocacy, and community impact.",
      "Together, we can create the next chapter of AMSUL's story.",
    ],
    benefits: ["01", "02", "03"].map(number => ({ number, title: "AMSUL Health Week 2025", description: reportSummary, additionalText: "Explore reports documenting the outcomes, reach," })),
  },
};
